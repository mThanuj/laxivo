import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";

type RouteProps = {
    params: Promise<{
        userId: string;
    }>;
};

export async function DELETE(request: NextRequest, { params }: RouteProps) {
    try {
        const currentUser = getAuthUserFromRequest(request);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Not authenticated." },
                { status: 401 }
            );
        }

        if (currentUser.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, message: "Access denied. Admins only." },
                { status: 403 }
            );
        }

        const { userId } = await params;
        const parsedUserId = Number(userId);

        if (Number.isNaN(parsedUserId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID." },
                { status: 400 }
            );
        }

        if (parsedUserId === Number(currentUser.userId)) {
            return NextResponse.json(
                { success: false, message: "Cannot delete your own account." },
                { status: 400 }
            );
        }

        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, parsedUserId))
            .returning();

        if (!deletedUser) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete user." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest, { params }: RouteProps) {
    try {
        const currentUser = getAuthUserFromRequest(request);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Not authenticated." },
                { status: 401 }
            );
        }

        if (currentUser.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, message: "Access denied. Admins only." },
                { status: 403 }
            );
        }

        const { userId } = await params;
        const parsedUserId = Number(userId);

        if (Number.isNaN(parsedUserId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { subject, message } = body;

        if (!subject || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject and message are required.",
                },
                { status: 400 }
            );
        }

        const [targetUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, parsedUserId))
            .limit(1);

        if (!targetUser) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        console.log("Contact request:", {
            from: currentUser.email,
            to: targetUser.email,
            toName: targetUser.name,
            subject,
            message,
        });

        return NextResponse.json({
            success: true,
            message: `Contact request logged for ${targetUser.email}.`,
        });
    } catch (error) {
        console.error("Contact user error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to contact user." },
            { status: 500 }
        );
    }
}
