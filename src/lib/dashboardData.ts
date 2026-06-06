import { db } from "@/lib/db";
import { stores, products, categories } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Product } from "@/types/product";
import { Store } from "@/types/store";

export async function getOwnerDashboardData(ownerId: string) {
    try {
        const result = await db
            .select()
            .from(stores)
            .where(eq(stores.ownerId, parseInt(ownerId)))
            .limit(1);

        if (!result.length) {
            return null;
        }

        const store = result[0];

        const recentProducts = await db
            .select({
                id: products.id,
                storeId: products.storeId,
                name: products.name,
                description: products.description,
                price: products.price,
                offerPrice: products.offerPrice,
                imageUrl: products.imageUrl,
                categoryId: products.categoryId,
                categoryName: categories.name,
                isActive: products.isActive,
                createdAt: products.createdAt,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(eq(products.storeId, store.id))
            .orderBy(desc(products.createdAt))
            .limit(5);

        const totalProducts = await db.$count(
            products,
            eq(products.storeId, store.id)
        );

        const activeProducts = await db.$count(
            products,
            and(eq(products.storeId, store.id), eq(products.isActive, true))
        );

        return {
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
                template: store.template as Store["template"],
                themeColor: store.themeColor,
                isPublished: store.isPublished,
            } as Store,
            recentProducts: recentProducts.map(
                (p) =>
                    ({
                        id: String(p.id),
                        storeId: String(p.storeId),
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        offerPrice: p.offerPrice,
                        imageUrl: p.imageUrl,
                        categoryName: p.categoryName,
                        isActive: p.isActive,
                    }) as Product
            ),
            totalProducts,
            activeProducts,
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return null;
    }
}

export async function getOwnerStore(ownerId: string) {
    try {
        const result = await db
            .select()
            .from(stores)
            .where(eq(stores.ownerId, parseInt(ownerId)))
            .limit(1);

        if (!result.length) {
            return null;
        }

        const store = result[0];
        return {
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
            template: store.template as Store["template"],
            themeColor: store.themeColor,
            isPublished: store.isPublished,
        } as Store;
    } catch (error) {
        console.error("Error fetching owner store:", error);
        return null;
    }
}

export async function getOwnerProductsData(ownerId: string) {
    try {
        const result = await db
            .select()
            .from(stores)
            .where(eq(stores.ownerId, parseInt(ownerId)))
            .limit(1);

        if (!result.length) {
            return null;
        }

        const store = result[0];

        const allProducts = await db
            .select({
                id: products.id,
                storeId: products.storeId,
                name: products.name,
                description: products.description,
                price: products.price,
                offerPrice: products.offerPrice,
                imageUrl: products.imageUrl,
                categoryId: products.categoryId,
                categoryName: categories.name,
                isActive: products.isActive,
                createdAt: products.createdAt,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(eq(products.storeId, store.id))
            .orderBy(desc(products.createdAt));

        return {
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
                template: store.template as Store["template"],
                themeColor: store.themeColor,
                isPublished: store.isPublished,
            } as Store,
            products: allProducts.map(
                (p) =>
                    ({
                        id: String(p.id),
                        storeId: String(p.storeId),
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        offerPrice: p.offerPrice,
                        imageUrl: p.imageUrl,
                        categoryName: p.categoryName,
                        isActive: p.isActive,
                    }) as Product
            ),
        };
    } catch (error) {
        console.error("Error fetching owner products:", error);
        return null;
    }
}
