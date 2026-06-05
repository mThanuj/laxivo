import { StoreTemplate } from "@/types/store";

export type TemplateOption = {
    id: string;
    name: string;
    key: StoreTemplate;
    description: string;
    bestFor: string;
    previewStoreSlug: string;
};

export const mockTemplates: TemplateOption[] = [
    {
        id: "template_001",
        name: "Classic",
        key: "classic",
        description:
            "A clean storefront layout with a large banner, product grid, and store details sidebar.",
        bestFor: "Bakeries, grocery stores, local food businesses",
        previewStoreSlug: "green-bakery",
    },
    {
        id: "template_002",
        name: "Modern",
        key: "modern",
        description:
            "A bold dark-themed layout with large visuals and premium product cards.",
        bestFor: "Fashion, lifestyle, streetwear, premium brands",
        previewStoreSlug: "urban-threads",
    },
    {
        id: "template_003",
        name: "Minimal",
        key: "minimal",
        description:
            "A simple elegant layout focused on readability, brand story, and clean product presentation.",
        bestFor: "Flowers, gifts, handmade products, boutique stores",
        previewStoreSlug: "bloom-flowers",
    },
];
