import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import EventTypes from './components/EventTypes'
import AvailabilitySettings from './components/AvailabilitySettings'
import BookingPage from './components/BookingPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="event-types" element={<EventTypes />} />
          <Route path="availability" element={<AvailabilitySettings />} />
        </Route>
        <Route path="/book/:eventTypeId" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
