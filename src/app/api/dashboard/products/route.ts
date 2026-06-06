import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { products, stores, categories } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";

async function getOwnerStore(ownerId: number) {
    const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.ownerId, ownerId))
        .limit(1);

    return store;
}

export async function POST(request: NextRequest) {
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

        const store = await getOwnerStore(Number(currentUser.userId));

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Owner store not found.",
                },
                { status: 404 }
            );
        }

        const body = await request.json();

        const { name, description, price, offerPrice, imageUrl, categoryId } =
            body;

        if (!name || !price || !imageUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Product name, original price, and image are required.",
                },
                { status: 400 }
            );
        }

        const numericPrice = Number(price);

        if (Number.isNaN(numericPrice) || numericPrice <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Enter a valid product price.",
                },
                { status: 400 }
            );
        }

        const numericOfferPrice = offerPrice ? Number(offerPrice) : null;

        if (
            numericOfferPrice !== null &&
            (Number.isNaN(numericOfferPrice) || numericOfferPrice < 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Enter a valid offer price.",
                },
                { status: 400 }
            );
        }

        const parsedCategoryId = categoryId ? Number(categoryId) : undefined;

        if (parsedCategoryId) {
            const [cat] = await db
                .select()
                .from(categories)
                .where(eq(categories.id, parsedCategoryId))
                .limit(1);

            if (!cat) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Selected category does not exist.",
                    },
                    { status: 400 }
                );
            }
        }

        const [product] = await db
            .insert(products)
            .values({
                storeId: store.id,
                name: String(name).trim(),
                description: description ? String(description).trim() : null,
                price: numericPrice,
                offerPrice: numericOfferPrice,
                imageUrl: String(imageUrl).trim(),
                categoryId: parsedCategoryId,
                isActive: true,
            })
            .returning();

        let categoryName: string | null = null;
        if (parsedCategoryId) {
            const [cat] = await db
                .select()
                .from(categories)
                .where(eq(categories.id, parsedCategoryId))
                .limit(1);
            categoryName = cat?.name ?? null;
        }

        return NextResponse.json({
            success: true,
            message: "Product created successfully.",
            product: {
                id: product.id,
                storeId: product.storeId,
                name: product.name,
                description: product.description,
                price: product.price,
                offerPrice: product.offerPrice,
                imageUrl: product.imageUrl,
                categoryName,
                isActive: product.isActive,
            },
        });
    } catch (error) {
        console.error("Create product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create product.",
            },
            { status: 500 }
        );
    }
}
