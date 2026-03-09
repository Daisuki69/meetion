import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSession, getMeetingState, resolveParticipantSchedule } from '../data/sessions'
import TileGrid from '../components/TileGrid'
import Toolbar from '../components/Toolbar'
import './MeetingScreen.css'

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

  // Resolve schedule once on mount
  const [schedule] = useState(() => {
    if (!session) return []
    return resolveParticipantSchedule(session.participants)
  })

  const [activeTiles, setActiveTiles] = useState([])
  const [speakingIds, setSpeakingIds] = useState(new Set())
  const [screenShareActive, setScreenShareActive] = useState(false)
  const [screenShareParticipant, setScreenShareParticipant] = useState(null)
  const [pinnedId, setPinnedId] = useState(null)
  const [toasts, setToasts] = useState([])

  // The meeting elapsed seconds — driven by wall clock relative to session.startTime
  const elapsedRef = useRef(0)
  const [elapsedDisplay, setElapsedDisplay] = useState(0)

  // Track which events have fired (by index) so we don't re-fire
  const firedEvents = useRef(new Set())
  // Track joined/left participant IDs
  const joinedIds = useRef(new Set(['prof-001', 'you']))
  const leftIds = useRef(new Set())

  const addToast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const removeSpeaker = useCallback((id, delay) => {
    setTimeout(() => {
      setSpeakingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, delay)
  }, [])

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) { navigate('/'); return }

    const { state, elapsedSeconds } = getMeetingState(session)

    // Compute elapsed — if we join mid-meeting, fast-forward the timeline
    const elapsed = state === 'dev' ? 0 : Math.max(0, elapsedSeconds)
    elapsedRef.current = elapsed
    setElapsedDisplay(elapsed)

    // Build the initial tile state as if we've been watching from the start
    // Include professor always, YOU, and any participant who would have joined already
    const prejoined = schedule.filter(p => p.joinAt <= elapsed && (!p.leaveAt || p.leaveAt > elapsed))
    prejoined.forEach(p => joinedIds.current.add(p.id))

    const leftAlready = schedule.filter(p => p.leaveAt && p.leaveAt <= elapsed)
    leftAlready.forEach(p => leftIds.current.add(p.id))

    // Mark scripted events before current time as already fired
    session.events?.forEach((evt, i) => {
      if (evt.at <= elapsed) firedEvents.current.add(i)
    })

    // Check if screen share should already be active
    const shareStart = session.events?.find(e => e.type === 'screenShare' && e.start && e.at <= elapsed)
    const shareEnd   = session.events?.find(e => e.type === 'screenShare' && !e.start && e.at <= elapsed)
    if (shareStart && (!shareEnd || shareStart.at > shareEnd.at)) {
      setScreenShareActive(true)
      setScreenShareParticipant({ ...session.professor })
    }

    const initialTiles = [
      { ...session.professor, isMuted: false },
      YOU,
      ...prejoined.map(p => ({ ...p, isMuted: !p.onCam || Math.random() > 0.45 }))
    ]
    setActiveTiles(initialTiles)

    // Brief professor speak on load
    setSpeakingIds(new Set([session.professor.id]))
    removeSpeaker(session.professor.id, 2000)
  }, [session])

  // ── Timeline ticker ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!session || schedule.length === 0) return

    // For wall-clock sync: capture the "anchor" — what wall time corresponds to elapsed=0
    const { state, elapsedSeconds } = getMeetingState(session)
    const anchorWall = Date.now()
    const anchorElapsed = state === 'dev' ? 0 : Math.max(0, elapsedSeconds)

    // Next random speak time
    let nextRandomSpeak = anchorElapsed + 4 + Math.floor(Math.random() * 12)
    let nextProfSpeak   = anchorElapsed + 15 + Math.floor(Math.random() * 20)

    const tick = setInterval(() => {
      // Wall-clock driven elapsed for accuracy
      const wallElapsed = Math.floor((Date.now() - anchorWall) / 1000) + anchorElapsed
      elapsedRef.current = wallElapsed
      setElapsedDisplay(wallElapsed)

      const joined = joinedIds.current
      const left   = leftIds.current

      // ── Joins ──
      schedule.forEach(p => {
        if (!joined.has(p.id) && wallElapsed >= p.joinAt) {
          joined.add(p.id)
          setActiveTiles(prev => [...prev, { ...p, isMuted: !p.onCam || Math.random() > 0.45 }])
          addToast(`${p.name} joined`)

          // Occasional hi-flicker on join
          if (Math.random() > 0.65) {
            setTimeout(() => {
              setSpeakingIds(prev => new Set([...prev, p.id]))
              removeSpeaker(p.id, 700 + Math.random() * 1000)
            }, 300 + Math.random() * 500)
          }
        }
      })

      // ── Leaves ──
      schedule.forEach(p => {
        if (joined.has(p.id) && !left.has(p.id) && p.leaveAt && wallElapsed >= p.leaveAt) {
          left.add(p.id)
          setActiveTiles(prev => prev.filter(t => t.id !== p.id))
          setSpeakingIds(prev => { const n = new Set(prev); n.delete(p.id); return n })
          addToast(`${p.name} left the call`)
        }
      })

      // ── Scripted events ──
      session.events?.forEach((evt, i) => {
        if (!firedEvents.current.has(i) && wallElapsed >= evt.at) {
          firedEvents.current.add(i)

          if (evt.type === 'screenShare' && evt.start) {
            setScreenShareActive(true)
            setScreenShareParticipant({ ...session.professor })
            addToast(`${session.professor.name} is presenting their screen`)
          }
          if (evt.type === 'screenShare' && !evt.start) {
            setScreenShareActive(false)
            setScreenShareParticipant(null)
            addToast(`${session.professor.name} stopped presenting`)
          }
          if (evt.type === 'professorSpeak') {
            setSpeakingIds(prev => new Set([...prev, session.professor.id]))
            removeSpeaker(session.professor.id, (evt.duration || 20) * 1000)
          }
        }
      })

      // ── Random participant speaking ──
      if (wallElapsed >= nextRandomSpeak) {
        const currentIds = [...joined].filter(id => id !== 'you' && !left.has(id))
        if (currentIds.length > 0) {
          const rid = currentIds[Math.floor(Math.random() * currentIds.length)]
          setSpeakingIds(prev => new Set([...prev, rid]))
          removeSpeaker(rid, 1200 + Math.random() * 3500)
        }
        // Next random speak: 6–18 seconds from now
        nextRandomSpeak = wallElapsed + 6 + Math.floor(Math.random() * 12)
      }

      // ── Random professor speaking ──
      if (wallElapsed >= nextProfSpeak) {
        setSpeakingIds(prev => new Set([...prev, session.professor.id]))
        removeSpeaker(session.professor.id, 1800 + Math.random() * 6000)
        nextProfSpeak = wallElapsed + 18 + Math.floor(Math.random() * 25)
      }

    }, 1000)

    return () => clearInterval(tick)
  }, [session, schedule, addToast, removeSpeaker])

  function handlePin(id) {
    setPinnedId(prev => prev === id ? null : id)
  }

  function handleLeave() {
    navigate('/')
  }

  if (!session) return null

  const elapsed = elapsedDisplay
  const hrs  = Math.floor(elapsed / 3600)
  const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')
  const timerStr = hrs > 0 ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`

  return (
    <div className="meeting">
      {/* Top bar */}
      <div className="meeting-topbar">
        <div className="topbar-left">
          <span className="meeting-title">{session.title}</span>
        </div>
        <div className="topbar-right">
          <span className="meeting-timer">{timerStr}</span>
        </div>
      </div>

      {/* Tiles */}
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
        meetingCode={code}
      />

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </div>
  )
}
