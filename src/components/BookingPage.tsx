import React, { useState } from "react";

interface EventType {
  id: string;
  url: string;
}

interface Booking {
  id: string;
  eventTypeId: string;
  startTime: string;
  endTime?: string; // Ensured endTime is optional
  name: string;
  email: string;
}

const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const handleBooking = (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    const newBooking: Booking = {
      id: "123",
      eventTypeId: "abc",
      startTime: "2025-03-02T10:00:00Z",
      endTime: "2025-03-02T11:00:00Z",
      name: "John Doe",
      email: "john@example.com"
    };
    setBookings([...bookings, newBooking]);
  };

  return (
    <div>
      <h2>Book an Event</h2>
      <form onSubmit={handleBooking}>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookingPage;
