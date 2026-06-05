import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { StoreModel } from "@/models/Store";
import { UserModel } from "@/models/User";
import { signAuthToken } from "@/lib/auth";

async function generateUniqueSlug(businessName: string) {
    const baseSlug = createSlug(businessName);

    if (!baseSlug) {
        return `store-${Date.now()}`;
    }

    let slug = baseSlug;
    let counter = 1;

    while (await StoreModel.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }

    return slug;
}

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const body = await request.json();

        const { name, email, password, businessName } = body;

        if (!name || !email || !password || !businessName) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Name, email, password, and business name are required.",
                },
                { status: 400 }
            );
        }

        if (String(password).length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be at least 6 characters.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const existingUser = await UserModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "An account with this email already exists.",
                },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(String(password), 10);

        const user = await UserModel.create({
            name: String(name).trim(),
            email: normalizedEmail,
            passwordHash,
            role: "OWNER",
        });

        const slug = await generateUniqueSlug(String(businessName));

        const store = await StoreModel.create({
            ownerId: user._id,
            name: String(businessName).trim(),
            slug,
            description:
                "Welcome to our online store. Update this description from your dashboard.",
            logoUrl:
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
            bannerUrl:
                "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1600&auto=format&fit=crop",
            contactEmail: normalizedEmail,
            contactPhone: "+91 00000 00000",
            location: "Update your location",
            template: "classic",
            themeColor: "#2563eb",
            isPublished: true,
        });

        const token = signAuthToken({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json(
            {
                success: true,
                message: "Account and starter store created successfully.",
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                store: {
                    id: store._id.toString(),
                    ownerId: store.ownerId.toString(),
                    name: store.name,
                    slug: store.slug,
                    description: store.description,
                    logoUrl: store.logoUrl,
                    bannerUrl: store.bannerUrl,
                    contactEmail: store.contactEmail,
                    contactPhone: store.contactPhone,
                    location: store.location,
                    template: store.template,
                    themeColor: store.themeColor,
                    isPublished: store.isPublished,
                },
            },
            { status: 201 }
        );

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Register error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create account.",
            },
            { status: 500 }
        );
    }
}
