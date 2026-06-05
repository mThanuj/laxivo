import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getDbProductByIdAndStoreId,
    getDbStoreBySlug,
} from "@/lib/storefrontData";

type ProductPageProps = {
    params: Promise<{
        slug: string;
        productId: string;
    }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug, productId } = await params;

    const store = await getDbStoreBySlug(slug);

    if (!store) {
        notFound();
    }

    const product = await getDbProductByIdAndStoreId(productId, store.id);

    if (!product) {
        notFound();
    }

    const whatsappMessage = `Hi, I am interested in ${product.name} from ${store.name}`;

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <Link
                        href={`/stores/${store.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        ← Back to {store.name}
                    </Link>

                    <p className="text-sm font-semibold text-gray-900">
                        {store.name}
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-2">
                <div className="relative h-[420px] overflow-hidden rounded-3xl bg-gray-100 shadow-sm ring-1 ring-gray-200">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
                        {product.category}
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-3xl font-bold text-gray-900">
                        ₹{product.price}
                    </p>

                    <p className="mt-6 text-base leading-7 text-gray-600">
                        {product.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={`https://wa.me/${store.contactPhone.replace(
                                /\D/g,
                                ""
                            )}?text=${encodeURIComponent(whatsappMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
                        >
                            Enquire on WhatsApp
                        </a>

                        <a
                            href={`tel:${store.contactPhone}`}
                            className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-white"
                        >
                            Call Store
                        </a>
                    </div>

                    <div className="mt-10 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">
                            Sold by
                        </h2>

                        <div className="mt-3 text-sm text-gray-600">
                            <p className="font-semibold text-gray-900">
                                {store.name}
                            </p>
                            <p className="mt-1">{store.location}</p>
                            <p className="mt-1">{store.contactEmail}</p>
                            <p className="mt-1">{store.contactPhone}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
