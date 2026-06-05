import mongoose, { Schema, models, model } from "mongoose";

export type ProductDocument = {
    _id: mongoose.Types.ObjectId;
    storeId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const productSchema = new Schema<ProductDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ProductModel =
    models.Product || model<ProductDocument>("Product", productSchema);
