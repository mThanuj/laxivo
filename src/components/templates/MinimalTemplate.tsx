import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";

export default function MinimalTemplate({
    store,
    products,
}: StoreTemplateProps) {
    return (
        <main className="min-h-screen bg-white text-gray-950">
            <header className="border-b">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">
                            Minimal Store
                        </p>
                        <h1 className="mt-1 text-2xl font-bold">
                            {store.name}
                        </h1>
                    </div>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-600 hover:text-gray-950"
                    >
                        Back to platform
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
                    <div>
                        <div className="relative h-72 overflow-hidden rounded-3xl bg-gray-100">
                            <Image
                                src={store.logoUrl}
                                alt={store.name}
                                fill
                                className="object-cover"
                                sizes="360px"
                                priority
                            />
                        </div>

                        <h2 className="mt-6 text-4xl font-bold tracking-tight">
                            {store.name}
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            {store.description}
                        </p>

                        <div className="mt-6 space-y-2 text-sm text-gray-600">
                            <p>{store.location}</p>
                            <a
                                href={`mailto:${store.contactEmail}`}
                                className="block"
                            >
                                {store.contactEmail}
                            </a>
                            <a
                                href={`tel:${store.contactPhone}`}
                                className="block"
                            >
                                {store.contactPhone}
                            </a>
                        </div>

                        <a
                            href={`https://wa.me/${store.contactPhone.replace(
                                /\D/g,
                                ""
                            )}?text=${encodeURIComponent(
                                `Hi, I am interested in products from ${store.name}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-block rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700"
                        >
                            Contact on WhatsApp
                        </a>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">Products</h2>

                        <div className="mt-6 divide-y">
                            {products.map((product) => (
                                <article
                                    key={product.id}
                                    className="grid gap-5 py-6 sm:grid-cols-[160px_1fr]"
                                >
                                    <div className="relative h-40 overflow-hidden rounded-2xl bg-gray-100">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="160px"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                                            {product.category}
                                        </p>

                                        <h3 className="mt-2 text-xl font-bold">
                                            {product.name}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                                            {product.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-lg font-bold">
                                                ₹{product.price}
                                            </p>

                                            <Link
                                                href={`/stores/${store.slug}/products/${product.id}`}
                                                className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                                            >
                                                View details →
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
