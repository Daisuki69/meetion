import React, { useMemo } from 'react'
import ParticipantTile from './ParticipantTile'
import './TileGrid.css'

// Compute optimal grid layout given N tiles and container aspect ratio
function getGridLayout(count) {
  if (count === 1) return { cols: 1, rows: 1 }
  if (count === 2) return { cols: 2, rows: 1 }
  if (count <= 4) return { cols: 2, rows: 2 }
  if (count <= 6) return { cols: 3, rows: 2 }
  if (count <= 9) return { cols: 3, rows: 3 }
  if (count <= 12) return { cols: 4, rows: 3 }
  if (count <= 16) return { cols: 4, rows: 4 }
  if (count <= 20) return { cols: 5, rows: 4 }
  return { cols: 5, rows: Math.ceil(count / 5) }
}

function getTileSize(count) {
  if (count <= 2) return 'large'
  if (count <= 9) return 'normal'
  return 'small'
}

export default function TileGrid({
  activeTiles,         // array of participant objects currently in meeting
  speakingIds,         // set of ids currently speaking
  screenShareParticipant, // participant sharing screen (or null)
  screenShareSrc,
  pinnedId,
  onPin,
}) {
  const { cols, rows } = useMemo(() => getGridLayout(activeTiles.length), [activeTiles.length])
  const tileSize = getTileSize(activeTiles.length)

  // If someone is sharing screen — different layout
  if (screenShareParticipant) {
    return (
      <div className="grid-screenshare-layout">
        {/* Main screen share tile */}
        <div className="screenshare-main">
          <ParticipantTile
            participant={{ ...screenShareParticipant, screenSrc: screenShareSrc }}
            isScreenShare
            size="large"
          />
        </div>

        {/* Side strip of participant thumbnails */}
        <div className="screenshare-strip">
          {activeTiles.map(p => (
            <ParticipantTile
              key={p.id}
              participant={p}
              isSpeaking={speakingIds.has(p.id)}
              isPinned={pinnedId === p.id}
              onPin={() => onPin(p.id)}
              size="small"
            />
          ))}
        </div>
      </div>
    )
  }

  // Pinned layout — pinned tile large left, others in strip right
  if (pinnedId) {
    const pinned = activeTiles.find(p => p.id === pinnedId)
    const rest = activeTiles.filter(p => p.id !== pinnedId)
    return (
      <div className="grid-pinned-layout">
        <div className="pinned-main">
          {pinned && (
            <ParticipantTile
              participant={pinned}
              isSpeaking={speakingIds.has(pinned.id)}
              isPinned
              onPin={() => onPin(pinned.id)}
              size="large"
            />
          )}
        </div>
        <div className="pinned-strip">
          {rest.map(p => (
            <ParticipantTile
              key={p.id}
              participant={p}
              isSpeaking={speakingIds.has(p.id)}
              isPinned={false}
              onPin={() => onPin(p.id)}
              size="small"
            />
          ))}
        </div>
      </div>
    )
  }

  // Default grid layout
  return (
    <div
      className="tile-grid"
      style={{
        '--grid-cols': cols,
        '--grid-rows': rows,
      }}
    >
      {activeTiles.map(p => (
        <ParticipantTile
          key={p.id}
          participant={p}
          isSpeaking={speakingIds.has(p.id)}
          isPinned={pinnedId === p.id}
          onPin={() => onPin(p.id)}
          size={tileSize}
        />
      ))}
    </div>
  )
}
