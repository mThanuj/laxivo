import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSlug } from "@/lib/slug";
import { signAuthToken } from "@/lib/auth";

async function generateUniqueSlug(businessName: string) {
    const baseSlug = createSlug(businessName);

    if (!baseSlug) {
        return `store-${Date.now()}`;
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, slug))
            .limit(1);

        if (!existing.length) {
            break;
        }

        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }

    return slug;
}

export async function POST(request: NextRequest) {
    try {
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

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .limit(1);

        if (existingUser.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "An account with this email already exists.",
                },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(String(password), 10);

        const newUser = await db
            .insert(users)
            .values({
                name: String(name).trim(),
                email: normalizedEmail,
                passwordHash,
                role: "OWNER",
            })
            .returning();

        const user = newUser[0];

        const slug = await generateUniqueSlug(String(businessName));

        const newStore = await db
            .insert(stores)
            .values({
                ownerId: user.id,
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
            })
            .returning();

        const store = newStore[0];

        const token = signAuthToken({
            userId: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role as "OWNER" | "ADMIN",
        });

        const response = NextResponse.json(
            {
                success: true,
                message: "Account and starter store created successfully.",
                user: {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                store: {
                    id: String(store.id),
                    ownerId: String(store.ownerId),
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
