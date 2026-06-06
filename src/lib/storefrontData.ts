import { db } from "@/lib/db";
import { stores, products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Product } from "@/types/product";
import { Store } from "@/types/store";

export async function getDbStoreBySlug(slug: string) {
    try {
        const result = await db
            .select()
            .from(stores)
            .where(and(eq(stores.slug, slug), eq(stores.isPublished, true)))
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
        console.error("Error fetching store:", error);
        return null;
    }
}

export async function getDbProductsByStoreId(storeId: string) {
    try {
        const result = await db
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
            .where(
                and(
                    eq(products.storeId, parseInt(storeId)),
                    eq(products.isActive, true)
                )
            )
            .orderBy((p) => p.createdAt);

        return result.map(
            (product) =>
                ({
                    id: String(product.id),
                    storeId: String(product.storeId),
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    offerPrice: product.offerPrice,
                    imageUrl: product.imageUrl,
                    categoryName: product.categoryName,
                    isActive: product.isActive,
                }) as Product
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getDbPublishedStores(): Promise<Store[]> {
    try {
        const result = await db
            .select()
            .from(stores)
            .where(eq(stores.isPublished, true))
            .orderBy((s) => s.createdAt)
            .limit(20);

        return result.map(
            (store) =>
                ({
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
                }) as Store
        );
    } catch (error) {
        console.error("Error fetching published stores:", error);
        return [];
    }
}

export async function getDbProductByIdAndStoreId(
    productId: string,
    storeId: string
): Promise<Product | null> {
    try {
        const result = await db
            .select()
            .from(products)
            .where(
                and(
                    eq(products.id, parseInt(productId)),
                    eq(products.storeId, parseInt(storeId)),
                    eq(products.isActive, true)
                )
            )
            .limit(1);

        if (!result.length) {
            return null;
        }

        const product = result[0];
        let categoryName: string | null = null;
        if (product.categoryId) {
            const [cat] = await db
                .select()
                .from(categories)
                .where(eq(categories.id, product.categoryId))
                .limit(1);
            categoryName = cat?.name ?? null;
        }

        return {
            id: String(product.id),
            storeId: String(product.storeId),
            name: product.name,
            description: product.description,
            price: product.price,
            offerPrice: product.offerPrice,
            imageUrl: product.imageUrl,
            categoryName,
            isActive: product.isActive,
        } as Product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
