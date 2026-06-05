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

        const {
            name,
            slug,
            description,
            logoUrl,
            bannerUrl,
            contactEmail,
            contactPhone,
            location,
            template,
            themeColor,
            isPublished,
        } = body;

        if (
            !name ||
            !slug ||
            !description ||
            !contactEmail ||
            !contactPhone ||
            !location
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required store fields.",
                },
                { status: 400 }
            );
        }

        if (template && !allowedTemplates.includes(template)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid template selected.",
                },
                { status: 400 }
            );
        }

        const normalizedSlug = String(slug)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (!normalizedSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Store slug is invalid.",
                },
                { status: 400 }
            );
        }

        const duplicateStore = await StoreModel.findOne({
            slug: normalizedSlug,
            ownerId: { $ne: currentUser.userId },
        });

        if (duplicateStore) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This slug is already used by another store.",
                },
                { status: 409 }
            );
        }

        const updatedStore = await StoreModel.findOneAndUpdate(
            {
                ownerId: currentUser.userId,
            },
            {
                name: String(name).trim(),
                slug: normalizedSlug,
                description: String(description).trim(),
                logoUrl: String(logoUrl || "").trim(),
                bannerUrl: String(bannerUrl || "").trim(),
                contactEmail: String(contactEmail).trim().toLowerCase(),
                contactPhone: String(contactPhone).trim(),
                location: String(location).trim(),
                template: template || "classic",
                themeColor: themeColor || "#16a34a",
                isPublished: Boolean(isPublished),
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
            message: "Store updated successfully.",
            store: {
                id: updatedStore._id.toString(),
                ownerId: updatedStore.ownerId.toString(),
                name: updatedStore.name,
                slug: updatedStore.slug,
                description: updatedStore.description,
                logoUrl: updatedStore.logoUrl,
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
        console.error("Store update error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update store.",
            },
            { status: 500 }
        );
    }
}
