import { useState, useEffect } from 'react'
import { Availability } from '../types'
import GoogleCalendarConnect from './GoogleCalendarConnect'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const AvailabilitySettings = () => {
  const [availability, setAvailability] = useState<Availability[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('availability')
    if (stored) {
      setAvailability(JSON.parse(stored))
    } else {
      // Default working hours (Mon-Fri, 9AM-5PM)
      const defaultAvailability = [1, 2, 3, 4, 5].map((day) => ({
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
      }))
      setAvailability(defaultAvailability)
      localStorage.setItem('availability', JSON.stringify(defaultAvailability))
    }
  }, [])

  const handleChange = (day: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = availability.map((a) =>
      a.dayOfWeek === day ? { ...a, [field]: value } : a
    )
    setAvailability(updated)
    localStorage.setItem('availability', JSON.stringify(updated))
  }

  const toggleDay = (day: number) => {
    if (availability.some((a) => a.dayOfWeek === day)) {
      setAvailability(availability.filter((a) => a.dayOfWeek !== day))
    } else {
      setAvailability([
        ...availability,
        { dayOfWeek: day, startTime: '09:00', endTime: '17:00' },
      ])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Availability Settings</h2>
      
      <GoogleCalendarConnect />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {DAYS.map((day, index) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-32">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={availability.some((a) => a.dayOfWeek === index)}
                    onChange={() => toggleDay(index)}
                    className="rounded"
                  />
                  <span>{day}</span>
                </label>
              </div>
              {availability.some((a) => a.dayOfWeek === index) && (
                <>
                  <input
                    type="time"
                    value={
                      availability.find((a) => a.dayOfWeek === index)?.startTime
                    }
                    onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                    className="border rounded p-2"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={
                      availability.find((a) => a.dayOfWeek === index)?.endTime
                    }
                    onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                    className="border rounded p-2"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AvailabilitySettings
