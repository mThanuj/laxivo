import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { stores } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getAllTemplateKeysSync } from "@/lib/templateLoader";

export async function PUT(request: NextRequest) {
    try {
        const currentUser = getAuthUserFromRequest(request);

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated.",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { template } = body;

        if (!template || !getAllTemplateKeysSync().includes(template)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid template selected.",
                },
                { status: 400 }
            );
        }

        const [updatedStore] = await db
            .update(stores)
            .set({
                template,
                updatedAt: new Date(),
            })
            .where(eq(stores.ownerId, Number(currentUser.userId)))
            .returning();

        if (!updatedStore) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Store not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Template updated successfully.",
            store: {
                id: updatedStore.id,
                ownerId: updatedStore.ownerId,
                name: updatedStore.name,
                slug: updatedStore.slug,
                description: updatedStore.description,
                bannerUrl: updatedStore.bannerUrl,
                contactEmail: updatedStore.contactEmail,
                contactPhone: updatedStore.contactPhone,
                location: updatedStore.location,
                template: updatedStore.template,
                themeColor: updatedStore.themeColor,
                isPublished: updatedStore.isPublished,
            },
        });
    } catch (error) {
        console.error("Template update error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update template.",
            },
            { status: 500 }
        );
    }
}
