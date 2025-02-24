import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, addDays, parse, isWithinInterval, addMinutes } from 'date-fns'
import { EventType, Availability, Booking } from '../types'

const BookingPage = () => {
  const { eventTypeId } = useParams()
  const navigate = useNavigate()
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [busyTimes, setBusyTimes] = useState<{start: Date, end: Date}[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedEventTypes = localStorage.getItem('eventTypes')
    const storedAvailability = localStorage.getItem('availability')
    
    if (storedEventTypes) {
      const events: EventType[] = JSON.parse(storedEventTypes)
      const event = events.find((e) => e.url === eventTypeId)
      if (event) setEventType(event)
    }
    
    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability))
    }
  }, [eventTypeId])

  useEffect(() => {
    const fetchGoogleCalendarEvents = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('googleCalendarToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const startDateTime = new Date(selectedDate)
        const endDateTime = addDays(startDateTime, 1)

        const response = await window.gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: startDateTime.toISOString(),
          timeMax: endDateTime.toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        })

        const events = response.result.items || []
        const busy = events
          .filter(event => event.start.dateTime && event.end.dateTime) // Only consider events with specific times
          .map(event => ({
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime)
          }))
        setBusyTimes(busy)
      } catch (error) {
        console.error('Error fetching Google Calendar events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedDate) {
      fetchGoogleCalendarEvents()
    }
  }, [selectedDate])

  if (!eventType) {
    return <div className="p-8">Event not found</div>
  }

  const isTimeSlotAvailable = (timeSlot: Date) => {
    // Check if the time slot overlaps with any busy period
    return !busyTimes.some(busy => 
      isWithinInterval(timeSlot, { start: busy.start, end: busy.end }) ||
      isWithinInterval(addMinutes(timeSlot, eventType.duration), { start: busy.start, end: busy.end })
    )
  }

  const getAvailableTimeslots = () => {
    if (!eventType) return []

    const date = parse(selectedDate, 'yyyy-MM-dd', new Date())
    const dayAvailability = availability.find(
      (a) => a.dayOfWeek === date.getDay()
    )

    if (!dayAvailability) return []

    const startTime = parse(dayAvailability.startTime, 'HH:mm', date)
    const endTime = parse(dayAvailability.endTime, 'HH:mm', date)
    
    const slots = []
    let currentSlot = startTime

    while (currentSlot < endTime) {
      if (isTimeSlotAvailable(currentSlot)) {
        slots.push(format(currentSlot, 'HH:mm'))
      }
      currentSlot = addMinutes(currentSlot, eventType.duration)
    }

    return slots
  }

  const handleSubmit = async () => {
    if (!selectedTime || !name || !email) return

    const startDateTime = new Date(`${selectedDate}T${selectedTime}`)
    const endDateTime = addMinutes(startDateTime, eventType.duration)

    const booking: Booking = {
      id: crypto.randomUUID(),
      eventTypeId: eventType.id,
      startTime: startDateTime.toISOString(),
      name,
      email,
    }

    // Save to local storage
    const storedBookings = localStorage.getItem('bookings')
    const bookings = storedBookings ? JSON.parse(storedBookings) : []
    localStorage.setItem('bookings', JSON.stringify([...bookings, booking]))

    // Create Google Calendar event
    const token = localStorage.getItem('googleCalendarToken')
    if (token) {
      try {
        await window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: `${eventType.name} with ${name}`,
            description: eventType.description,
            start: {
              dateTime: startDateTime.toISOString(),
            },
            end: {
              dateTime: endDateTime.toISOString(),
            },
            attendees: [{ email }],
          },
        })
      } catch (error) {
        console.error('Error creating Google Calendar event:', error)
      }
    }

    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{eventType.name}</h1>
      <p className="text-gray-600 mb-8">{eventType.description}</p>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={format(new Date(), 'yyyy-MM-dd')}
              max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading available times...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {getAvailableTimeslots().map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTime && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Schedule Meeting
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingPage
