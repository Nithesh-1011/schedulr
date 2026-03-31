import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Booking from "@/models/Booking";


// i have fully created this file using the claude ai .. because it bit confusing to bring up with this function
// GET available slots for a given event + date
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const date = searchParams.get("date"); // e.g. "2024-03-15"

    if (!eventId || !date) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Generate all slots between startTime and endTime
    const slots = generateSlots(event.startTime, event.endTime, event.duration);

    // Get already booked slots for this date
    const booked = await Booking.find({ eventId, date, status: "confirmed" });
    const bookedTimes = booked.map((b: any) => b.startTime);

    // Filter out booked slots
    const available = slots.filter((slot) => !bookedTimes.includes(slot));

    return NextResponse.json({ available });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Helper: generate time slots
function generateSlots(startTime: string, endTime: string, duration: number): string[] {
  const slots = [];
  let [h, m] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += duration;
    if (m >= 60) { h += Math.floor(m / 60); m = m % 60; }
  }

  return slots;
}