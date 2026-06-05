import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";

export default function ClassicTemplate({
    store,
    products,
}: StoreTemplateProps) {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative h-72 w-full overflow-hidden bg-gray-200">
                <Image
                    src={store.bannerUrl}
                    alt={`${store.name} banner`}
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-8">
                    <div className="flex items-end gap-5">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
                            <Image
                                src={store.logoUrl}
                                alt={`${store.name} logo`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="text-white">
                            <h1 className="text-4xl font-bold">{store.name}</h1>
                            <p className="mt-2 max-w-2xl text-sm text-gray-100">
                                {store.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_280px]">
                <div>
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Products
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Browse products from {store.name}
                            </p>
                        </div>

                        <Link
                            href="/"
                            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                        >
                            Back to platform
                        </Link>
                    </div>

                    {products.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No products available
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                This store has not added products yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <article
                                    key={product.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="relative h-48 w-full bg-gray-100">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="p-5">
                                        <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                                            {product.category}
                                        </p>

                                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                            {product.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{product.price}
                                            </p>

                                            <Link
                                                href={`/stores/${store.slug}/products/${product.id}`}
                                                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                        Store details
                    </h2>

                    <div className="mt-5 space-y-4 text-sm text-gray-600">
                        <div>
                            <p className="font-medium text-gray-900">
                                Location
                            </p>
                            <p>{store.location}</p>
                        </div>

                        <div>
                            <p className="font-medium text-gray-900">Email</p>
                            <a
                                href={`mailto:${store.contactEmail}`}
                                className="text-green-700 hover:underline"
                            >
                                {store.contactEmail}
                            </a>
                        </div>

                        <div>
                            <p className="font-medium text-gray-900">Phone</p>
                            <a
                                href={`tel:${store.contactPhone}`}
                                className="text-green-700 hover:underline"
                            >
                                {store.contactPhone}
                            </a>
                        </div>
                    </div>

                    <a
                        href={`https://wa.me/${store.contactPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 block rounded-full bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Contact on WhatsApp
                    </a>
                </aside>
            </section>
        </main>
    );
}
