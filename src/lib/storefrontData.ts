import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { StoreModel } from "@/models/Store";
import { Product } from "@/types/product";
import { Store } from "@/types/store";

type StoreLeanDocument = {
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
    template: Store["template"];
    themeColor: string;
    isPublished: boolean;
};

type ProductLeanDocument = {
    _id: mongoose.Types.ObjectId;
    storeId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    isActive: boolean;
};

function mapStoreFromDb(store: StoreLeanDocument): Store {
    return {
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
    };
}

function mapProductFromDb(product: ProductLeanDocument): Product {
    return {
        id: product._id.toString(),
        storeId: product.storeId.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        isActive: product.isActive,
    };
}

export async function getDbStoreBySlug(slug: string) {
    await connectDb();

    const store = await StoreModel.findOne({
        slug,
        isPublished: true,
    }).lean<StoreLeanDocument | null>();

    if (!store) {
        return null;
    }

    return mapStoreFromDb(store);
}

export async function getDbProductsByStoreId(storeId: string) {
    await connectDb();

    const products = await ProductModel.find({
        storeId,
        isActive: true,
    })
        .sort({ createdAt: -1 })
        .lean<ProductLeanDocument[]>();

    return products.map(mapProductFromDb);
}

export async function getDbProductByIdAndStoreId(
    productId: string,
    storeId: string
) {
    await connectDb();

    if (!mongoose.isValidObjectId(productId)) {
        return null;
    }

    const product = await ProductModel.findOne({
        _id: productId,
        storeId,
        isActive: true,
    }).lean<ProductLeanDocument | null>();

    if (!product) {
        return null;
    }

    return mapProductFromDb(product);
}

export async function getDbPublishedStores() {
    await connectDb();

    const stores = await StoreModel.find({
        isPublished: true,
    })
        .sort({ createdAt: -1 })
        .lean<StoreLeanDocument[]>();

    return stores.map(mapStoreFromDb);
}
