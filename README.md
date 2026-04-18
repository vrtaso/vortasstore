<div align="center">

```
██╗   ██╗ ██████╗ ██████╗ ████████╗ █████╗ ███████╗    ███████╗████████╗ ██████╗ ██████╗ ███████╗
██║   ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔════╝    ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
██║   ██║██║   ██║██████╔╝   ██║   ███████║███████╗    ███████╗   ██║   ██║   ██║██████╔╝█████╗  
╚██╗ ██╔╝██║   ██║██╔══██╗   ██║   ██╔══██║╚════██║    ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  
 ╚████╔╝ ╚██████╔╝██║  ██║   ██║   ██║  ██║███████║    ███████║   ██║   ╚██████╔╝██║  ██║███████╗
  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
```

**Тишина, обретшая форму.**

[![Website](https://img.shields.io/badge/🌐_vortas.store-online-black?style=for-the-badge&labelColor=111&color=333)](https://vortas.store)
[![Telegram](https://img.shields.io/badge/Telegram-канал-black?style=for-the-badge&logo=telegram&labelColor=111&color=333)](https://t.me/vortas_store)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-deployed-black?style=for-the-badge&logo=github&labelColor=111&color=333)](https://vortas.store)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-protected-black?style=for-the-badge&logo=cloudflare&labelColor=111&color=333)](https://cloudflare.com)

</div>

---

## ▎О проекте

**VORTAS STORE** — сайт-витрина дизайн-студии, специализирующейся на тёмной, готической графике. Без фреймворков. Без лишнего. Только чистый код и сильные образы.

Сайт обслуживает полный цикл заказа: от просмотра каталога до отправки заявки через форму, которая уходит напрямую в Telegram-бот.

---

## ▎Услуги

| Название | Описание | Цена |
|---|---|---|
| **VEXILLUM** | Рекламная и баннерная графика | от 700 ₽ / $8 |
| **EFFIGY** | Постеры и макеты для печати / соцсетей | от 1 200 ₽ / $14 |
| **TENEBRATION** | Ретушь и цветокоррекция фотографий | от 300 ₽ / $4 |
| **PACTLINGS** | Маскоты, адопты, наборы стикеров | от 500 ₽ / $7 |

---

## ▎Стек

```
HTML / CSS / JavaScript    — без фреймворков, всё с нуля
Cloudflare Workers         — API обработки заказов (worker.js)
Cloudflare KV              — rate-limiting запросов
Cloudflare DNS + CDN       — защита, кэш, HTTPS
GitHub Pages               — хостинг фронтенда
Telegram Bot API           — доставка заявок в бот
Google Fonts               — Cinzel Decorative, Cinzel, Rajdhani, Jost
Font Awesome 6.6           — иконки
```

---

## ▎Структура проекта

```
/
├── index.html          # Главная страница (каталог, FAQ, контакты)
├── order.html          # Форма заказа
├── style.css           # Все стили
├── worker.js           # Cloudflare Worker — API /api/order
├── wrangler.toml       # Конфиг Cloudflare Workers + KV namespace
├── CNAME               # Кастомный домен: vortas.store
├── logo.ico            # Фавикон
└── images/
    ├── vexillum.png        # Превью услуги VEXILLUM
    ├── effigy.png          # Превью услуги EFFIGY
    ├── tenebration.png     # Превью услуги TENEBRATION
    ├── pactlings_pc.png    # Превью PACTLINGS (десктоп)
    ├── pactlings_mb.png    # Превью PACTLINGS (мобайл)
    └── og-preview.png      # Open Graph превью для соцсетей
```

---

## ▎Деплой

Сайт деплоится через **GitHub Pages** с кастомным доменом.

```
git add .
git commit -m "update"
git push origin main
# ↑ этого достаточно — сайт обновляется автоматически
```

Для деплоя **Cloudflare Worker** (API заказов):

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

---

## ▎Переменные окружения (Worker)

| Переменная | Значение | Описание |
|---|---|---|
| `ALLOWED_ORIGIN` | `https://vortas.store` | CORS — разрешённый домен |
| `RATE_LIMIT` | KV Namespace | Хранилище для rate-limiting |

---

## ▎Контакты

<table>
  <tr>
    <td>🌐 Сайт</td>
    <td><a href="https://vortas.store">vortas.store</a></td>
  </tr>
  <tr>
    <td>📢 Канал</td>
    <td><a href="https://t.me/vortas_store">@vortas_store</a></td>
  </tr>
  <tr>
    <td>🤖 Помощник</td>
    <td><a href="https://t.me/vortashelp">@vortashelp</a></td>
  </tr>
  <tr>
    <td>✉️ Вопросы</td>
    <td><a href="https://t.me/vortasdesign">@vortasdesign</a></td>
  </tr>
  <tr>
    <td>📧 Email</td>
    <td>vortasdesignrus@gmail.com</td>
  </tr>
  <tr>
    <td>🕐 Часы работы</td>
    <td>10:00 – 18:00 (МСК / UTC+3)</td>
  </tr>
</table>

---

<div align="center">

*© 2026 VORTAS STORE. Все права защищены.*  
*Все материалы, дизайны и контент являются интеллектуальной собственностью VORTAS STORE.*

</div>
