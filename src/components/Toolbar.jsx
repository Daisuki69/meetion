import React, { useState } from 'react'
import {
  Mic, MicOff, Video, VideoOff, MonitorUp,
  MessageSquare, Users, MoreVertical,
  PhoneOff, Captions, Smile, Hand
} from 'lucide-react'
import './Toolbar.css'

export default function Toolbar({ onLeave, participantCount, meetingCode }) {
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <MeetClock />
        <span className="toolbar-sep" />
        <span className="toolbar-code">{meetingCode || ''}</span>
      </div>

      <div className="toolbar-center">
        <ToolBtn
          danger={!micOn}
          onClick={() => setMicOn(v => !v)}
          icon={micOn ? <Mic size={22} /> : <MicOff size={22} />}
          label={micOn ? 'Mute' : 'Unmute'}
        />
        <ToolBtn
          danger={!camOn}
          onClick={() => setCamOn(v => !v)}
          icon={camOn ? <Video size={22} /> : <VideoOff size={22} />}
          label={camOn ? 'Turn off' : 'Turn on'}
        />
        <ToolBtn icon={<Captions size={22} />}    label="Captions" />
        <ToolBtn icon={<MonitorUp size={22} />}   label="Present" />

        <div className="toolbar-divider" />

        <ToolBtn icon={<Smile size={22} />} label="React" />
        <ToolBtn
          highlight={handRaised}
          onClick={() => setHandRaised(v => !v)}
          icon={<Hand size={22} />}
          label={handRaised ? 'Lower hand' : 'Raise hand'}
        />
        <ToolBtn icon={<MessageSquare size={22} />} label="Chat" />
        <ToolBtn icon={<Users size={22} />} label={`People (${participantCount})`} />
        <ToolBtn icon={<MoreVertical size={22} />} label="More" />
      </div>

      <div className="toolbar-right">
        <button className="leave-btn" onClick={onLeave} title="Leave call">
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  )
}

function ToolBtn({ icon, label, onClick, danger, highlight }) {
  return (
    <button
      className={[
        'toolbar-btn',
        danger ? 'btn-danger' : '',
        highlight ? 'btn-highlight' : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      title={label}
    >
      <span className="btn-icon">{icon}</span>
      <span className="btn-label">{label}</span>
    </button>
  )
}

function MeetClock() {
  const [time, setTime] = React.useState('')
  React.useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])
  return <span className="toolbar-time">{time}</span>
}
