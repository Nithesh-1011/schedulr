import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import { createCalendarEvent } from "@/lib/googlecalendar";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const hostId = searchParams.get("hostId");
    const bookings = await Booking.find({ hostId });
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { eventId, hostId, guestName, guestEmail, date, startTime, endTime, timezone } = await req.json();

    // Check if slot already booked
    const existing = await Booking.findOne({ eventId, date, startTime, status: "confirmed" });
    if (existing) return NextResponse.json({ error: "Slot already booked" }, { status: 400 });

    const booking = await Booking.create({
      eventId, hostId, guestName, guestEmail,
      date, startTime, endTime, timezone,
    });

    // Auto-create Google Calendar event if host connected Google
    const host = await User.findById(hostId);
    const event = await Event.findById(eventId);

    if (host?.googleCalendarToken && event) {
      const meetLink = await createCalendarEvent(host.googleCalendarToken, {
        title: event.title,
        date, startTime, endTime,
        guestEmail, guestName, timezone,
      });

      if (meetLink) {
        await Booking.findByIdAndUpdate(booking._id, { meetingLink: meetLink });
      }
    }
    console.log("Host googleCalendarToken:", host?.googleCalendarToken);
    console.log("Event:", event?.title);

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}