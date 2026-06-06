export type Product = {
    id: string;
    storeId: string;
    name: string;
    description: string | null;
    price: number;
    offerPrice: number | null;
    imageUrl: string;
    categoryName: string | null;
    isActive: boolean;
};
