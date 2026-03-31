import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/auth";


export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const token = req.headers.get("authorization")?.split(" ")[1]
        if (!token) { return NextResponse.json({ error: "unauthorized" }, { status: 401 }) }

        const decoded = verifyToken(token)
        if (!decoded) { return NextResponse.json({ error: "unauthorized" }, { status: 401 }) }
        const { userId } = decoded

        const events = await Event.find({ userId })
        return NextResponse.json({ events })


    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const token = req.headers.get("authorization")?.split(" ")[1]
        if (!token) { return NextResponse.json({ error: "unauthorized" }, { status: 401 }) }

        const decoded = verifyToken(token)
        if (!decoded) { return NextResponse.json({ error: "unauthorized" }, { status: 401 }) }

        const { userId } = decoded
        const { title, duration, color, days, startTime, endTime } = await req.json();

        const slug = title.toLowerCase().replace(/\s+/g, "-")

        const event = await Event.create({
            userId,
            title,
            slug,
            duration,
            color,
            days,
            startTime,
            endTime,
        })

        return NextResponse.json({ event }, { status: 201 })



    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}