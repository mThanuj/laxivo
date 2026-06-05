import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { StoreModel } from "@/models/Store";
import { UserModel } from "@/models/User";
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

export async function getOwnerDashboardData(ownerId: string) {
    await connectDb();

    if (!mongoose.isValidObjectId(ownerId)) {
        return null;
    }

    const store = await StoreModel.findOne({
        ownerId,
    }).lean<StoreLeanDocument | null>();

    if (!store) {
        return null;
    }

    const products = await ProductModel.find({
        storeId: store._id,
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean<ProductLeanDocument[]>();

    const totalProducts = await ProductModel.countDocuments({
        storeId: store._id,
    });

    const activeProducts = await ProductModel.countDocuments({
        storeId: store._id,
        isActive: true,
    });

    return {
        store: mapStoreFromDb(store),
        recentProducts: products.map(mapProductFromDb),
        totalProducts,
        activeProducts,
    };
}

export async function getOwnerStore(ownerId: string) {
    await connectDb();

    if (!mongoose.isValidObjectId(ownerId)) {
        return null;
    }

    const store = await StoreModel.findOne({
        ownerId,
    }).lean<StoreLeanDocument | null>();

    if (!store) {
        return null;
    }

    return mapStoreFromDb(store);
}

export async function getOwnerProductsData(ownerId: string) {
    await connectDb();

    if (!mongoose.isValidObjectId(ownerId)) {
        return null;
    }

    const store = await StoreModel.findOne({
        ownerId,
    }).lean<StoreLeanDocument | null>();

    if (!store) {
        return null;
    }

    const products = await ProductModel.find({
        storeId: store._id,
    })
        .sort({ createdAt: -1 })
        .lean<ProductLeanDocument[]>();

    return {
        store: mapStoreFromDb(store),
        products: products.map(mapProductFromDb),
    };
}
