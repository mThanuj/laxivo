import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, stores } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";

type UserWithStoreCount = {
    id: number;
    name: string;
    email: string;
    role: string | null;
    createdAt: Date;
    storeCount: number;
};

export async function GET(request: NextRequest) {
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

        const allUsers = await db.select().from(users).orderBy(users.createdAt);

        const usersWithStoreCounts: UserWithStoreCount[] = await Promise.all(
            allUsers.map(async (user) => {
                const storeCount = await db.$count(
                    stores,
                    eq(stores.ownerId, user.id)
                );
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    storeCount,
                };
            })
        );

        return NextResponse.json({
            success: true,
            users: usersWithStoreCounts,
        });
    } catch (error) {
        console.error("Admin users fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users." },
            { status: 500 }
        );
    }
}
