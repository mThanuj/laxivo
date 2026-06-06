import { TemplateComponent } from "@/types/template";
import fs from "fs";
import path from "path";
import {
    TEMPLATE_MANIFEST,
    getAllManifestKeys,
    isValidManifestKey,
    getManifestEntry,
    type TemplateManifestEntry,
} from "@/data/templates/template-manifest";

export type TemplateOption = {
    id: string;
    key: string;
    name: string;
    description: string;
    bestFor: string;
    previewStoreSlug: string;
};

export type TemplateMetadata = {
    name: string;
    description: string;
    bestFor: string;
    previewStoreSlug: string;
};

export type TemplateRegistry = {
    key: string;
    name: string;
    component: TemplateComponent;
    description: string;
    bestFor: string;
    previewStoreSlug: string;
};

export function discoverTemplateFiles(): { filename: string; key: string }[] {
    const templatesDir = path.join(
        process.cwd(),
        "src",
        "components",
        "templates"
    );

    try {
        const files = fs
            .readdirSync(templatesDir)
            .filter((file) => file.endsWith(".tsx"));

        return files
            .map((file) => {
                const componentName = file.replace(".tsx", "");
                const manifestEntry = TEMPLATE_MANIFEST.find(
                    (t) => t.filename === componentName
                );
                if (manifestEntry) {
                    return { filename: file, key: manifestEntry.key };
                }
                return null;
            })
            .filter((item) => item !== null) as {
            filename: string;
            key: string;
        }[];
    } catch (error) {
        console.error("Failed to discover template files:", error);
        return [];
    }
}

export function getAllTemplateKeys(): string[] {
    return getAllManifestKeys();
}

export function isValidTemplate(key: unknown): key is string {
    return isValidManifestKey(key);
}

export function getTemplateMetadata(key: string): TemplateMetadata | null {
    const entry = getManifestEntry(key);
    if (!entry) return null;
    return {
        name: entry.name,
        description: entry.description,
        bestFor: entry.bestFor,
        previewStoreSlug: entry.previewStoreSlug,
    };
}

export function generateTemplateOptions(): TemplateOption[] {
    return TEMPLATE_MANIFEST.map(
        (entry: TemplateManifestEntry, index: number) => ({
            id: `template_${String(index + 1).padStart(3, "0")}`,
            key: entry.key,
            name: entry.name,
            description: entry.description,
            bestFor: entry.bestFor,
            previewStoreSlug: entry.previewStoreSlug,
        })
    );
}
