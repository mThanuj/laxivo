export type StoreTemplate = "classic" | "modern" | "minimal";

export type Store = {
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    template: StoreTemplate;
    themeColor: string;
    isPublished: boolean;
};
