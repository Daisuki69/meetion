import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSession, resolveParticipantSchedule } from '../data/sessions'
import TileGrid from '../components/TileGrid'
import Toolbar from '../components/Toolbar'
import './MeetingScreen.css'

// YOU — the viewer's tile
const YOU = {
  id: 'you',
  name: 'You',
  initials: 'Y',
  avatarColor: '#1a73e8',
  onCam: true,
  videoSrc: null,
  isMuted: false,
  isYou: true,
}

export default function MeetingScreen() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [session] = useState(() => getSession(code))

  // Resolved participant schedule (random join/leave times, set once)
  const [schedule] = useState(() => {
    if (!session) return []
    return resolveParticipantSchedule(session.participants)
  })

  // Active tiles currently visible in the meeting
  const [activeTiles, setActiveTiles] = useState([])

  // Speaking state
  const [speakingIds, setSpeakingIds] = useState(new Set())

  // Screen share
  const [screenShareActive, setScreenShareActive] = useState(false)
  const [screenShareParticipant, setScreenShareParticipant] = useState(null)

  // Pinned tile
  const [pinnedId, setPinnedId] = useState(null)

  // Meeting elapsed seconds (driven by professor video OR wall clock)
  const elapsedRef = useRef(0)
  const [elapsedDisplay, setElapsedDisplay] = useState(0)

  // Toast notifications ("X joined", "X left")
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  // ─── Initialize meeting ───────────────────────────────────────────────────
  useEffect(() => {
    if (!session) { navigate('/'); return }

    // Add professor immediately
    const prof = { ...session.professor, isMuted: false }
    setActiveTiles([prof, YOU])

    // Calculate how far into the meeting we are
    // For dev: meeting "started" now, so elapsed = 0
    // In production: elapsed = (wallClock - session.startTime) in seconds
    const startElapsed = 0
    elapsedRef.current = startElapsed

    // Seed speaking for professor
    setSpeakingIds(new Set([session.professor.id]))
    setTimeout(() => setSpeakingIds(new Set()), 2500)

  }, [session])

  // ─── Main timeline ticker ─────────────────────────────────────────────────
  useEffect(() => {
    if (!session || schedule.length === 0) return

    // Track which participants have already joined/left
    const joined = new Set(['prof-001', 'you'])
    const left = new Set()

    const tick = setInterval(() => {
      elapsedRef.current += 1
      const elapsed = elapsedRef.current
      setElapsedDisplay(elapsed)

      // ── Participant joins ──
      schedule.forEach(p => {
        if (!joined.has(p.id) && elapsed >= p.joinAt) {
          joined.add(p.id)
          setActiveTiles(prev => [...prev, { ...p, isMuted: !p.onCam || Math.random() > 0.4 }])
          addToast(`${p.name} joined`)

          // Brief speaking flicker on join (like they say hi)
          if (Math.random() > 0.7) {
            setTimeout(() => {
              setSpeakingIds(prev => new Set([...prev, p.id]))
              setTimeout(() => {
                setSpeakingIds(prev => {
                  const next = new Set(prev)
                  next.delete(p.id)
                  return next
                })
              }, 800 + Math.random() * 1200)
            }, 400)
          }
        }
      })

      // ── Participant leaves ──
      schedule.forEach(p => {
        if (joined.has(p.id) && !left.has(p.id) && p.leaveAt && elapsed >= p.leaveAt) {
          left.add(p.id)
          setActiveTiles(prev => prev.filter(t => t.id !== p.id))
          addToast(`${p.name} left`)
        }
      })

      // ── Scripted events ──
      session.events?.forEach(evt => {
        if (elapsed === evt.at) {
          if (evt.type === 'screenShare' && evt.start) {
            setScreenShareActive(true)
            setScreenShareParticipant({ ...session.professor, screenSrc: null })
            addToast(`${session.professor.name} is presenting their screen`)
          }
          if (evt.type === 'screenShare' && !evt.start) {
            setScreenShareActive(false)
            setScreenShareParticipant(null)
            addToast(`${session.professor.name} stopped presenting`)
          }
          if (evt.type === 'professorSpeak') {
            setSpeakingIds(prev => new Set([...prev, session.professor.id]))
            setTimeout(() => {
              setSpeakingIds(prev => {
                const next = new Set(prev)
                next.delete(session.professor.id)
                return next
              })
            }, (evt.duration || 20) * 1000)
          }
        }
      })

      // ── Random ambient speaking ──
      // Every ~8 seconds randomly fire a brief speaking indicator
      if (elapsed % 8 === 0) {
        const currentTiles = [...joined].filter(id => id !== 'you' && !left.has(id))
        if (currentTiles.length > 0) {
          const randomId = currentTiles[Math.floor(Math.random() * currentTiles.length)]
          setSpeakingIds(prev => new Set([...prev, randomId]))
          const duration = 1000 + Math.random() * 3000
          setTimeout(() => {
            setSpeakingIds(prev => {
              const next = new Set(prev)
              next.delete(randomId)
              return next
            })
          }, duration)
        }
      }

      // Professor speaks randomly too during quiet periods
      if (elapsed % 23 === 0) {
        setSpeakingIds(prev => new Set([...prev, session.professor.id]))
        setTimeout(() => {
          setSpeakingIds(prev => {
            const next = new Set(prev)
            next.delete(session.professor.id)
            return next
          })
        }, 2000 + Math.random() * 5000)
      }

    }, 1000)

    return () => clearInterval(tick)
  }, [session, schedule, addToast])

  // ─── Pin handler ─────────────────────────────────────────────────────────
  function handlePin(id) {
    setPinnedId(prev => prev === id ? null : id)
  }

  // ─── Leave meeting ────────────────────────────────────────────────────────
  function handleLeave() {
    navigate('/')
  }

  if (!session) return null

  const elapsed = elapsedDisplay
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="meeting">
      {/* Top bar */}
      <div className="meeting-topbar">
        <div className="topbar-left">
          <span className="meeting-title">{session.title}</span>
        </div>
        <div className="topbar-right">
          <span className="meeting-timer">{mins}:{secs}</span>
          <div className="safe-exam-badge">Safe Exam</div>
        </div>
      </div>

      {/* Tile area */}
      <div className="meeting-tiles">
        <TileGrid
          activeTiles={activeTiles}
          speakingIds={speakingIds}
          screenShareParticipant={screenShareActive ? screenShareParticipant : null}
          pinnedId={pinnedId}
          onPin={handlePin}
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        onLeave={handleLeave}
        participantCount={activeTiles.length}
      />

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
