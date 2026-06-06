import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/lib/templateLoader";
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

    const TemplateComponent = await getTemplateComponent(store.template);

    if (!TemplateComponent) {
        notFound();
    }

    return <TemplateComponent store={store} products={products} />;
}
