import { useState, useEffect } from 'react'
import { Plus, Clock } from 'lucide-react'
import { EventType } from '../types'

const EventTypes = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newEvent, setNewEvent] = useState({
    name: '',
    duration: 30,
    description: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('eventTypes')
    if (stored) {
      setEventTypes(JSON.parse(stored))
    }
  }, [])

  const handleCreate = () => {
    const event: EventType = {
      id: crypto.randomUUID(),
      ...newEvent,
      url: crypto.randomUUID(),
    }
    const updated = [...eventTypes, event]
    setEventTypes(updated)
    localStorage.setItem('eventTypes', JSON.stringify(updated))
    setIsCreating(false)
    setNewEvent({ name: '', duration: 30, description: '' })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Event Types</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>New Event Type</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={newEvent.duration}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, duration: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
              >
                <option value={30}>30</option>
                <option value={60}>60</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="border px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventTypes.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex items-center space-x-2 text-gray-500 mb-2">
              <Clock size={20} />
              <span>{event.duration} minutes</span>
            </div>
            <h3 className="text-lg font-medium">{event.name}</h3>
            <p className="text-gray-500 text-sm mt-2">{event.description}</p>
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">Booking link:</div>
              <code className="text-sm">
                {window.location.origin}/book/{event.url}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventTypes
