import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const slug = searchParams.get("slug");

    const host = await User.findOne({ username });
    if (!host) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const event = await Event.findOne({ userId: host._id, slug, isActive: true });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ 
      event, 
      host: { _id: host._id, name: host.name } 
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
