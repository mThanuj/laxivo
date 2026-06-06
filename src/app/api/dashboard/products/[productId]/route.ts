import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { products, stores, categories } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";

type RouteProps = {
    params: Promise<{
        productId: string;
    }>;
};

async function getOwnerStore(ownerId: number) {
    return db.query.stores.findFirst({
        where: eq(stores.ownerId, ownerId),
    });
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
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

        const { productId } = await params;
        const parsedProductId = Number(productId);

        if (Number.isNaN(parsedProductId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID.",
                },
                { status: 400 }
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

        const [product] = await db
            .update(products)
            .set({
                ...body,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(products.id, parsedProductId),
                    eq(products.storeId, store.id)
                )
            )
            .returning();

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found.",
                },
                { status: 404 }
            );
        }

        let categoryName: string | null = null;
        if (product.categoryId) {
            const [cat] = await db
                .select()
                .from(categories)
                .where(eq(categories.id, product.categoryId))
                .limit(1);
            categoryName = cat?.name ?? null;
        }

        return NextResponse.json({
            success: true,
            message: "Product updated successfully.",
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
        console.error("Update product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update product.",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
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

        const { productId } = await params;
        const parsedProductId = Number(productId);

        if (Number.isNaN(parsedProductId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID.",
                },
                { status: 400 }
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

        const [deletedProduct] = await db
            .delete(products)
            .where(
                and(
                    eq(products.id, parsedProductId),
                    eq(products.storeId, store.id)
                )
            )
            .returning();

        if (!deletedProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Delete product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete product.",
            },
            { status: 500 }
        );
    }
}
