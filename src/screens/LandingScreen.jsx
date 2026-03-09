import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Link2, ChevronRight } from 'lucide-react'
import { getSession } from '../data/sessions'
import './LandingScreen.css'

export default function LandingScreen() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function formatCode(raw) {
    // Auto-format: xxx-xxxx-xxx as user types
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

    // Simulate network lookup
    await new Promise(r => setTimeout(r, 1200))

    const session = getSession(trimmed)
    if (!session) {
      setError("Check that the link or code you entered is correct.")
      setLoading(false)
      return
    }

    setLoading(false)
    navigate(`/waiting/${trimmed}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleJoin()
  }

  const isReady = code.length >= 9

  return (
    <div className="landing">
      {/* Top nav */}
      <nav className="landing-nav">
        <div className="landing-nav-left">
          <img src="https://www.gstatic.com/meet/google_meet_wordmark_dark_2020q4_1x_icon_124_40_2373e79660dabbf194273d27aa7ee1f5.png"
            alt="Google Meet"
            className="meet-logo"
            onError={e => { e.target.style.display='none' }}
          />
          <span className="meet-logo-fallback">
            <span className="logo-icon">
              <Video size={20} />
            </span>
            <span className="logo-text">Meet</span>
          </span>
        </div>
        <div className="landing-nav-right">
          <span className="nav-time" id="nav-clock"></span>
          <div className="nav-avatar">Y</div>
        </div>
      </nav>

      {/* Main content */}
      <main className="landing-main">
        <div className="landing-left">
          <h1 className="landing-headline">Premium video meetings.<br/>Now free for everyone.</h1>
          <p className="landing-sub">We re-engineered the service that we built for secure business meetings, Google Meet, to make it free and available for all.</p>

          <div className="landing-actions">
            <button className="btn-new-meeting">
              <Video size={18} />
              New meeting
            </button>

            <div className={`code-input-wrap ${error ? 'has-error' : ''} ${isReady ? 'is-ready' : ''}`}>
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
              />
              {isReady && (
                <button
                  className={`join-btn ${loading ? 'loading' : ''}`}
                  onClick={handleJoin}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="join-dots">
                      <span /><span /><span />
                    </span>
                  ) : (
                    <>Join <ChevronRight size={16} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="error-msg">{error}</p>
          )}

          <div className="landing-divider" />
          <a href="#" className="learn-more">Learn more</a>
          <span className="learn-more-sub"> about Google Meet</span>
        </div>

        <div className="landing-right">
          <div className="landing-illustration">
            <div className="illus-grid">
              {['MT','AN','SC','MJ','PS','TB'].map((init, i) => (
                <div key={i} className="illus-tile" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="illus-avatar" style={{ background: COLORS[i] }}>{init}</div>
                  <div className="illus-name">{NAMES[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const COLORS = ['#1a73e8','#e91e63','#9c27b0','#00bcd4','#4caf50','#ff5722']
const NAMES = ['Prof. Torres','Aisha N.','Sophie C.','Marcus J.','Priya S.','Tyler B.']
