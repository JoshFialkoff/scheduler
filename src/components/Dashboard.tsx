import { useEffect, useState } from 'react'
import { Booking } from '../types'
import { format } from 'date-fns'

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('bookings')
    if (stored) {
      setBookings(JSON.parse(stored))
    }
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upcoming Meetings</h2>
      <div className="bg-white rounded-lg shadow">
        {bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No upcoming meetings
          </div>
        ) : (
          <div className="divide-y">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4">
                <div className="font-medium">{booking.name}</div>
                <div className="text-sm text-gray-500">
                  {format(new Date(booking.startTime), 'PPP p')}
                </div>
                <div className="text-sm text-gray-500">{booking.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
