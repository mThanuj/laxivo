import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { signAuthToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and password are required.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const user = await UserModel.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password.",
                },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(
            String(password),
            user.passwordHash
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password.",
                },
                { status: 401 }
            );
        }

        const token = signAuthToken({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully.",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to login.",
            },
            { status: 500 }
        );
    }
}
