import { notFound } from "next/navigation";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import { getDbProductsByStoreId, getDbStoreBySlug } from "@/lib/storefrontData";

type StorePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function StorePage({ params }: StorePageProps) {
    const { slug } = await params;

    const store = await getDbStoreBySlug(slug);

    if (!store) {
        notFound();
    }

    const products = await getDbProductsByStoreId(store.id);

    if (store.template === "modern") {
        return <ModernTemplate store={store} products={products} />;
    }

    if (store.template === "minimal") {
        return <MinimalTemplate store={store} products={products} />;
    }

    return <ClassicTemplate store={store} products={products} />;
}
