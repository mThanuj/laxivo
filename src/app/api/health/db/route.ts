import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

export async function GET() {
    try {
        await connectDb();

        return NextResponse.json({
            success: true,
            message: "MongoDB connected successfully",
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "MongoDB connection failed",
            },
            {
                status: 500,
            }
        );
    }
}
