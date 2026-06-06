import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, stores, products } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";

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

        const totalUsers = await db.$count(users);
        const totalStores = await db.$count(stores);
        const totalProducts = await db.$count(products);
        const publishedStores = await db.$count(
            stores,
            eq(stores.isPublished, true)
        );
        const adminCount = await db.$count(users, eq(users.role, "ADMIN"));

        return NextResponse.json({
            success: true,
            analytics: {
                totalUsers,
                totalStores,
                totalProducts,
                publishedStores,
                adminCount,
            },
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch analytics." },
            { status: 500 }
        );
    }
}
