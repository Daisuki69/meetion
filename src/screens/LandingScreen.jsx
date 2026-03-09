import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link2, ChevronRight } from 'lucide-react'
import { getSession, getMeetingState } from '../data/sessions'
import './LandingScreen.css'

export default function LandingScreen() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [clock, setClock] = useState('')
  const navigate = useNavigate()

  // Live clock in nav
  useEffect(() => {
    function tick() {
      const now = new Date()
      setClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  function formatCode(raw) {
    const clean = raw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    if (clean.length <= 3) return clean
    if (clean.length <= 7) return `${clean.slice(0,3)}-${clean.slice(3)}`
    return `${clean.slice(0,3)}-${clean.slice(3,7)}-${clean.slice(7,10)}`
  }

  function handleCodeChange(e) {
    setError('')
    setCode(formatCode(e.target.value))
  }

  async function handleJoin() {
    const trimmed = code.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')

    // Simulate network round-trip
    await new Promise(r => setTimeout(r, 1100))

    const session = getSession(trimmed)
    if (!session) {
      setError("Check that the link or code you entered is correct.")
      setLoading(false)
      return
    }

    const { state } = getMeetingState(session)

    if (state === 'too_early') {
      setError("This meeting hasn't started yet. Try again closer to the scheduled time.")
      setLoading(false)
      return
    }

    setLoading(false)
    navigate(`/waiting/${trimmed}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleJoin()
  }

  // Code is ready when clean alphanumeric length is 10 chars (xxx-xxxx-xxx)
  const cleanLen = code.replace(/-/g, '').length
  const isReady = cleanLen >= 10

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-left">
          {/* Google Meet logo — pure CSS/text to avoid broken img */}
          <div className="meet-logo-lockup">
            <svg className="meet-logo-icon" viewBox="0 0 48 48" width="32" height="32">
              <path fill="#00832d" d="M28.395 18.56l4.938 5.721 6.584 4.975V18.56z"/>
              <path fill="#0066da" d="M4 33.165V40.5c0 1.38 1.12 2.5 2.5 2.5h7.335l1.568-5.21-1.568-4.625z"/>
              <path fill="#e94235" d="M13.835 43l8.395-8.395-4.418-3.04L13.835 35.04z"/>
              <path fill="#2684fc" d="M13.835 5H6.5C5.12 5 4 6.12 4 7.5v25.665l9.835-2.33z"/>
              <path fill="#00ac47" d="M39.917 7.498L28.395 18.56H13.835V29.5L4 33.165v.002L13.835 43h.001L28.395 29.44l11.522 11.062A2.498 2.498 0 0043 38V10c0-1.2-.846-2.2-2.083-2.502z"/>
              <path fill="#00832d" d="M43 10v18.256l-6.584-4.975-6.021 5.555V18.56H13.835V29.5l-9.835 3.665v-15L28.395 7l11.522 .498A2.498 2.498 0 0143 10z" opacity=".1"/>
            </svg>
            <span className="meet-logo-text">Meet</span>
          </div>
        </div>
        <div className="landing-nav-right">
          <span className="nav-time">{clock}</span>
          <div className="nav-avatar">Y</div>
        </div>
      </nav>

      <main className="landing-main">
        <div className="landing-left">
          <h1 className="landing-headline">
            Premium video meetings.<br />Now free for everyone.
          </h1>
          <p className="landing-sub">
            We re-engineered the service that we built for secure business meetings,
            Google Meet, to make it free and available for all.
          </p>

          <div className="landing-actions">
            <button className="btn-new-meeting">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              New meeting
            </button>

            <div className={`code-input-wrap ${error ? 'has-error' : ''}`}>
              <Link2 size={18} className="code-icon" />
              <input
                type="text"
                placeholder="Enter a code or link"
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                maxLength={13}
                className="code-input"
                spellCheck={false}
                autoComplete="off"
              />
              {isReady && (
                <button
                  className={`join-inline-btn ${loading ? 'loading' : ''}`}
                  onClick={handleJoin}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="dots"><span /><span /><span /></span>
                  ) : (
                    <span className="join-label">Join <ChevronRight size={15} /></span>
                  )}
                </button>
              )}
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="landing-divider" />
          <p className="learn-more-row">
            <a href="#" className="learn-more-link">Learn more</a>
            <span className="learn-more-text"> about Google Meet</span>
          </p>
        </div>

        <div className="landing-right">
          <div className="landing-illustration">
            <div className="illus-grid">
              {ILLUS.map((item, i) => (
                <div key={i} className="illus-tile" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="illus-avatar" style={{ background: item.color }}>{item.init}</div>
                  <div className="illus-name">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const ILLUS = [
  { init: 'MT', name: 'Prof. Torres',  color: '#1a73e8' },
  { init: 'AN', name: 'Aisha N.',      color: '#e91e63' },
  { init: 'SC', name: 'Sophie C.',     color: '#9c27b0' },
  { init: 'MJ', name: 'Marcus J.',     color: '#00bcd4' },
  { init: 'PS', name: 'Priya S.',      color: '#4caf50' },
  { init: 'TB', name: 'Tyler B.',      color: '#ff5722' },
]
