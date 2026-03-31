// interface's name starts with I ..for get to know that these are interfaces while we use these in other files


export interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  timezone: string;
}

export interface IEvent {
  _id: string;
  userId: string;
  title: string;
  slug: string;
  duration: number;
  color: string;
  isActive: boolean;
}

export interface IBooking {
  _id: string;
  eventId: string;
  hostId: string;
  guestName: string;
  guestEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: "confirmed" | "cancelled";
}