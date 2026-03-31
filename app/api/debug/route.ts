import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "no token" });
  const decoded = verifyToken(token);
  const user = await User.findById(decoded?.userId);
  return NextResponse.json({ 
    googleCalendarToken: user?.googleCalendarToken,
    userId: user?._id 
  });
}