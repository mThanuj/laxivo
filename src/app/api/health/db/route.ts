import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            message: "Database connected successfully",
        });
    } catch (error) {
        console.error("Database connection error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
            },
            {
                status: 500,
            }
        );
    }
}
