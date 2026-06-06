import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, stores } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";

async function getOwnerStore(ownerId: number) {
    const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.ownerId, ownerId))
        .limit(1);
    return store;
}

export async function GET(request: NextRequest) {
    try {
        const currentUser = getAuthUserFromRequest(request);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Not authenticated." },
                { status: 401 }
            );
        }

        const store = await getOwnerStore(Number(currentUser.userId));

        if (!store) {
            return NextResponse.json(
                { success: false, message: "Owner store not found." },
                { status: 404 }
            );
        }

        const result = await db
            .select()
            .from(categories)
            .where(eq(categories.storeId, store.id))
            .orderBy(categories.name);

        return NextResponse.json({
            success: true,
            categories: result.map((c) => ({
                id: c.id,
                name: c.name,
            })),
        });
    } catch (error) {
        console.error("Fetch categories error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUser = getAuthUserFromRequest(request);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Not authenticated." },
                { status: 401 }
            );
        }

        const store = await getOwnerStore(Number(currentUser.userId));

        if (!store) {
            return NextResponse.json(
                { success: false, message: "Owner store not found." },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name } = body;

        if (!name || !String(name).trim()) {
            return NextResponse.json(
                { success: false, message: "Category name is required." },
                { status: 400 }
            );
        }

        const trimmedName = String(name).trim();
        const existing = await db
            .select()
            .from(categories)
            .where(
                and(
                    eq(categories.storeId, store.id),
                    eq(categories.name, trimmedName)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            return NextResponse.json({
                success: true,
                category: { id: existing[0].id, name: existing[0].name },
                message: "Category already exists.",
            });
        }

        const [category] = await db
            .insert(categories)
            .values({
                storeId: store.id,
                name: String(name).trim(),
            })
            .returning();

        return NextResponse.json({
            success: true,
            category: { id: category.id, name: category.name },
            message: "Category created successfully.",
        });
    } catch (error) {
        console.error("Create category error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create category." },
            { status: 500 }
        );
    }
}
