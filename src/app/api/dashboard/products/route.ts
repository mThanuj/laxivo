import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { StoreModel } from "@/models/Store";
import { getAuthUserFromRequest } from "@/lib/auth";

async function getOwnerStore(ownerId: string) {
    const store = await StoreModel.findOne({
        ownerId,
    });

    return store;
}

export async function POST(request: NextRequest) {
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

        const store = await getOwnerStore(currentUser.userId);

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Demo owner store not found. Run /api/seed first.",
                },
                { status: 404 }
            );
        }

        const body = await request.json();

        const { name, description, price, imageUrl, category } = body;

        if (!name || !category || !price || !imageUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Name, category, price, and image URL are required.",
                },
                { status: 400 }
            );
        }

        const numericPrice = Number(price);

        if (!numericPrice || numericPrice <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Enter a valid product price.",
                },
                { status: 400 }
            );
        }

        const product = await ProductModel.create({
            storeId: store._id,
            name: String(name).trim(),
            description: String(description || "").trim(),
            price: numericPrice,
            imageUrl: String(imageUrl).trim(),
            category: String(category).trim(),
            isActive: true,
        });

        return NextResponse.json({
            success: true,
            message: "Product created successfully.",
            product: {
                id: product._id.toString(),
                storeId: product.storeId.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
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
