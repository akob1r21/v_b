import express from 'express'
import cors from 'cors'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const ADMIN_KEY = process.env.ADMIN_KEY || 'funeral-admin-2026'

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// ====================================================
// 💀 Data Storage — JSON file for persistence
// ====================================================

const DATA_DIR = path.join(__dirname, 'data')
const GRAVES_FILE = path.join(DATA_DIR, 'graves.json')
const LOG_FILE = path.join(DATA_DIR, 'burials.log')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function loadGraves() {
    try {
        if (fs.existsSync(GRAVES_FILE)) {
            return JSON.parse(fs.readFileSync(GRAVES_FILE, 'utf-8'))
        }
    } catch (e) {
        console.error('Failed to load graves:', e.message)
    }
    return []
}

function saveGraves(graves) {
    fs.writeFileSync(GRAVES_FILE, JSON.stringify(graves, null, 2), 'utf-8')
}

function appendLog(entry) {
    const line = `[${new Date().toISOString()}] session=${entry.sessionId} | mistake="${entry.mistake}" | lang=${entry.lang}\n`
    fs.appendFileSync(LOG_FILE, line, 'utf-8')
}

let allGraves = loadGraves()

// ====================================================
// 💀 Language Detection — simple heuristic
// ====================================================

function detectLanguage(text) {
    const cyrillicCount = (text.match(/[\u0400-\u04FF]/g) || []).length
    const latinCount = (text.match(/[a-zA-Z]/g) || []).length
    const totalLetters = cyrillicCount + latinCount
    if (totalLetters === 0) return 'ru' // default
    return cyrillicCount / totalLetters > 0.3 ? 'ru' : 'en'
}

// ====================================================
// 💀 The Crypt — Epitaph & Eulogy Generation (RU + EN)
// ====================================================

const EPITAPHS = {
    ru: [
        (m) => `Здесь покоится «${m}» — решение настолько дерзкое, что даже Дарвин аплодировал.`,
        (m) => `Светлая память «${m}». В 3 часа ночи это казалось гениальной идеей.`,
        (m) => `«${m}» — ушло, но не забыто. В основном потому, что мы всё заскринили.`,
        (m) => `Покойся с миром, «${m}». Ты научило нас, как НЕ надо делать.`,
        (m) => `Любимое «${m}» — рождённое в самоуверенности, умершее от здравого смысла.`,
        (m) => `«${m}» — прекрасная катастрофа. Как фейерверк внутри квартиры.`,
        (m) => `Здесь лежит «${m}». Продержалось дольше, чем ожидалось, но недостаточно, чтобы иметь значение.`,
        (m) => `Памяти «${m}» — решения, доказавшего, что гравитация всегда побеждает.`,
        (m) => `«${m}» — идея, объединившая всех... в чувстве вторичного стыда.`,
        (m) => `Прощай, «${m}». Ты был спидбампом на шоссе мудрости.`,
        (m) => `Здесь покоится «${m}» — доказательство, что уверенность без компетентности — просто вайб.`,
        (m) => `«${m}» — легендарное решение. Не в хорошем смысле. Но легендарное.`,
    ],
    en: [
        (m) => `Here lies "${m}" — a decision so bold, even Darwin applauded.`,
        (m) => `In loving memory of "${m}". It seemed like a brilliant idea at 3am.`,
        (m) => `"${m}" — Gone but never forgotten. Mostly because we screenshot everything now.`,
        (m) => `Rest in peace, "${m}". You taught us all what NOT to do.`,
        (m) => `Beloved "${m}" — born in overconfidence, died in hindsight.`,
        (m) => `"${m}" — A beautiful disaster. Like a firework inside a house.`,
        (m) => `Here lies "${m}". It lasted longer than expected, but not long enough to matter.`,
        (m) => `In memory of "${m}" — a decision that proved gravity always wins.`,
        (m) => `"${m}" — the idea that united everyone... in secondhand embarrassment.`,
        (m) => `Farewell, "${m}". You were the speedbump on the highway of wisdom.`,
        (m) => `Here rests "${m}" — proof that confidence without competence is just vibes.`,
        (m) => `"${m}" — it was legendary. Not in a good way. But legendary.`,
    ],
}

const EULOGIES = {
    ru: [
        (m) => `Дорогие скорбящие, мы собрались здесь, чтобы проводить «${m}» в последний путь. Оно ворвалось в нашу жизнь как товарный поезд плохих решений и ушло так же — громко, с дымом и оставив всех в недоумении. Мы, возможно, никогда не поймём, зачем это произошло, но всегда будем помнить уроки, которые оно нам вбило. Пусть покоится в вечном кринже.`,
        (m) => `Друзья, мы здесь, чтобы почтить память «${m}». Некоторые решения делают нас сильнее. Это — заставило нас сомневаться во всём. Рождённое в момент безрассудного вдохновения, оно горело ярко — как мусорный контейнер. Оно научило нас смирению, сожалению и важности обдумывания больших идей. Тебя будут скучать. Наверное.`,
        (m) => `Сегодня мы провожаем «${m}» — решение, которое шло, чтобы наша мудрость могла бежать. Оно появилось в момент слабости и задержалось ровно настолько, чтобы вызвать максимальный стыд. Хотя оно ушло, его дух живёт в каждом моменте, когда мы думаем: «погоди, это вообще хорошая идея?» Спасибо за службу.`,
        (m) => `Склоним головы перед «${m}». На великом кладбище глупых решений это заслужило место в VIP-зоне. Оно было амбициозным, бесстрашным и абсолютно безумным. И всё же без него мы бы никогда не узнали истинного значения фразы «учиться на своих ошибках». Прощай, старый друг.`,
        (m) => `Мы предаём земле «${m}» — решение, бросившее вызов логике, разуму и базовой арифметике. Это был тот выбор, от которого ангелы плачут, а комики ликуют. Хоть и короткое, его влияние ощущалось во множестве групповых чатов. Опуская его в землю, мы обещаем стать лучше. Наверное. Может быть. Попробуем.`,
        (m) => `Сегодня мы хороним «${m}» — решение настолько уверенное, насколько и ошибочное. Оно вошло в нашу жизнь с размахом, а ушло с запретительным ордером от здравого смысла. Как и все великие трагедии, его можно было предотвратить. Но мы здесь, стоим у могилы, каким-то образом богаче опытом и беднее достоинством.`,
    ],
    en: [
        (m) => `Dearly departed, we gather here today to bid farewell to "${m}". It arrived in our lives like a freight train of bad judgment, and it left the same way — loudly, with smoke, and leaving everyone confused. We may never understand why it happened, but we will always remember the lessons it beat into us. May it rest in eternal cringe.`,
        (m) => `Friends, we are here to honor the memory of "${m}". Some decisions make us stronger. This one made us question everything. Born from a moment of reckless inspiration, it burned brightly — like a dumpster fire. It taught us humility, regret, and the importance of sleeping on big ideas. You will be missed. Sort of.`,
        (m) => `We come together to mourn "${m}" — a decision that walked so our wisdom could run. It appeared during a moment of weakness and stayed just long enough to cause maximum embarrassment. Though it is gone, its spirit lives on in every moment we pause and think "wait, is this actually a good idea?" Thank you for your service.`,
        (m) => `Let us bow our heads for "${m}". In the grand cemetery of stupid decisions, this one earned a premium plot. It was ambitious, it was fearless, it was absolutely unhinged. And yet, without it, we would never have known the true meaning of "learning the hard way." Goodbye, old friend. The world is slightly smarter without you.`,
        (m) => `Today we lay to rest "${m}" — a decision as confident as it was misguided. It entered our lives with swagger and left with a restraining order from common sense. Like all great tragedies, it was completely preventable. Yet here we are, standing at its grave, somehow richer in experience and poorer in dignity.`,
        (m) => `We commend to the earth "${m}", a decision that defied logic, reason, and basic math. It was the kind of choice that makes angels weep and comedians rejoice. Though short-lived, its impact was felt across multiple group chats. As we lower it into the ground, we promise to do better. Probably. Maybe. We'll try.`,
    ],
}

const CAUSES_OF_DEATH = {
    ru: [
        "Терминальное перемудривание",
        "Острая нехватка здравого смысла",
        "Хронический синдром самоуверенности",
        "Спонтанное самовозгорание логики",
        "Смерть от проверки реальностью",
        "Массивный отказ эго",
        "Передозировка плохими вайбами",
        "Поражён суровым светом утра",
        "Осложнения от чрезмерной дерзости",
        "Естественные последствия",
        "Фатальная встреча с ретроспективой",
        "Осложнения от принятия решений в 3 часа ночи",
    ],
    en: [
        "Terminal overthinking",
        "Acute lack of common sense",
        "Chronic overconfidence syndrome",
        "Spontaneous combustion of logic",
        "Death by reality check",
        "Massive ego failure",
        "Overdose of bad vibes",
        "Struck by the harsh light of dawn",
        "Complications from being too bold",
        "Natural consequences",
        "Fatal encounter with hindsight",
        "Complications arising from 3am decision-making",
    ],
}

// ====================================================
// 💀 Helpers
// ====================================================

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateRandomDate(yearStart, yearEnd) {
    const year = yearStart + Math.floor(Math.random() * (yearEnd - yearStart))
    const month = Math.floor(Math.random() * 12)
    const day = Math.floor(Math.random() * 28) + 1
    const monthsRu = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return { ru: `${day} ${monthsRu[month]} ${year}`, en: `${monthsEn[month]} ${day}, ${year}` }
}

function truncateMistake(mistake, maxLen = 80) {
    if (mistake.length <= maxLen) return mistake
    return mistake.substring(0, maxLen).trim() + '...'
}

// ====================================================
// 💀 Session Middleware — cookie-based UUID
// ====================================================

function sessionMiddleware(req, res, next) {
    let sessionId = req.headers['x-session-id']
    if (!sessionId) {
        sessionId = randomUUID()
    }
    req.sessionId = sessionId
    res.setHeader('X-Session-Id', sessionId)
    next()
}

app.use(sessionMiddleware)

// ====================================================
// 💀 API Endpoints
// ====================================================

// POST /api/bury — Submit a mistake for burial
app.post('/api/bury', (req, res) => {
    const { mistake } = req.body
    const sessionId = req.sessionId

    if (!mistake || typeof mistake !== 'string' || mistake.trim().length === 0) {
        return res.status(400).json({ error: 'Нужно исповедать ошибку, чтобы её похоронить.' })
    }

    const cleanMistake = mistake.trim()
    const lang = detectLanguage(cleanMistake)
    const shortMistake = truncateMistake(cleanMistake, 80)

    const bornDates = generateRandomDate(2015, 2025)
    const now = new Date()
    const diedRu = `${now.getDate()} ${['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][now.getMonth()]} ${now.getFullYear()}`
    const diedEn = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

    const epitaphFn = randomFrom(EPITAPHS[lang])
    const eulogyFn = randomFrom(EULOGIES[lang])
    const cause = randomFrom(CAUSES_OF_DEATH[lang])

    const graveData = {
        id: randomUUID(),
        sessionId,
        mistake: cleanMistake,
        born: lang === 'ru' ? bornDates.ru : bornDates.en,
        died: lang === 'ru' ? diedRu : diedEn,
        epitaph: epitaphFn(shortMistake),
        eulogy: eulogyFn(shortMistake),
        causeOfDeath: cause,
        lang,
        buriedAt: now.toISOString(),
    }

    // Save to memory + disk
    allGraves.push(graveData)
    saveGraves(allGraves)
    appendLog(graveData)

    // Simulate a 1.5-3s "burial ceremony" delay
    const delay = 1500 + Math.random() * 1500
    setTimeout(() => {
        res.json(graveData)
    }, delay)
})

// GET /api/graves — Get graves for current session only
app.get('/api/graves', (req, res) => {
    const sessionId = req.sessionId
    const userGraves = allGraves
        .filter(g => g.sessionId === sessionId)
        .sort((a, b) => new Date(b.buriedAt) - new Date(a.buriedAt))
    res.json(userGraves)
})

// DELETE /api/graves/:id — Delete a grave (only if owned by session)
app.delete('/api/graves/:id', (req, res) => {
    const { id } = req.params
    const sessionId = req.sessionId
    const index = allGraves.findIndex(g => g.id === id && g.sessionId === sessionId)

    if (index === -1) {
        return res.status(404).json({ error: 'Могила не найдена.' })
    }

    allGraves.splice(index, 1)
    saveGraves(allGraves)
    res.json({ success: true })
})

// GET /api/admin/graves — Admin view of ALL graves (requires key)
app.get('/api/admin/graves', (req, res) => {
    const key = req.query.key || req.headers['x-admin-key']
    if (key !== ADMIN_KEY) {
        return res.status(403).json({ error: 'Доступ запрещён.' })
    }

    const stats = {
        total: allGraves.length,
        sessions: [...new Set(allGraves.map(g => g.sessionId))].length,
        languages: {
            ru: allGraves.filter(g => g.lang === 'ru').length,
            en: allGraves.filter(g => g.lang === 'en').length,
        },
    }

    res.json({ stats, graves: allGraves.sort((a, b) => new Date(b.buriedAt) - new Date(a.buriedAt)) })
})

// GET /api/admin/logs — Read raw log file
app.get('/api/admin/logs', (req, res) => {
    const key = req.query.key || req.headers['x-admin-key']
    if (key !== ADMIN_KEY) {
        return res.status(403).json({ error: 'Доступ запрещён.' })
    }

    try {
        const logs = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf-8') : ''
        res.type('text/plain').send(logs || 'Лог пуст.')
    } catch (e) {
        res.status(500).json({ error: 'Ошибка чтения лога.' })
    }
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Склеп открыт. The crypt is open.',
        totalBurials: allGraves.length,
        timestamp: new Date().toISOString(),
    })
})

app.listen(PORT, () => {
    console.log(`\n💀 Склеп открыт на порту ${PORT}`)
    console.log(`   POST   /api/bury          — Похоронить ошибку`)
    console.log(`   GET    /api/graves         — Мои могилы`)
    console.log(`   DELETE /api/graves/:id     — Удалить могилу`)
    console.log(`   GET    /api/admin/graves   — [ADMIN] Все могилы`)
    console.log(`   GET    /api/admin/logs     — [ADMIN] Лог файл`)
    console.log(`   GET    /api/health         — Статус`)
    console.log(`\n   Admin key: ${ADMIN_KEY}\n`)
})
