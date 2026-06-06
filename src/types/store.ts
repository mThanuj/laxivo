export type StoreTemplate = string;

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
    template: string;
    themeColor: string;
    isPublished: boolean;
};
