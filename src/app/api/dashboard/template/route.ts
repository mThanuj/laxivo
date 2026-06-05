import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { StoreModel } from "@/models/Store";
import { getAuthUserFromRequest } from "@/lib/auth";

const allowedTemplates = ["classic", "modern", "minimal"];

export async function PUT(request: NextRequest) {
    try {
        await connectDb();

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

        if (!template || !allowedTemplates.includes(template)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid template selected.",
                },
                { status: 400 }
            );
        }

        const updatedStore = await StoreModel.findOneAndUpdate(
            {
                ownerId: currentUser.userId,
            },
            {
                template,
            },
            {
                new: true,
            }
        );

        if (!updatedStore) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Store not found for demo owner.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Template updated successfully.",
            store: {
                id: updatedStore._id.toString(),
                ownerId: updatedStore.ownerId.toString(),
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
