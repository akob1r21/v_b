import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ====================================================
// 💀 Session Management
// ====================================================

function getSessionId() {
    let id = localStorage.getItem('funeral-session-id')
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem('funeral-session-id', id)
    }
    return id
}

const SESSION_ID = getSessionId()

async function apiFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'X-Session-Id': SESSION_ID,
        ...options.headers,
    }
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Что-то пошло не так в склепе...')
    }
    return res.json()
}

// ====================================================
// 💀 Loading Messages
// ====================================================

const LOADING_MESSAGES = [
    "Копаем могилу...",
    "Полируем надгробие...",
    "Пишем эпитафию кровью...",
    "Зажигаем свечи...",
    "Собираем скорбящих...",
    "Готовим панихиду...",
    "Вызываем священника...",
    "Заказываем гроб премиум-класса...",
]

// ====================================================
// 💀 Components
// ====================================================

function Particles() {
    return (
        <div className="atmosphere">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${5 + Math.random() * 4}s`,
                    }}
                />
            ))}
        </div>
    )
}

function Header() {
    return (
        <header className="header">
            <div className="header-skull">💀</div>
            <h1>Funeral for Stupid Decisions</h1>
            <p>Исповедай своё худшее решение. Мы устроим ему достойные похороны.</p>
        </header>
    )
}

function Confessional({ onSubmit, isLoading }) {
    const [mistake, setMistake] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!mistake.trim() || isLoading) return
        onSubmit(mistake.trim())
        setMistake('')
    }

    return (
        <motion.div
            className="confessional"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
        >
            <form className="confessional-box" onSubmit={handleSubmit}>
                <label className="confessional-label">
                    <span>🕯️</span> Исповедай свой грех...
                </label>
                <textarea
                    className="confessional-textarea"
                    placeholder="Я купил 47 доменных имён в 3 часа ночи, потому что думал стану технологическим магнатом..."
                    value={mistake}
                    onChange={(e) => setMistake(e.target.value)}
                    maxLength={500}
                    disabled={isLoading}
                />
                <div className="textarea-footer">
                    <span className="char-count">{mistake.length}/500</span>
                    <span className="lang-hint">
                        {mistake.length > 3 && (
                            /[\u0400-\u04FF]/.test(mistake) ? '🇷🇺 Русский' : '🇬🇧 English'
                        )}
                    </span>
                </div>
                <button type="submit" className="bury-btn" disabled={!mistake.trim() || isLoading}>
                    <span className="btn-icon">⚰️</span>
                    Похоронить это решение
                </button>
            </form>
        </motion.div>
    )
}

function LoadingCeremony() {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            className="loading-ceremony"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="coffin-loader">⚰️</div>
            <p className="loading-text">{LOADING_MESSAGES[msgIndex]}</p>
        </motion.div>
    )
}

function Gravestone({ data, onBuryAnother }) {
    return (
        <motion.div
            className="graveyard"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <motion.div
                className="gravestone"
                initial={{ rotateX: 30 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <h2 className="grave-rip">Покойся с Миром</h2>
                <div className="grave-mistake">{data.mistake}</div>
                <div className="grave-dates">{data.born} — {data.died}</div>
                <p className="grave-epitaph">{data.epitaph}</p>
                {data.causeOfDeath && (
                    <div className="grave-cause">
                        <span>⚕️</span> Причина смерти: {data.causeOfDeath}
                    </div>
                )}
            </motion.div>

            <motion.div
                className="panegyric"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <h3 className="panegyric-title">🕯️ Короткая Панихида</h3>
                <p className="panegyric-text">{data.eulogy}</p>
            </motion.div>

            <motion.div
                className="grave-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <button className="action-btn primary" onClick={onBuryAnother}>
                    ⚰️ Похоронить ещё
                </button>
            </motion.div>
        </motion.div>
    )
}

function Cemetery({ graves, onSelect, onDelete }) {
    if (graves.length === 0) return null

    return (
        <motion.section
            className="cemetery-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <h2 className="cemetery-title">🪦 Моё Кладбище</h2>
            <div className="cemetery-grid">
                {graves.map((grave, i) => (
                    <motion.div
                        key={grave.id || i}
                        className="mini-grave"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ scale: 1.03 }}
                    >
                        <div className="mini-grave-content" onClick={() => onSelect(grave)}>
                            <div className="mini-grave-icon">🪦</div>
                            <div className="mini-grave-name">{grave.mistake}</div>
                            <div className="mini-grave-date">{grave.died}</div>
                        </div>
                        <button
                            className="mini-grave-delete"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(grave.id)
                            }}
                            title="Удалить могилу"
                        >
                            ✕
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}

// ====================================================
// 💀 Main App
// ====================================================

export default function App() {
    const [view, setView] = useState('confess') // 'confess' | 'loading' | 'funeral'
    const [currentGrave, setCurrentGrave] = useState(null)
    const [graves, setGraves] = useState([])
    const [error, setError] = useState(null)

    // Load graves from server on mount
    const loadGraves = useCallback(async () => {
        try {
            const data = await apiFetch('/api/graves')
            setGraves(data)
        } catch (err) {
            console.error('Failed to load graves:', err)
        }
    }, [])

    useEffect(() => {
        loadGraves()
    }, [loadGraves])

    const handleBury = async (mistake) => {
        setError(null)
        setView('loading')

        try {
            const data = await apiFetch('/api/bury', {
                method: 'POST',
                body: JSON.stringify({ mistake }),
            })
            setCurrentGrave(data)
            setView('funeral')
            // Reload cemetery
            loadGraves()
        } catch (err) {
            setError(err.message || 'Что-то пошло ужасно не так в склепе.')
            setView('confess')
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiFetch(`/api/graves/${id}`, { method: 'DELETE' })
            setGraves(prev => prev.filter(g => g.id !== id))
            if (currentGrave && currentGrave.id === id) {
                setCurrentGrave(null)
                setView('confess')
            }
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    const handleBuryAnother = () => {
        setCurrentGrave(null)
        setView('confess')
    }

    const handleSelectGrave = (grave) => {
        setCurrentGrave(grave)
        setView('funeral')
    }

    return (
        <>
            <Particles />
            <div className="app-container">
                <Header />

                {error && (
                    <motion.div
                        className="error-box"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        💀 {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {view === 'confess' && (
                        <Confessional key="confess" onSubmit={handleBury} isLoading={false} />
                    )}
                    {view === 'loading' && <LoadingCeremony key="loading" />}
                    {view === 'funeral' && currentGrave && (
                        <Gravestone
                            key="funeral"
                            data={currentGrave}
                            onBuryAnother={handleBuryAnother}
                        />
                    )}
                </AnimatePresence>

                {view !== 'loading' && (
                    <Cemetery
                        graves={graves}
                        onSelect={handleSelectGrave}
                        onDelete={handleDelete}
                    />
                )}

                <footer className="app-footer">
                    <p>💀 Funeral for Stupid Decisions © {new Date().getFullYear()}</p>
                </footer>
            </div>
        </>
    )
}
