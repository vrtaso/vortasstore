const RATE_LIMIT_MAX     = 3;
const RATE_LIMIT_WINDOW  = 3600;

const VALID_PRODUCTS  = ['VEXILLUM', 'EFFIGY', 'TENEBRATION', 'PACTLINGS'];
const VALID_PAYMENTS  = ['Рубли', 'Доллары'];
const VALID_URGENCY   = [
  'Стандарт (3-13 дней)',
  'Срочно (1-6 дней)',
  'Очень срочно (1-3 дня)',
  'Сверхсрочно (24 часа)',
];
const VALID_CONTACTS  = ['Telegram', 'Email'];

export default {
  async fetch(request, env) {

    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, env);
    }
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/order') {
      return corsResponse(json({ ok: false, error: 'Not found' }), 404, env);
    }
    const origin  = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://vortas.store';
    if (origin !== allowed) {
      return corsResponse(json({ ok: false, error: 'Forbidden' }), 403, env);
    }
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitError = await checkRateLimit(ip, env);
    if (rateLimitError) {
      return corsResponse(json({ ok: false, error: rateLimitError }), 429, env);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(json({ ok: false, error: 'Invalid JSON' }), 400, env);
    }
    if (body.website || body.phone2) {
      return corsResponse(json({ ok: true }), 200, env);
    }
    const validationError = validateOrder(body);
    if (validationError) {
      return corsResponse(json({ ok: false, error: validationError }), 422, env);
    }
    const message = buildMessage(body);

    try {
      const tgResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            chat_id:    env.CHAT_ID,
            text:       message,
            parse_mode: 'HTML',
          }),
        }
      );

      if (!tgResponse.ok) {
        const err = await tgResponse.json().catch(() => ({}));
        console.error('Telegram error:', err);
        return corsResponse(
          json({ ok: false, error: 'Ошибка службы уведомлений. Попробуйте позже.' }),
          502, env
        );
      }

      return corsResponse(json({ ok: true }), 200, env);

    } catch (err) {
      console.error('Fetch error:', err);
      return corsResponse(
        json({ ok: false, error: 'Сетевая ошибка. Попробуйте позже.' }),
        503, env
      );
    }
  },
};

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function corsResponse(body, status, env) {
  const allowed = env.ALLOWED_ORIGIN || 'https://vortas.store';
  const headers = {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
  if (!body) return new Response(null, { status, headers });
  const clone = new Response(body.body, { status, headers: { ...Object.fromEntries(body.headers), ...headers } });
  return clone;
}

function validateOrder(data) {
  const { contactType, contactField, product, payment, urgency } = data;

  if (!VALID_CONTACTS.includes(contactType))
    return 'Неверный способ связи';

  if (!contactField || typeof contactField !== 'string')
    return 'Контакт не указан';

  const contact = contactField.trim();

  if (contactType === 'Telegram') {
    if (!/^@[a-zA-Z0-9_]{5,32}$/.test(contact))
      return 'Неверный формат Telegram-юзернейма';
  } else {
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(contact))
      return 'Неверный формат email';
  }

  if (!VALID_PRODUCTS.includes(product))
    return 'Неверный товар';

  if (!VALID_PAYMENTS.includes(payment))
    return 'Неверный способ оплаты';

  if (!VALID_URGENCY.includes(urgency))
    return 'Неверная срочность';

  return null;
}

function buildMessage(data) {
    const { contactType, contactField, product, payment, urgency } = data;
    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    
    const esc = (s) => String(s).replace(/[<>&"]/g, c => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;'
    }[c]));

    return [
        '🛒  Новый заказ VORTAS STORE',
        '',
        `📱 Способ связи: <b>${esc(contactType)}</b>`,
        `👤 Контакт: <code>${esc(contactField.trim())}</code>`,
        `🖼 Товар: <b>${esc(product)}</b>`,
        `💳 Оплата: ${esc(payment)}`,
        `⏱ Срочность: ${esc(urgency)}`,
        '',
        `🕒 ${esc(now)} (МСК)`,
    ].join('\n');
}

async function checkRateLimit(ip, env) {
  if (!env.RATE_LIMIT) return null; 

  const key   = `rl:${ip}`;
  const entry = await env.RATE_LIMIT.get(key, { type: 'json' });

  const now    = Math.floor(Date.now() / 1000);
  const count  = entry && (now - entry.ts < RATE_LIMIT_WINDOW) ? entry.count : 0;

  if (count >= RATE_LIMIT_MAX) {
    const wait = RATE_LIMIT_WINDOW - (now - entry.ts);
    const mins = Math.ceil(wait / 60);
    return `Слишком много запросов. Попробуйте через ${mins} мин.`;
  }

  await env.RATE_LIMIT.put(
    key,
    JSON.stringify({ ts: entry?.ts || now, count: count + 1 }),
    { expirationTtl: RATE_LIMIT_WINDOW }
  );
  return null;
}
