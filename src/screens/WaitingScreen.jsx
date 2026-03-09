import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, ChevronDown } from 'lucide-react'
import { getSession } from '../data/sessions'
import './WaitingScreen.css'

export default function WaitingScreen() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [session] = useState(() => getSession(code))
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [joining, setJoining] = useState(false)
  const [timeUntil, setTimeUntil] = useState(null)

  useEffect(() => {
    if (!session) { navigate('/'); return }
  }, [session])

  // For dev: meeting starts 10s after loading the waiting screen
  const [meetingStarted, setMeetingStarted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMeetingStarted(true), 3000)
    return () => clearTimeout(t)
  }, [])

  async function handleJoin() {
    setJoining(true)
    await new Promise(r => setTimeout(r, 800))
    navigate(`/meeting/${code}`)
  }

  if (!session) return null

  return (
    <div className="waiting">
      {/* Top nav */}
      <nav className="waiting-nav">
        <span className="waiting-logo-text">Meet</span>
      </nav>

      <div className="waiting-body">
        {/* Preview pane */}
        <div className="waiting-left">
          <div className="preview-tile">
            {camOn ? (
              <div className="preview-cam-placeholder">
                <div className="preview-avatar">Y</div>
              </div>
            ) : (
              <div className="preview-cam-off">
                <div className="preview-avatar">Y</div>
                <span className="cam-off-label">Camera is off</span>
              </div>
            )}
            <div className="preview-controls">
              <button
                className={`preview-ctrl-btn ${micOn ? 'active' : 'inactive'}`}
                onClick={() => setMicOn(v => !v)}
                title={micOn ? 'Mute' : 'Unmute'}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                className={`preview-ctrl-btn ${camOn ? 'active' : 'inactive'}`}
                onClick={() => setCamOn(v => !v)}
                title={camOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {camOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            </div>
          </div>

          {/* Effects row */}
          <div className="preview-effects">
            <button className="effects-btn">
              Apply visual effects
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Join pane */}
        <div className="waiting-right">
          {meetingStarted ? (
            <>
              <h2 className="waiting-title">Ready to join?</h2>
              <p className="waiting-sub">
                <span className="waiting-who">Prof. {session.professor.name.split(' ').slice(-1)[0]}</span>
                {' '}is in this call
              </p>

              {/* Professor tile preview */}
              <div className="prof-preview-tile">
                <div className="prof-avatar" style={{ background: session.professor.avatarColor }}>
                  {session.professor.initials}
                </div>
                <div className="prof-name-badge">{session.professor.name}</div>
              </div>

              <button
                className={`join-now-btn ${joining ? 'loading' : ''}`}
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? (
                  <span className="join-dots">
                    <span /><span /><span />
                  </span>
                ) : 'Join now'}
              </button>

              <p className="waiting-footer">
                Other people are also waiting to join this call.
              </p>
            </>
          ) : (
            <>
              <h2 className="waiting-title">Getting ready…</h2>
              <p className="waiting-sub">The meeting will begin shortly</p>
              <div className="waiting-spinner">
                <div className="spinner-ring" />
              </div>
              <p className="waiting-session-name">{session.title}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
