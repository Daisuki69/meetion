import React, { useState } from 'react'
import {
  Mic, MicOff, Video, VideoOff, MonitorUp,
  MessageSquare, Users, MoreVertical,
  PhoneOff, Captions, Smile, Hand
} from 'lucide-react'
import './Toolbar.css'

export default function Toolbar({ onLeave, participantCount }) {
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)

  return (
    <div className="toolbar">
      {/* Left — meeting info */}
      <div className="toolbar-left">
        <MeetClock />
        <span className="toolbar-separator" />
        <span className="toolbar-code">abc-defg-hij</span>
      </div>

      {/* Center — main controls */}
      <div className="toolbar-center">
        <ToolbarBtn
          active={micOn}
          inactive={!micOn}
          onClick={() => setMicOn(v => !v)}
          icon={micOn ? <Mic size={22} /> : <MicOff size={22} />}
          label={micOn ? 'Mute' : 'Unmute'}
          danger={!micOn}
        />
        <ToolbarBtn
          active={camOn}
          inactive={!camOn}
          onClick={() => setCamOn(v => !v)}
          icon={camOn ? <Video size={22} /> : <VideoOff size={22} />}
          label={camOn ? 'Turn off' : 'Turn on'}
          danger={!camOn}
        />
        <ToolbarBtn
          icon={<Captions size={22} />}
          label="Captions"
        />
        <ToolbarBtn
          icon={<MonitorUp size={22} />}
          label="Present"
        />

        <div className="toolbar-divider" />

        <ToolbarBtn
          icon={<Smile size={22} />}
          label="React"
        />
        <ToolbarBtn
          active={handRaised}
          onClick={() => setHandRaised(v => !v)}
          icon={<Hand size={22} />}
          label={handRaised ? 'Lower hand' : 'Raise hand'}
          highlight={handRaised}
        />
        <ToolbarBtn
          icon={<MessageSquare size={22} />}
          label="Chat"
        />
        <ToolbarBtn
          icon={<Users size={22} />}
          label={`People (${participantCount})`}
        />
        <ToolbarBtn
          icon={<MoreVertical size={22} />}
          label="More"
        />
      </div>

      {/* Right — leave */}
      <div className="toolbar-right">
        <button className="leave-btn" onClick={onLeave}>
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  )
}

function ToolbarBtn({ icon, label, onClick, active, inactive, danger, highlight }) {
  return (
    <button
      className={[
        'toolbar-btn',
        danger ? 'toolbar-btn-danger' : '',
        highlight ? 'toolbar-btn-highlight' : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      title={label}
    >
      <span className="toolbar-btn-icon">{icon}</span>
      <span className="toolbar-btn-label">{label}</span>
    </button>
  )
}

function MeetClock() {
  const [time, setTime] = React.useState(new Date())
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="toolbar-time">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}
