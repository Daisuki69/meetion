import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, ChevronDown } from 'lucide-react'
import { getSession, getMeetingState } from '../data/sessions'
import './WaitingScreen.css'

export default function WaitingScreen() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [session] = useState(() => getSession(code))
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [joining, setJoining] = useState(false)
  const [meetingState, setMeetingState] = useState(null)

  useEffect(() => {
    if (!session) { navigate('/'); return }

    // Check and update meeting state every second
    function checkState() {
      const s = getMeetingState(session)
      setMeetingState(s)

      // If too early somehow (shouldn't happen — landing already blocked it), go back
      if (s.state === 'too_early') navigate('/')
    }

    checkState()
    const t = setInterval(checkState, 1000)
    return () => clearInterval(t)
  }, [session])

  async function handleJoin() {
    setJoining(true)
    await new Promise(r => setTimeout(r, 900))
    navigate(`/meeting/${code}`)
  }

  if (!session || !meetingState) return null

  const isEarly = meetingState.state === 'early'
  // How many seconds until start (positive number when in early window)
  const secsUntilStart = isEarly ? Math.abs(meetingState.elapsedSeconds) : 0
  const minsUntil = Math.floor(secsUntilStart / 60)
  const secsUntil = secsUntilStart % 60

  return (
    <div className="waiting">
      <nav className="waiting-nav">
        <div className="meet-logo-lockup small">
          <svg viewBox="0 0 48 48" width="24" height="24">
            <path fill="#00832d" d="M28.395 18.56l4.938 5.721 6.584 4.975V18.56z"/>
            <path fill="#0066da" d="M4 33.165V40.5c0 1.38 1.12 2.5 2.5 2.5h7.335l1.568-5.21-1.568-4.625z"/>
            <path fill="#e94235" d="M13.835 43l8.395-8.395-4.418-3.04L13.835 35.04z"/>
            <path fill="#2684fc" d="M13.835 5H6.5C5.12 5 4 6.12 4 7.5v25.665l9.835-2.33z"/>
            <path fill="#00ac47" d="M39.917 7.498L28.395 18.56H13.835V29.5L4 33.165v.002L13.835 43h.001L28.395 29.44l11.522 11.062A2.498 2.498 0 0043 38V10c0-1.2-.846-2.2-2.083-2.502z"/>
          </svg>
          <span className="meet-logo-text">Meet</span>
        </div>
      </nav>

      <div className="waiting-body">
        {/* Camera preview */}
        <div className="waiting-left">
          <div className="preview-tile">
            <div className={`preview-inner ${camOn ? 'cam-on' : 'cam-off'}`}>
              <div className="preview-avatar">Y</div>
              {!camOn && <span className="cam-off-label">Camera is off</span>}
            </div>
            <div className="preview-controls">
              <button
                className={`preview-ctrl-btn ${micOn ? 'ctrl-active' : 'ctrl-danger'}`}
                onClick={() => setMicOn(v => !v)}
                title={micOn ? 'Mute' : 'Unmute'}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                className={`preview-ctrl-btn ${camOn ? 'ctrl-active' : 'ctrl-danger'}`}
                onClick={() => setCamOn(v => !v)}
                title={camOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {camOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            </div>
          </div>

          <button className="effects-btn">
            Apply visual effects <ChevronDown size={15} />
          </button>
        </div>

        {/* Join panel */}
        <div className="waiting-right">
          {isEarly ? (
            /* Early — professor is there, but meeting not started yet */
            <>
              <h2 className="waiting-title">The meeting hasn't started</h2>
              <p className="waiting-sub">
                Starting in{' '}
                <span className="countdown">
                  {minsUntil > 0 ? `${minsUntil}m ` : ''}{secsUntil}s
                </span>
              </p>

              <div className="prof-preview-tile">
                <div className="prof-avatar" style={{ background: session.professor.avatarColor }}>
                  {session.professor.initials}
                </div>
                <div className="prof-waiting-label">Waiting to start…</div>
                <div className="prof-name-badge">{session.professor.name} · Host</div>
              </div>

              <button className="join-now-btn" onClick={handleJoin} disabled={joining}>
                {joining
                  ? <span className="dots"><span /><span /><span /></span>
                  : 'Join anyway'}
              </button>
              <p className="waiting-footer">You can join now — the host will start soon.</p>
            </>
          ) : (
            /* Live — meeting is running */
            <>
              <h2 className="waiting-title">Ready to join?</h2>
              <p className="waiting-sub">
                <span className="waiting-who">{session.professor.name}</span> is in this call
              </p>

              <div className="prof-preview-tile">
                <div className="prof-avatar" style={{ background: session.professor.avatarColor }}>
                  {session.professor.initials}
                </div>
                <div className="prof-name-badge">{session.professor.name} · Host</div>
              </div>

              <button
                className={`join-now-btn ${joining ? 'loading' : ''}`}
                onClick={handleJoin}
                disabled={joining}
              >
                {joining
                  ? <span className="dots"><span /><span /><span /></span>
                  : 'Join now'}
              </button>

              <p className="waiting-footer">Other people are also in this call.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
