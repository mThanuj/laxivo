import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "OWNER" | "ADMIN";

export type UserDocument = {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["OWNER", "ADMIN"],
            default: "OWNER",
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = models.User || model<UserDocument>("User", userSchema);
