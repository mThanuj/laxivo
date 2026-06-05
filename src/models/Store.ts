import mongoose, { Schema, models, model } from "mongoose";
import { StoreTemplate } from "@/types/store";

export type StoreDocument = {
    _id: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    template: StoreTemplate;
    themeColor: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const storeSchema = new Schema<StoreDocument>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        logoUrl: {
            type: String,
            required: true,
        },
        bannerUrl: {
            type: String,
            required: true,
        },
        contactEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        contactPhone: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        template: {
            type: String,
            enum: ["classic", "modern", "minimal"],
            default: "classic",
        },
        themeColor: {
            type: String,
            default: "#16a34a",
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const StoreModel =
    models.Store || model<StoreDocument>("Store", storeSchema);
