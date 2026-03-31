import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {

        await connectDB()
        const { email, password } = await req.json()

        // find user by mail
        const user = await User.findOne({ email })
        if (!user) { return NextResponse.json({ message: "user not found" }, { status: 401 }) }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) { return NextResponse.json({ message: "invalid credentials" }, { status: 401 }) }
        // generate token
        const token = signToken(user._id.toString())

        return NextResponse.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error("EVENTS ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
