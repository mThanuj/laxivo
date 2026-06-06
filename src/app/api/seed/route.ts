import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, stores, categories, products } from "@/db/schema";

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
        await db.delete(products);
        await db.delete(stores);
        await db.delete(users).where(eq(users.role, "OWNER"));

        const passwordHash = await bcrypt.hash("password123", 10);

        const existingAdmin = await db
            .select()
            .from(users)
            .where(eq(users.email, "admin@laxivo.com"))
            .limit(1);

        if (!existingAdmin.length) {
            const adminHash = await bcrypt.hash("admin123", 10);
            await db.insert(users).values({
                name: "Admin User",
                email: "admin@laxivo.com",
                passwordHash: adminHash,
                role: "ADMIN",
            });
        }

        const [owner] = await db
            .insert(users)
            .values({
                name: "Demo Owner",
                email: "demo-owner@example.com",
                passwordHash,
                role: "OWNER",
            })
            .returning();

        const [greenBakery] = await db
            .insert(stores)
            .values({
                ownerId: owner.id,
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
            })
            .returning();

        const [urbanThreads] = await db
            .insert(stores)
            .values({
                ownerId: owner.id,
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
            })
            .returning();

        const [bloomFlowers] = await db
            .insert(stores)
            .values({
                ownerId: owner.id,
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
            })
            .returning();

        const [rusticMercantile] = await db
            .insert(stores)
            .values({
                ownerId: owner.id,
                name: "Rustic Mercantile",
                slug: "rustic-mercantile",
                description:
                    "Handcrafted goods, artisanal preserves, and vintage home decor sourced from local makers.",
                logoUrl:
                    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=400&auto=format&fit=crop",
                bannerUrl:
                    "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=1600&auto=format&fit=crop",
                contactEmail: "hello@rusticmercantile.com",
                contactPhone: "+91 88990 01122",
                location: "Jaipur, India",
                template: "vintage",
                themeColor: "#b45309",
                isPublished: true,
            })
            .returning();

        const [velocityGear] = await db
            .insert(stores)
            .values({
                ownerId: owner.id,
                name: "Velocity Gear",
                slug: "velocity-gear",
                description:
                    "Premium sports equipment, performance gear, and activewear for athletes and fitness enthusiasts.",
                logoUrl:
                    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop",
                bannerUrl:
                    "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=1600&auto=format&fit=crop",
                contactEmail: "support@velocitygear.com",
                contactPhone: "+91 77665 44332",
                location: "Mumbai, India",
                template: "bold",
                themeColor: "#7c3aed",
                isPublished: true,
            })
            .returning();

        const storeCategories = [
            {
                storeId: greenBakery.id,
                names: ["Cakes", "Pastries", "Bread", "Cookies"],
            },
            {
                storeId: urbanThreads.id,
                names: ["Hoodies", "Footwear", "Jackets"],
            },
            {
                storeId: bloomFlowers.id,
                names: ["Bouquets", "Gift Hampers", "Premium Flowers"],
            },
            {
                storeId: rusticMercantile.id,
                names: ["Preserves", "Home Decor", "Candles"],
            },
            {
                storeId: velocityGear.id,
                names: ["Footwear", "Activewear", "Accessories"],
            },
        ];

        const categoryIdMap = new Map<string, number>();

        for (const sc of storeCategories) {
            for (const name of sc.names) {
                await db
                    .insert(categories)
                    .values({
                        storeId: sc.storeId,
                        name,
                    })
                    .onConflictDoNothing();

                const [cat] = await db
                    .select()
                    .from(categories)
                    .where(
                        and(
                            eq(categories.storeId, sc.storeId),
                            eq(categories.name, name)
                        )
                    )
                    .limit(1);

                if (cat) {
                    const key = `${sc.storeId}:${name}`;
                    categoryIdMap.set(key, cat.id);
                }
            }
        }

        function getCatId(storeId: number, name: string): number | undefined {
            return categoryIdMap.get(`${storeId}:${name}`);
        }

        const allProducts = [
            {
                storeId: greenBakery.id,
                name: "Chocolate Truffle Cake",
                description:
                    "Rich and moist chocolate cake layered with smooth truffle cream.",
                price: 699,
                offerPrice: 549,
                imageUrl:
                    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(greenBakery.id, "Cakes"),
                isActive: true,
            },
            {
                storeId: greenBakery.id,
                name: "Butter Croissant",
                description:
                    "Flaky golden croissant made with premium butter and fresh dough.",
                price: 129,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(greenBakery.id, "Pastries"),
                isActive: true,
            },
            {
                storeId: greenBakery.id,
                name: "Sourdough Bread",
                description:
                    "Naturally fermented sourdough loaf with a crisp crust and soft center.",
                price: 249,
                offerPrice: 199,
                imageUrl:
                    "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(greenBakery.id, "Bread"),
                isActive: true,
            },
            {
                storeId: greenBakery.id,
                name: "Assorted Cookies Box",
                description:
                    "A box of freshly baked cookies with chocolate chip, oats, and butter cookies.",
                price: 399,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(greenBakery.id, "Cookies"),
                isActive: true,
            },
            {
                storeId: urbanThreads.id,
                name: "Oversized Black Hoodie",
                description:
                    "Premium cotton oversized hoodie with a relaxed streetwear fit.",
                price: 1499,
                offerPrice: 1199,
                imageUrl:
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(urbanThreads.id, "Hoodies"),
                isActive: true,
            },
            {
                storeId: urbanThreads.id,
                name: "Classic White Sneakers",
                description:
                    "Minimal white sneakers designed for everyday wear and comfort.",
                price: 2199,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(urbanThreads.id, "Footwear"),
                isActive: true,
            },
            {
                storeId: urbanThreads.id,
                name: "Denim Jacket",
                description:
                    "Timeless blue denim jacket with a structured fit and durable finish.",
                price: 1899,
                offerPrice: 1499,
                imageUrl:
                    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(urbanThreads.id, "Jackets"),
                isActive: true,
            },
            {
                storeId: bloomFlowers.id,
                name: "Rose Bouquet",
                description:
                    "A beautiful bouquet of fresh red roses wrapped elegantly for gifting.",
                price: 799,
                offerPrice: 649,
                imageUrl:
                    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(bloomFlowers.id, "Bouquets"),
                isActive: true,
            },
            {
                storeId: bloomFlowers.id,
                name: "Mixed Flower Basket",
                description:
                    "A curated basket of seasonal flowers for birthdays and celebrations.",
                price: 1199,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(bloomFlowers.id, "Gift Hampers"),
                isActive: true,
            },
            {
                storeId: bloomFlowers.id,
                name: "Orchid Arrangement",
                description:
                    "Elegant orchid arrangement for home decor, events, and premium gifting.",
                price: 1599,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(bloomFlowers.id, "Premium Flowers"),
                isActive: true,
            },
            {
                storeId: rusticMercantile.id,
                name: "Artisan Honey Jar",
                description:
                    "Pure wildflower honey sourced from local beekeepers, packaged in a handcrafted glass jar.",
                price: 449,
                offerPrice: 379,
                imageUrl:
                    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(rusticMercantile.id, "Preserves"),
                isActive: true,
            },
            {
                storeId: rusticMercantile.id,
                name: "Handwoven Basket",
                description:
                    "Traditional handwoven basket made from natural cane fibers, perfect for storage or decor.",
                price: 899,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1543198126-a4ad71f472fe?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(rusticMercantile.id, "Home Decor"),
                isActive: true,
            },
            {
                storeId: rusticMercantile.id,
                name: "Soy Wax Candle Set",
                description:
                    "Set of three soy wax candles with lavender, vanilla, and sandalwood scents.",
                price: 599,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(rusticMercantile.id, "Candles"),
                isActive: true,
            },
            {
                storeId: velocityGear.id,
                name: "Pro Running Shoes",
                description:
                    "Lightweight carbon-fiber running shoes with responsive cushioning for peak performance.",
                price: 5999,
                offerPrice: 4499,
                imageUrl:
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(velocityGear.id, "Footwear"),
                isActive: true,
            },
            {
                storeId: velocityGear.id,
                name: "Compression Training Tee",
                description:
                    "Moisture-wicking compression shirt with four-way stretch for intense workouts.",
                price: 1299,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(velocityGear.id, "Activewear"),
                isActive: true,
            },
            {
                storeId: velocityGear.id,
                name: "Insulated Water Bottle",
                description:
                    "Double-walled stainless steel bottle that keeps drinks cold for 24 hours or hot for 12.",
                price: 799,
                offerPrice: undefined,
                imageUrl:
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop",
                categoryId: getCatId(velocityGear.id, "Accessories"),
                isActive: true,
            },
        ];

        for (const product of allProducts) {
            await db
                .insert(products)
                .values(product as typeof products.$inferInsert);
        }

        return NextResponse.json({
            success: true,
            message: "Database wiped and seeded successfully",
            demoOwner: {
                email: "demo-owner@example.com",
                password: "password123",
            },
            stores: [
                {
                    name: greenBakery.name,
                    slug: greenBakery.slug,
                    template: "classic",
                },
                {
                    name: urbanThreads.name,
                    slug: urbanThreads.slug,
                    template: "modern",
                },
                {
                    name: bloomFlowers.name,
                    slug: bloomFlowers.slug,
                    template: "minimal",
                },
                {
                    name: rusticMercantile.name,
                    slug: rusticMercantile.slug,
                    template: "vintage",
                },
                {
                    name: velocityGear.name,
                    slug: velocityGear.slug,
                    template: "bold",
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
