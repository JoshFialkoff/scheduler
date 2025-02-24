export interface EventType {
  id: string;
  name: string;
  duration: number; // in minutes
  description: string;
  url: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Booking {
  id: string;
  eventTypeId: string;
  startTime: string; // ISO string
  name: string;
  email: string;
}
