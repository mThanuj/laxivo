import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    const accept = request.headers.get("accept") ?? "";
    const isFormSubmission = accept.includes("text/html");

    if (isFormSubmission) {
        return NextResponse.redirect(new URL("/", request.url), {
            status: 303,
        });
    }

    return NextResponse.json({
        success: true,
        message: "Logged out successfully.",
    });
}
