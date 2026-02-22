import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ====================================================
// 💀 Session Management
// ====================================================

function getSessionId() {
    let id = localStorage.getItem('funeral-session-id')
    if (!id) {
        id = (self.crypto?.randomUUID?.() ?? Date.now().toString())
        localStorage.setItem('funeral-session-id', id)
    }
    return id
}

const SESSION_ID = getSessionId()

// frontend/src/App.jsx
const API_URL = 'http://188.212.124.117:3000' // Changed to localhost for your testing

async function apiFetch(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'X-Session-Id': SESSION_ID,
        ...options.headers,
    }
    const res = await fetch(`${API_URL}${path}`, { ...options, headers })
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
    "Призываем духов...",
    "Освящаем землю...",
]

// ====================================================
// 💀 Particles Component
// ====================================================

function Particles() {
    const particles = useRef(
        Array.from({ length: 12 }).map((_, i) => ({
            left: `${5 + (i * 8.3) % 90}%`,
            delay: `${i * 0.7}s`,
            duration: `${5 + (i * 0.9) % 5}s`,
        }))
    )

    return (
        <div className="atmosphere">
            {particles.current.map((p, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: p.left,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                    }}
                />
            ))}
        </div>
    )
}

// ====================================================
// 💀 Header
// ====================================================

function Header() {
    return (
        <header className="header">
            <div className="header-skull">💀</div>
            <h1>Funeral for Stupid Decisions</h1>
            <p>Исповедай своё худшее решение. Мы устроим ему достойные похороны.</p>
        </header>
    )
}

// ====================================================
// 💀 Confessional Input
// ====================================================

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

// ====================================================
// 💀 Stickman SVG Component
// ====================================================

function Stickman({ x, delay = 0, flipped = false, shovelAngle = 0 }) {
    return (
        <g transform={`translate(${x}, 0) ${flipped ? 'scale(-1,1)' : ''}`} style={{ animationDelay: `${delay}s` }}>
            {/* Head */}
            <circle cx="0" cy="-52" r="8" fill="none" stroke="#c8c8d8" strokeWidth="2" />
            {/* Body */}
            <line x1="0" y1="-44" x2="0" y2="-18" stroke="#c8c8d8" strokeWidth="2.5" />
            {/* Left leg */}
            <line x1="0" y1="-18" x2="-8" y2="0" stroke="#c8c8d8" strokeWidth="2.5" />
            {/* Right leg */}
            <line x1="0" y1="-18" x2="8" y2="0" stroke="#c8c8d8" strokeWidth="2.5" />
            {/* Left arm — static */}
            <line x1="0" y1="-38" x2="-12" y2="-26" stroke="#c8c8d8" strokeWidth="2" />
            {/* Right arm — animated digging */}
            <g className="dig-arm" style={{ transformOrigin: '0px -38px', animationDelay: `${delay}s` }}>
                <line x1="0" y1="-38" x2="14" y2="-24" stroke="#c8c8d8" strokeWidth="2" />
                {/* Shovel handle */}
                <line
                    x1="14" y1="-24"
                    x2={14 + Math.cos((shovelAngle * Math.PI) / 180) * 20}
                    y2={-24 + Math.sin((shovelAngle * Math.PI) / 180) * 20}
                    stroke="#8888aa"
                    strokeWidth="2"
                />
                {/* Shovel blade */}
                <rect
                    x={14 + Math.cos((shovelAngle * Math.PI) / 180) * 20 - 5}
                    y={-24 + Math.sin((shovelAngle * Math.PI) / 180) * 20}
                    width="10" height="6"
                    fill="#4a1a7a"
                    stroke="#7733bb"
                    strokeWidth="1"
                    transform={`rotate(${shovelAngle}, ${14 + Math.cos((shovelAngle * Math.PI) / 180) * 20}, ${-24 + Math.sin((shovelAngle * Math.PI) / 180) * 20})`}
                />
            </g>
        </g>
    )
}

// ====================================================
// 💀 Dirt Particle Burst
// ====================================================

function DirtParticles() {
    const dirticles = Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360
        const dist = 30 + Math.random() * 25
        return { angle, dist, delay: Math.random() * 0.8 }
    })

    return (
        <>
            {dirticles.map((d, i) => (
                <div
                    key={i}
                    className="dirt-particle"
                    style={{
                        '--angle': `${d.angle}deg`,
                        '--dist': `${d.dist}px`,
                        animationDelay: `${d.delay}s`,
                    }}
                />
            ))}
        </>
    )
}

// ====================================================
// 💀 Digging Scene (Loading State)
// ====================================================

function DiggingScene() {
    const [msgIndex, setMsgIndex] = useState(0)
    const [phase, setPhase] = useState(0) // 0=digging, 1=coffin lowering

    useEffect(() => {
        const msgInterval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
        }, 1800)
        const phaseInterval = setInterval(() => {
            setPhase(p => (p + 1) % 3)
        }, 2400)
        return () => {
            clearInterval(msgInterval)
            clearInterval(phaseInterval)
        }
    }, [])

    return (
        <motion.div
            className="digging-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Scene container */}
            <div className="scene-wrapper">
                {/* Ground line */}
                <div className="ground-line" />

                {/* Grave pit */}
                <div className="grave-pit">
                    <div className="grave-pit-inner" />
                </div>

                {/* Dirt particles burst zone */}
                <div className="dirt-burst-zone">
                    <DirtParticles />
                </div>

                {/* Stickmen SVG */}
                <svg
                    className="stickmen-svg"
                    viewBox="-100 -70 200 80"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Left stickman — digging into pit */}
                    <g className="stickman-dig-anim">
                        <Stickman x={-38} delay={0} shovelAngle={45} />
                    </g>
                    {/* Right stickman — throwing dirt */}
                    <g className="stickman-dig-anim-b">
                        <Stickman x={38} delay={0.6} flipped shovelAngle={30} />
                    </g>
                    {/* Middle stickman — supervisor, just standing */}
                    <g className="stickman-watch">
                        <circle cx="0" cy="-52" r="8" fill="none" stroke="#ffaa00" strokeWidth="2" />
                        <line x1="0" y1="-44" x2="0" y2="-18" stroke="#ffaa00" strokeWidth="2.5" />
                        <line x1="0" y1="-18" x2="-8" y2="0" stroke="#ffaa00" strokeWidth="2.5" />
                        <line x1="0" y1="-18" x2="8" y2="0" stroke="#ffaa00" strokeWidth="2.5" />
                        <line x1="0" y1="-38" x2="-12" y2="-30" stroke="#ffaa00" strokeWidth="2" />
                        <line x1="0" y1="-38" x2="12" y2="-30" stroke="#ffaa00" strokeWidth="2" />
                        {/* Crown / top hat */}
                        <rect x="-7" y="-67" width="14" height="8" fill="none" stroke="#ffaa00" strokeWidth="1.5" />
                        <line x1="-10" y1="-60" x2="10" y2="-60" stroke="#ffaa00" strokeWidth="1.5" />
                    </g>
                    {/* Coffin being lowered (phase 1+) */}
                    {phase >= 1 && (
                        <motion.g
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: 'easeIn' }}
                        >
                            <rect x="-14" y="-12" width="28" height="18" rx="2" fill="#1a1a2e" stroke="#4a1a7a" strokeWidth="1.5" />
                            <line x1="-14" y1="-4" x2="14" y2="-4" stroke="#4a1a7a" strokeWidth="1" />
                            <text x="0" y="0" textAnchor="middle" fontSize="8" fill="#7733bb">⚰️</text>
                        </motion.g>
                    )}
                </svg>

                {/* Flying dirt clumps */}
                <div className="dirt-clumps">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="dirt-clump"
                            style={{
                                '--i': i,
                                animationDelay: `${i * 0.35}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Candles on both sides */}
                <div className="scene-candle scene-candle-left">🕯️</div>
                <div className="scene-candle scene-candle-right">🕯️</div>
            </div>

            <motion.p
                key={msgIndex}
                className="loading-text"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                {LOADING_MESSAGES[msgIndex]}
            </motion.p>

            <div className="loading-dots">
                <span /><span /><span />
            </div>
        </motion.div>
    )
}

// ====================================================
// 💀 Scroll Modal — Full Funeral Speech
// ====================================================

function ScrollModal({ eulogy, onClose }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    return (
        <motion.div
            className="scroll-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <motion.div
                className="scroll-modal"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.5 }}
            >
                {/* Scroll top curl */}
                <div className="scroll-curl scroll-curl-top">
                    <div className="scroll-curl-line" />
                </div>

                <div className="scroll-body">
                    <div className="scroll-header">
                        <div className="scroll-icon">📜</div>
                        <h3 className="scroll-title">Официальная Панихида</h3>
                        <div className="scroll-divider">✦ ✦ ✦</div>
                    </div>

                    <p className="scroll-text">{eulogy}</p>

                    <div className="scroll-footer">
                        <div className="scroll-seal">⚰️</div>
                        <p className="scroll-signed">— Бюро Достойных Похорон, {new Date().getFullYear()}</p>
                    </div>
                </div>

                {/* Scroll bottom curl */}
                <div className="scroll-curl scroll-curl-bottom">
                    <div className="scroll-curl-line" />
                </div>

                <button className="scroll-close" onClick={onClose} title="Закрыть (ESC)">
                    ✕
                </button>
            </motion.div>
        </motion.div>
    )
}

// ====================================================
// 💀 Gravestone Component
// ====================================================

function Gravestone({ data, onBuryAnother }) {
    const [showScroll, setShowScroll] = useState(false)

    return (
        <>
            <AnimatePresence>
                {showScroll && (
                    <ScrollModal
                        eulogy={data.eulogy}
                        onClose={() => setShowScroll(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                className="graveyard"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Ground with stickmen mourners */}
                <div className="gravestone-scene">
                    {/* Mourner stickmen */}
                    <svg className="mourner-svg" viewBox="-80 -60 160 65" xmlns="http://www.w3.org/2000/svg">
                        {/* Left mourner */}
                        <g opacity="0.5">
                            <circle cx="-45" cy="-50" r="7" fill="none" stroke="#8888aa" strokeWidth="1.5" />
                            <line x1="-45" y1="-43" x2="-45" y2="-20" stroke="#8888aa" strokeWidth="2" />
                            <line x1="-45" y1="-20" x2="-51" y2="0" stroke="#8888aa" strokeWidth="2" />
                            <line x1="-45" y1="-20" x2="-39" y2="0" stroke="#8888aa" strokeWidth="2" />
                            <line x1="-45" y1="-33" x2="-56" y2="-25" stroke="#8888aa" strokeWidth="1.5" />
                            <line x1="-45" y1="-33" x2="-34" y2="-25" stroke="#8888aa" strokeWidth="1.5" />
                        </g>
                        {/* Right mourner  */}
                        <g opacity="0.5">
                            <circle cx="45" cy="-50" r="7" fill="none" stroke="#8888aa" strokeWidth="1.5" />
                            <line x1="45" y1="-43" x2="45" y2="-20" stroke="#8888aa" strokeWidth="2" />
                            <line x1="45" y1="-20" x2="39" y2="0" stroke="#8888aa" strokeWidth="2" />
                            <line x1="45" y1="-20" x2="51" y2="0" stroke="#8888aa" strokeWidth="2" />
                            <line x1="45" y1="-33" x2="34" y2="-25" stroke="#8888aa" strokeWidth="1.5" />
                            <line x1="45" y1="-33" x2="56" y2="-25" stroke="#8888aa" strokeWidth="1.5" />
                        </g>
                        {/* Central mourner with handkerchief */}
                        <g className="mourner-sway">
                            <circle cx="0" cy="-52" r="7" fill="none" stroke="#c8c8d8" strokeWidth="1.5" />
                            <line x1="0" y1="-45" x2="0" y2="-20" stroke="#c8c8d8" strokeWidth="2" />
                            <line x1="0" y1="-20" x2="-7" y2="0" stroke="#c8c8d8" strokeWidth="2" />
                            <line x1="0" y1="-20" x2="7" y2="0" stroke="#c8c8d8" strokeWidth="2" />
                            <line x1="0" y1="-33" x2="-14" y2="-26" stroke="#c8c8d8" strokeWidth="1.5" />
                            <line x1="0" y1="-33" x2="14" y2="-38" stroke="#c8c8d8" strokeWidth="1.5" />
                            {/* Handkerchief */}
                            <text x="15" y="-38" fontSize="8" fill="#e8e8f0">🤧</text>
                        </g>
                    </svg>
                </div>

                <motion.div
                    className="gravestone tombstone-clickable"
                    initial={{ rotateX: 30 }}
                    animate={{ rotateX: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    onClick={() => setShowScroll(true)}
                    title="Нажми, чтобы прочитать панихиду 📜"
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Click hint */}
                    <div className="tombstone-click-hint">
                        <span>📜</span> нажми для панихиды
                    </div>

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

                {/* Ground mound */}
                <div className="grave-mound" />

                {/* Candles */}
                <div className="grave-candles">
                    <div className="grave-candle">🕯️</div>
                    <div className="grave-candle" style={{ animationDelay: '0.7s' }}>🕯️</div>
                    <div className="grave-candle" style={{ animationDelay: '1.3s' }}>🕯️</div>
                </div>

                <motion.div
                    className="grave-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <button className="action-btn secondary" onClick={() => setShowScroll(true)}>
                        📜 Читать панихиду
                    </button>
                    <button className="action-btn primary" onClick={onBuryAnother}>
                        ⚰️ Похоронить ещё
                    </button>
                </motion.div>
            </motion.div>
        </>
    )
}

// ====================================================
// 💀 Cemetery — Grave History
// ====================================================

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
            <p className="cemetery-subtitle">Нажми на могилу, чтобы перечитать панихиду</p>
            <div className="cemetery-grid">
                {graves.map((grave, i) => (
                    <motion.div
                        key={grave.id || i}
                        className="mini-grave"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ scale: 1.04, y: -4 }}
                        layout
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
                            title="Удалить могилу навсегда"
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
            loadGraves()
        } catch (err) {
            setError(err.message || 'Что-то пошло ужасно не так в склепе.')
            setView('confess')
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiFetch(`/api/graves/${id}`, { method: 'DELETE' })
            // Soft-deleted: remove from local state (server keeps it with is_deleted=true)
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
                    {view === 'loading' && <DiggingScene key="loading" />}
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
