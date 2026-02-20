# 💀 Funeral for Stupid Decisions

> Похорони своё тупое решение с полными готическими почестями.
> Bury your stupid decision with full gothic honors.

## Скриншоты / Screenshots

- 🪦 Gothic gravestone with epitaph
- 🕯️ Animated funeral ceremony
- 📜 Hilarious eulogies in Russian & English
- 🗑️ Private cemetery per user

## Быстрый старт / Quick Start

### 1. Клонируем / Clone

```bash
git clone <your-repo-url>
cd vibe_coding
```

### 2. Устанавливаем зависимости / Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Запуск / Run

Нужно 2 терминала / Need 2 terminals:

**Терминал 1 — Backend (порт 3000):**
```bash
cd backend
npm run dev
```

**Терминал 2 — Frontend (порт 5173):**
```bash
cd frontend
npm run dev
```

### 4. Открой / Open

```
http://localhost:5173
```

## Технологии / Tech Stack

| Layer    | Tech                |
|----------|---------------------|
| Frontend | React + Vite        |
| Styling  | Vanilla CSS (Gothic)|
| Animations | Framer Motion     |
| Backend  | Node.js + Express   |
| Storage  | JSON file           |

## API

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/bury`         | Похоронить ошибку        |
| GET    | `/api/graves`       | Мои могилы (по сессии)   |
| DELETE | `/api/graves/:id`   | Удалить могилу           |
| GET    | `/api/health`       | Статус сервера           |

### Admin Endpoints

```bash
# Все могилы (нужен ключ)
curl http://localhost:3000/api/admin/graves?key=funeral-admin-2026

# Лог файл
curl http://localhost:3000/api/admin/logs?key=funeral-admin-2026
```

Ключ по умолчанию: `funeral-admin-2026`
Можно сменить через переменную `ADMIN_KEY`:
```bash
ADMIN_KEY=my-secret-key npm run dev
```

## На сервере / Production

```bash
# Backend
cd backend
PORT=3000 node server.js

# Frontend — собрать и раздать
cd frontend
npm run build
# dist/ папка готова для nginx/serve
npx serve dist -l 5173
```

## Лицензия / License

MIT — делай что хочешь 💀
