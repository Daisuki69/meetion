import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import WaitingScreen from './screens/WaitingScreen'
import MeetingScreen from './screens/MeetingScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/waiting/:code" element={<WaitingScreen />} />
        <Route path="/meeting/:code" element={<MeetingScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
