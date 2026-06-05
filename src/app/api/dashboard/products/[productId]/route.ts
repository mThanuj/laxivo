import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { StoreModel } from "@/models/Store";
import { getAuthUserFromRequest } from "@/lib/auth";

type RouteProps = {
    params: Promise<{
        productId: string;
    }>;
};

async function getOwnerStore(ownerId: string) {
    const store = await StoreModel.findOne({
        ownerId,
    });

    return store;
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
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

        const { productId } = await params;

        if (!mongoose.isValidObjectId(productId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID.",
                },
                { status: 400 }
            );
        }

        const store = await getOwnerStore(currentUser.userId);

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

        const product = await ProductModel.findOneAndUpdate(
            {
                _id: productId,
                storeId: store._id,
            },
            body,
            {
                new: true,
            }
        );

        if (!product) {
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
            message: "Product updated successfully.",
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

        const { productId } = await params;

        if (!mongoose.isValidObjectId(productId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID.",
                },
                { status: 400 }
            );
        }

        const store = await getOwnerStore(currentUser.userId);

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Demo owner store not found.",
                },
                { status: 404 }
            );
        }

        const deletedProduct = await ProductModel.findOneAndDelete({
            _id: productId,
            storeId: store._id,
        });

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
