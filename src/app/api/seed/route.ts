import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";
import { StoreModel } from "@/models/Store";
import { ProductModel } from "@/models/Product";

export async function GET() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            {
                success: false,
                message: "Seed route is disabled in production.",
            },
            { status: 403 }
        );
    }

    try {
        await connectDb();

        await ProductModel.deleteMany({});
        await StoreModel.deleteMany({});
        await UserModel.deleteMany({ email: "demo-owner@example.com" });

        const passwordHash = await bcrypt.hash("password123", 10);

        const owner = await UserModel.create({
            name: "Demo Owner",
            email: "demo-owner@example.com",
            passwordHash,
            role: "OWNER",
        });

        const greenBakery = await StoreModel.create({
            ownerId: owner._id,
            name: "Green Bakery",
            slug: "green-bakery",
            description:
                "Freshly baked cakes, cookies, bread, and desserts made with love every morning.",
            logoUrl:
                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop",
            bannerUrl:
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop",
            contactEmail: "hello@greenbakery.com",
            contactPhone: "+91 98765 43210",
            location: "Hyderabad, India",
            template: "classic",
            themeColor: "#16a34a",
            isPublished: true,
        });

        const urbanThreads = await StoreModel.create({
            ownerId: owner._id,
            name: "Urban Threads",
            slug: "urban-threads",
            description:
                "Trendy streetwear, everyday essentials, and modern fashion for young creators.",
            logoUrl:
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop",
            bannerUrl:
                "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
            contactEmail: "support@urbanthreads.com",
            contactPhone: "+91 91234 56789",
            location: "Bengaluru, India",
            template: "modern",
            themeColor: "#111827",
            isPublished: true,
        });

        const bloomFlowers = await StoreModel.create({
            ownerId: owner._id,
            name: "Bloom Flowers",
            slug: "bloom-flowers",
            description:
                "Elegant bouquets, fresh flowers, and curated gift hampers for every occasion.",
            logoUrl:
                "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=400&auto=format&fit=crop",
            bannerUrl:
                "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=1600&auto=format&fit=crop",
            contactEmail: "orders@bloomflowers.com",
            contactPhone: "+91 99887 76655",
            location: "Pune, India",
            template: "minimal",
            themeColor: "#db2777",
            isPublished: true,
        });

        await ProductModel.insertMany([
            {
                storeId: greenBakery._id,
                name: "Chocolate Truffle Cake",
                description:
                    "Rich and moist chocolate cake layered with smooth truffle cream.",
                price: 699,
                imageUrl:
                    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
                category: "Cakes",
                isActive: true,
            },
            {
                storeId: greenBakery._id,
                name: "Butter Croissant",
                description:
                    "Flaky golden croissant made with premium butter and fresh dough.",
                price: 129,
                imageUrl:
                    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
                category: "Pastries",
                isActive: true,
            },
            {
                storeId: greenBakery._id,
                name: "Sourdough Bread",
                description:
                    "Naturally fermented sourdough loaf with a crisp crust and soft center.",
                price: 249,
                imageUrl:
                    "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop",
                category: "Bread",
                isActive: true,
            },
            {
                storeId: greenBakery._id,
                name: "Assorted Cookies Box",
                description:
                    "A box of freshly baked cookies with chocolate chip, oats, and butter cookies.",
                price: 399,
                imageUrl:
                    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
                category: "Cookies",
                isActive: true,
            },

            {
                storeId: urbanThreads._id,
                name: "Oversized Black Hoodie",
                description:
                    "Premium cotton oversized hoodie with a relaxed streetwear fit.",
                price: 1499,
                imageUrl:
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
                category: "Hoodies",
                isActive: true,
            },
            {
                storeId: urbanThreads._id,
                name: "Classic White Sneakers",
                description:
                    "Minimal white sneakers designed for everyday wear and comfort.",
                price: 2199,
                imageUrl:
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
                category: "Footwear",
                isActive: true,
            },
            {
                storeId: urbanThreads._id,
                name: "Denim Jacket",
                description:
                    "Timeless blue denim jacket with a structured fit and durable finish.",
                price: 1899,
                imageUrl:
                    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800&auto=format&fit=crop",
                category: "Jackets",
                isActive: true,
            },

            {
                storeId: bloomFlowers._id,
                name: "Rose Bouquet",
                description:
                    "A beautiful bouquet of fresh red roses wrapped elegantly for gifting.",
                price: 799,
                imageUrl:
                    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
                category: "Bouquets",
                isActive: true,
            },
            {
                storeId: bloomFlowers._id,
                name: "Mixed Flower Basket",
                description:
                    "A curated basket of seasonal flowers for birthdays and celebrations.",
                price: 1199,
                imageUrl:
                    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
                category: "Gift Hampers",
                isActive: true,
            },
            {
                storeId: bloomFlowers._id,
                name: "Orchid Arrangement",
                description:
                    "Elegant orchid arrangement for home decor, events, and premium gifting.",
                price: 1599,
                imageUrl:
                    "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=800&auto=format&fit=crop",
                category: "Premium Flowers",
                isActive: true,
            },
        ]);

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully",
            demoOwner: {
                email: "demo-owner@example.com",
                password: "password123",
            },
            stores: [
                {
                    name: greenBakery.name,
                    slug: greenBakery.slug,
                },
                {
                    name: urbanThreads.name,
                    slug: urbanThreads.slug,
                },
                {
                    name: bloomFlowers.name,
                    slug: bloomFlowers.slug,
                },
            ],
        });
    } catch (error) {
        console.error("Seed error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Database seeding failed",
            },
            {
                status: 500,
            }
        );
    }
}
