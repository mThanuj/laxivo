export interface TemplateManifestEntry {
    key: string;
    filename: string;
    name: string;
    description: string;
    bestFor: string;
    previewStoreSlug: string;
}

export const TEMPLATE_MANIFEST: TemplateManifestEntry[] = [
    {
        key: "classic",
        filename: "ClassicTemplate",
        name: "Classic",
        description:
            "A clean storefront layout with a large banner, product grid, and store details sidebar.",
        bestFor: "Bakeries, grocery stores, local food businesses",
        previewStoreSlug: "green-bakery",
    },
    {
        key: "modern",
        filename: "ModernTemplate",
        name: "Modern",
        description:
            "A bold dark-themed layout with large visuals and premium product cards.",
        bestFor: "Fashion, lifestyle, streetwear, premium brands",
        previewStoreSlug: "urban-threads",
    },
    {
        key: "minimal",
        filename: "MinimalTemplate",
        name: "Minimal",
        description:
            "A simple elegant layout focused on readability, brand story, and clean product presentation.",
        bestFor: "Flowers, gifts, handmade products, boutique stores",
        previewStoreSlug: "bloom-flowers",
    },
    {
        key: "vintage",
        filename: "VintageTemplate",
        name: "Vintage",
        description:
            "A warm artisan-themed layout with serif typography, masonry product grid, and earthy tones.",
        bestFor: "Cafés, handmade crafts, antique shops, organic food stores",
        previewStoreSlug: "rustic-mercantile",
    },
    {
        key: "bold",
        filename: "BoldTemplate",
        name: "Bold",
        description:
            "A vibrant modern layout with gradient hero, color-blocked product cards, and dynamic theme color accents.",
        bestFor:
            "Tech brands, sports gear, modern retail, energy-driven businesses",
        previewStoreSlug: "velocity-gear",
    },
    {
        key: "nature",
        filename: "NatureTemplate",
        name: "Nature",
        description:
            "An earthy organic layout with deep emerald tones, centered branding, and a warm natural feel.",
        bestFor:
            "Organic food, wellness products, eco-friendly brands, plant shops, spa & beauty",
        previewStoreSlug: "green-bakery",
    },
    {
        key: "luxe",
        filename: "LuxeTemplate",
        name: "Luxe",
        description:
            "An elegant luxury layout with split-screen hero, gold accents, thin typography, and refined spacing.",
        bestFor:
            "Jewelry, high-end fashion, premium gifts, luxury homeware, perfumes",
        previewStoreSlug: "bloom-flowers",
    },
    {
        key: "playful",
        filename: "PlayfulTemplate",
        name: "Playful",
        description:
            "A fun colorful layout with rounded shapes, gradient text, emoji accents, and a bouncy energetic feel.",
        bestFor:
            "Kids stores, candy shops, toy stores, fun brands, creative businesses",
        previewStoreSlug: "green-bakery",
    },
    {
        key: "industrial",
        filename: "IndustrialTemplate",
        name: "Industrial",
        description:
            "A raw industrial layout with grid patterns, uppercase typography, orange accents, and a no-nonsense aesthetic.",
        bestFor:
            "Hardware stores, auto parts, construction, mechanic shops, industrial supplies",
        previewStoreSlug: "velocity-gear",
    },
];

export type ManifestTemplateKey = (typeof TEMPLATE_MANIFEST)[number]["key"];

export function getAllManifestKeys(): string[] {
    return TEMPLATE_MANIFEST.map((t) => t.key);
}

export function isValidManifestKey(key: unknown): key is string {
    if (typeof key !== "string") return false;
    return TEMPLATE_MANIFEST.some((t) => t.key === key);
}

export function getManifestEntry(
    key: string
): TemplateManifestEntry | undefined {
    return TEMPLATE_MANIFEST.find((t) => t.key === key);
}
