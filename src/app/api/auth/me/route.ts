import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated.",
                },
                { status: 401 }
            );
        }

        const user = verifyAuthToken(token);

        return NextResponse.json({
            success: true,
            user,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid or expired session.",
            },
            { status: 401 }
        );
    }
}
