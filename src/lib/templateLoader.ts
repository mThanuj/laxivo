import {
    discoverTemplateFiles,
    getAllTemplateKeys,
    isValidTemplate,
    getTemplateMetadata,
    generateTemplateOptions,
    type TemplateOption,
    type TemplateMetadata,
} from "./dynamicTemplateLoader";
import { TemplateComponent } from "@/types/template";

const componentCache: Map<string, TemplateComponent> = new Map();

async function loadTemplateComponent(
    key: string
): Promise<TemplateComponent | null> {
    if (componentCache.has(key)) {
        return componentCache.get(key) || null;
    }

    const discovered = discoverTemplateFiles();
    const templateFile = discovered.find((t) => t.key === key);

    if (!templateFile) {
        return null;
    }

    try {
        const componentName = templateFile.filename.replace(".tsx", "");
        const mod = await import(`@/components/templates/${componentName}`);
        const component = mod.default as TemplateComponent;

        if (component) {
            componentCache.set(key, component);
            return component;
        }
    } catch (error) {
        console.error(`Failed to load template component: ${key}`, error);
    }

    return null;
}

export async function getAllTemplateOptions(): Promise<TemplateOption[]> {
    return generateTemplateOptions();
}

export async function getTemplateComponent(
    key: string
): Promise<TemplateComponent | null> {
    return loadTemplateComponent(key);
}

export function getAllTemplateKeysSync(): string[] {
    return getAllTemplateKeys();
}

export function getDiscoveredTemplateFiles() {
    return discoverTemplateFiles();
}

export function isValidTemplateSync(key: unknown): key is string {
    return isValidTemplate(key);
}

export function getTemplateMetadataSync(key: string): TemplateMetadata | null {
    return getTemplateMetadata(key);
}
