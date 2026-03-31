import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "../../../../models/User"
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { name, email, username, password } = await req.json()

        const exist = await User.findOne({ email })
        if (exist) { return NextResponse.json({ error: "email already registers" }, { status: 400 }) }


        const hashedpass = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, email, username, password: hashedpass
        })

        const token = signToken(user._id.toString())
        return NextResponse.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, username: user.username }
        }, { status: 201 });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}