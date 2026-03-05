export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }


    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId   = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        return res.status(500).json({ error: 'Токены не настроены на сервере' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Поле message обязательно' });
    }

    try {
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        );

        const result = await telegramResponse.json();

        if (!telegramResponse.ok) {
            throw new Error(result.description || `Telegram error: ${telegramResponse.status}`);
        }

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error('Telegram send error:', error);
        return res.status(500).json({ error: error.message });
    }
}