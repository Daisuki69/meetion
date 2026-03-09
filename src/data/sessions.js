// Mock session configs — later fetched from server by meet code
// Participant join windows: [minSeconds, maxSeconds] after meeting start
// Professor is always deterministic

export const MOCK_SESSIONS = {
  "abc-defg-hij": {
    code: "abc-defg-hij",
    title: "CS301 - Algorithms & Data Structures",
    startTime: null, // null = use current time + 10s for dev preview
    professor: {
      id: "prof-001",
      name: "Prof. Michael Torres",
      videoSrc: null, // will be replaced with real video path
      avatarColor: "#1a73e8",
      initials: "MT",
      isMuted: false,
      isHost: true,
    },
    participants: [
      { id: "p-001", name: "Aisha Nakamura",    initials: "AN", avatarColor: "#e91e63", onCam: true,  videoSrc: null, joinWindow: [15, 90],   leaveWindow: null },
      { id: "p-002", name: "Diego Reyes",        initials: "DR", avatarColor: "#ff9800", onCam: false, videoSrc: null, joinWindow: [20, 120],  leaveWindow: null },
      { id: "p-003", name: "Sophie Chen",        initials: "SC", avatarColor: "#9c27b0", onCam: true,  videoSrc: null, joinWindow: [10, 60],   leaveWindow: [2400, 2700] },
      { id: "p-004", name: "Marcus Johnson",     initials: "MJ", avatarColor: "#00bcd4", onCam: false, videoSrc: null, joinWindow: [30, 180],  leaveWindow: null },
      { id: "p-005", name: "Priya Sharma",       initials: "PS", avatarColor: "#4caf50", onCam: true,  videoSrc: null, joinWindow: [45, 200],  leaveWindow: null },
      { id: "p-006", name: "Tyler Brooks",       initials: "TB", avatarColor: "#ff5722", onCam: false, videoSrc: null, joinWindow: [60, 240],  leaveWindow: [1800, 2100] },
      { id: "p-007", name: "Yuna Park",          initials: "YP", avatarColor: "#607d8b", onCam: true,  videoSrc: null, joinWindow: [25, 150],  leaveWindow: null },
      { id: "p-008", name: "Ethan Williams",     initials: "EW", avatarColor: "#795548", onCam: false, videoSrc: null, joinWindow: [90, 300],  leaveWindow: null },
      { id: "p-009", name: "Fatima Al-Hassan",   initials: "FA", avatarColor: "#f44336", onCam: false, videoSrc: null, joinWindow: [15, 100],  leaveWindow: null },
      { id: "p-010", name: "James O'Brien",      initials: "JO", avatarColor: "#3f51b5", onCam: true,  videoSrc: null, joinWindow: [120, 360], leaveWindow: null },
      { id: "p-011", name: "Mei Lin",            initials: "ML", avatarColor: "#009688", onCam: false, videoSrc: null, joinWindow: [50, 220],  leaveWindow: [3000, 3300] },
      { id: "p-012", name: "Carlos Mendoza",     initials: "CM", avatarColor: "#673ab7", onCam: false, videoSrc: null, joinWindow: [80, 280],  leaveWindow: null },
      { id: "p-013", name: "Hannah Schmidt",     initials: "HS", avatarColor: "#e91e63", onCam: true,  videoSrc: null, joinWindow: [30, 160],  leaveWindow: null },
      { id: "p-014", name: "Kevin Okafor",       initials: "KO", avatarColor: "#ff9800", onCam: false, videoSrc: null, joinWindow: [200, 420], leaveWindow: null },
      { id: "p-015", name: "Lena Fischer",       initials: "LF", avatarColor: "#2196f3", onCam: false, videoSrc: null, joinWindow: [40, 190],  leaveWindow: null },
      { id: "p-016", name: "Omar Abdullah",      initials: "OA", avatarColor: "#8bc34a", onCam: false, videoSrc: null, joinWindow: [100, 320], leaveWindow: [2700, 2900] },
      { id: "p-017", name: "Rachel Kim",         initials: "RK", avatarColor: "#ff4081", onCam: true,  videoSrc: null, joinWindow: [35, 170],  leaveWindow: null },
      { id: "p-018", name: "Samuel Adeyemi",     initials: "SA", avatarColor: "#00acc1", onCam: false, videoSrc: null, joinWindow: [150, 380], leaveWindow: null },
      { id: "p-019", name: "Zoe Papadopoulos",   initials: "ZP", avatarColor: "#ff7043", onCam: false, videoSrc: null, joinWindow: [70, 260],  leaveWindow: null },
      { id: "p-020", name: "Nico Dubois",        initials: "ND", avatarColor: "#ab47bc", onCam: false, videoSrc: null, joinWindow: [250, 480], leaveWindow: null },
      { id: "p-021", name: "Amara Diallo",       initials: "AD", avatarColor: "#26a69a", onCam: false, videoSrc: null, joinWindow: [55, 230],  leaveWindow: null },
      { id: "p-022", name: "Ben Cartwright",     initials: "BC", avatarColor: "#5c6bc0", onCam: false, videoSrc: null, joinWindow: [180, 400], leaveWindow: null },
      { id: "p-023", name: "Ingrid Larsson",     initials: "IL", avatarColor: "#ef5350", onCam: false, videoSrc: null, joinWindow: [95, 310],  leaveWindow: null },
      { id: "p-024", name: "Raj Patel",          initials: "RP", avatarColor: "#ffa726", onCam: false, videoSrc: null, joinWindow: [130, 350], leaveWindow: null },
      { id: "p-025", name: "Nina Volkov",        initials: "NV", avatarColor: "#66bb6a", onCam: false, videoSrc: null, joinWindow: [65, 250],  leaveWindow: [3200, 3400] },
      { id: "p-026", name: "Jason Tran",         initials: "JT", avatarColor: "#29b6f6", onCam: false, videoSrc: null, joinWindow: [300, 500], leaveWindow: null },
      { id: "p-027", name: "Olivia Grant",       initials: "OG", avatarColor: "#ec407a", onCam: false, videoSrc: null, joinWindow: [110, 330], leaveWindow: null },
      { id: "p-028", name: "David Nguyen",       initials: "DN", avatarColor: "#7e57c2", onCam: false, videoSrc: null, joinWindow: [85, 290],  leaveWindow: null },
      { id: "p-029", name: "Chioma Eze",         initials: "CE", avatarColor: "#26c6da", onCam: false, videoSrc: null, joinWindow: [160, 390], leaveWindow: null },
    ],
    // Scripted timeline events (seconds from meeting start)
    events: [
      { at: 330,  type: "screenShare",   start: true  },
      { at: 2280, type: "screenShare",   start: false },
      { at: 2700, type: "professorSpeak", duration: 30 },
      { at: 3480, type: "professorSpeak", duration: 45 },
    ]
  }
}

export function getSession(code) {
  return MOCK_SESSIONS[code] || null
}

// Generate random join/leave times within windows once per session load
export function resolveParticipantSchedule(participants, seed = Date.now()) {
  // Simple seeded-ish random using participant id for consistency within a session
  return participants.map(p => {
    const joinAt = p.joinWindow[0] + Math.random() * (p.joinWindow[1] - p.joinWindow[0])
    const leaveAt = p.leaveWindow
      ? p.leaveWindow[0] + Math.random() * (p.leaveWindow[1] - p.leaveWindow[0])
      : null
    return { ...p, joinAt: Math.floor(joinAt), leaveAt: leaveAt ? Math.floor(leaveAt) : null }
  })
}
