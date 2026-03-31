import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // JWT token

    console.log("Code:", code);
    console.log("State (token):", state);

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google=error`);
    }

    const { tokens } = await oauth2Client.getToken(code);
    console.log("Google tokens:", tokens);

    const decoded = verifyToken(state);
    console.log("Decoded:", decoded);

    if (!decoded) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google=error`);
    }

    await connectDB();
    await User.findByIdAndUpdate(decoded.userId, {
      googleCalendarToken: JSON.stringify(tokens),
    });

    console.log("Google token saved for user:", decoded.userId);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google=connected`);
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google=error`);
  }
}