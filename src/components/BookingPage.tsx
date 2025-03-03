import React, { useState, useEffect } from "react";

interface EventType {
  id: string;
  name: string;
  duration: number; // Duration in minutes
}

interface Booking {
  id: string;
  eventTypeId: string;
  startTime: string;
  endTime?: string;
  name: string;
  email: string;
}

const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>("");

  useEffect(() => {
    // Fetch event types (replace with actual API call)
    setEventTypes([
      { id: "event123", name: "30-min Meeting", duration: 30 },
      { id: "event456", name: "1-hour Meeting", duration: 60 },
    ]);
  }, []);

  const handleBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedEventType) {
      alert("Please select an event type.");
      return;
    }

    const eventType = eventTypes.find(et => et.id === selectedEventType);
    if (!eventType) {
      alert("Invalid event type selected.");
      return;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + eventType.duration * 60000);

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      eventTypeId: selectedEventType,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      name,
      email,
    };

    setBookings([...bookings, newBooking]);
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h2>Book an Event</h2>
      <form onSubmit={handleBooking}>
        <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)} required>
          <option value="">Select an Event Type</option>
          {eventTypes.map((eventType) => (
            <option key={eventType.id} value={eventType.id}>
              {eventType.name} ({eventType.duration} min)
            </option>
          ))}
        </select>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Your Name" 
          required 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Your Email" 
          required 
        />
        <button type="submit">Book</button>
      </form>
      
      <h3>Upcoming Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.name} - {new Date(booking.startTime).toLocaleTimeString()} to {new Date(booking.endTime!).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingPage;
