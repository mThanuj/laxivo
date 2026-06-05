import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";

export default function ModernTemplate({
    store,
    products,
}: StoreTemplateProps) {
    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_420px]">
                <div className="flex flex-col justify-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                        Modern Storefront
                    </p>

                    <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
                        {store.name}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                        {store.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-950">
                            {store.location}
                        </span>

                        <a
                            href={`tel:${store.contactPhone}`}
                            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white hover:text-neutral-950"
                        >
                            Call Store
                        </a>
                    </div>
                </div>

                <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-neutral-800">
                    <Image
                        src={store.bannerUrl}
                        alt={store.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 420px, 100vw"
                        priority
                    />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-16">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Featured Products
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Browse the latest collection from {store.name}
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-neutral-950"
                    >
                        Back to platform
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <article
                            key={product.id}
                            className="overflow-hidden rounded-[2rem] bg-white text-neutral-950"
                        >
                            <div className="relative h-64 bg-neutral-200">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                />
                            </div>

                            <div className="p-6">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    {product.category}
                                </p>

                                <h3 className="mt-2 text-xl font-bold">
                                    {product.name}
                                </h3>

                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                                    {product.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between">
                                    <p className="text-xl font-black">
                                        ₹{product.price}
                                    </p>

                                    <Link
                                        href={`/stores/${store.slug}/products/${product.id}`}
                                        className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
