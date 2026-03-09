import React, { useEffect, useRef, useState } from 'react'
import { MicOff, Pin } from 'lucide-react'
import './ParticipantTile.css'

export default function ParticipantTile({
  participant,
  isSpeaking = false,
  isScreenShare = false,
  isPinned = false,
  onPin,
  size = 'normal', // 'normal' | 'large' | 'small'
}) {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (videoRef.current && participant.videoSrc) {
      const vid = videoRef.current
      // Random start offset for realism
      vid.addEventListener('loadedmetadata', () => {
        vid.currentTime = Math.random() * (vid.duration || 0)
        setVideoLoaded(true)
      }, { once: true })
    }
  }, [participant.videoSrc])

  const showVideo = participant.onCam && participant.videoSrc && videoLoaded
  const isProf = participant.isHost

  return (
    <div
      className={[
        'participant-tile',
        `tile-${size}`,
        isSpeaking ? 'is-speaking' : '',
        isScreenShare ? 'is-screenshare' : '',
        isPinned ? 'is-pinned' : '',
        entering ? 'tile-entering' : '',
      ].filter(Boolean).join(' ')}
      onClick={onPin}
    >
      {/* Video layer */}
      {participant.onCam && participant.videoSrc && (
        <video
          ref={videoRef}
          src={participant.videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`tile-video ${videoLoaded ? 'loaded' : ''}`}
        />
      )}

      {/* Screen share */}
      {isScreenShare && participant.screenSrc && (
        <video
          src={participant.screenSrc}
          autoPlay
          loop
          muted
          playsInline
          className="tile-video loaded"
        />
      )}

      {/* Avatar fallback (no cam or video not loaded) */}
      {!showVideo && !isScreenShare && (
        <div className="tile-avatar-wrap">
          <div
            className="tile-avatar"
            style={{ background: participant.avatarColor }}
          >
            {participant.initials}
          </div>
        </div>
      )}

      {/* Bottom bar: name + mic */}
      <div className="tile-bottom">
        <div className="tile-name-row">
          {isProf && <span className="host-badge">Host</span>}
          <span className="tile-name">
            {isScreenShare ? `${participant.name}'s screen` : participant.name}
            {participant.isYou ? ' (You)' : ''}
          </span>
        </div>
        {participant.isMuted && !isScreenShare && (
          <div className="tile-mic-off">
            <MicOff size={14} />
          </div>
        )}
      </div>

      {/* Pin button (shows on hover) */}
      <button className="tile-pin-btn" onClick={e => { e.stopPropagation(); onPin?.() }}>
        <Pin size={14} />
      </button>

      {/* Speaking indicator overlay */}
      {isSpeaking && <div className="speaking-ring" />}
    </div>
  )
}
