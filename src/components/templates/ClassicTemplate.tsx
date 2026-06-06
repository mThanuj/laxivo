"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";
import { useProductFilters, SortOption } from "@/hooks/useProductFilters";

export default function ClassicTemplate({
    store,
    products,
}: StoreTemplateProps) {
    const {
        sortBy,
        setSortBy,
        selectedCategory,
        setSelectedCategory,
        categories,
        groupedProducts,
    } = useProductFilters(products);

    return (
        <main className="min-h-screen bg-[#f8f6f1] text-[#1e1b2c]">
            <header className="bg-[#1e1b2c] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a853]">
                        Est. 2024 · Premium Store
                    </span>
                    <Link
                        href="/"
                        className="rounded border border-[#d4a853]/50 px-4 py-1.5 text-xs font-semibold text-[#d4a853] hover:bg-[#d4a853] hover:text-[#1e1b2c] transition"
                    >
                        Back to platform
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 pt-12">
                <div className="relative rounded-none border-2 border-[#d4a853] shadow-[6px_6px_0_0_#d4a853]">
                    <div className="absolute -top-[1px] left-8 right-8 h-[3px] bg-gradient-to-r from-transparent via-[#d4a853] to-transparent" />

                    <div className="relative h-72 w-full overflow-hidden bg-[#1e1b2c] md:h-96">
                        <Image
                            src={store.bannerUrl}
                            alt={`${store.name} banner`}
                            fill
                            priority
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b2c]/80 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                            <div className="flex items-end gap-6">
                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-none border-2 border-[#d4a853] bg-white shadow-[4px_4px_0_0_#d4a853]">
                                    <Image
                                        src={store.logoUrl}
                                        alt={`${store.name} logo`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-white">
                                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                                        {store.name}
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm text-gray-300">
                                        {store.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_300px]">
                <div>
                    <div className="mb-8 flex items-center gap-4">
                        <span className="h-px flex-1 bg-[#d4a853]/40" />
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-[#1e1b2c]">
                            Collection
                        </h2>
                        <span className="h-px flex-1 bg-[#d4a853]/40" />
                    </div>

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`rounded border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                                    selectedCategory === "all"
                                        ? "border-[#d4a853] bg-[#d4a853] text-[#1e1b2c]"
                                        : "border-[#1e1b2c]/20 text-[#1e1b2c]/60 hover:border-[#d4a853] hover:text-[#1e1b2c]"
                                }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`rounded border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                                        selectedCategory === cat
                                            ? "border-[#d4a853] bg-[#d4a853] text-[#1e1b2c]"
                                            : "border-[#1e1b2c]/20 text-[#1e1b2c]/60 hover:border-[#d4a853] hover:text-[#1e1b2c]"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value as SortOption)
                            }
                            className="rounded border border-[#1e1b2c]/20 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1e1b2c]/70"
                        >
                            <option value="default">Default order</option>
                            <option value="price-low">Price: Low → High</option>
                            <option value="price-high">
                                Price: High → Low
                            </option>
                        </select>
                    </div>

                    {products.length === 0 ? (
                        <div className="border-2 border-dashed border-[#1e1b2c]/20 p-12 text-center">
                            <h3 className="text-lg font-bold">
                                No products available
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                This store has not added products yet.
                            </p>
                        </div>
                    ) : groupedProducts.length === 0 ? (
                        <div className="border-2 border-dashed border-[#1e1b2c]/20 p-12 text-center">
                            <h3 className="text-lg font-bold">
                                No products match this filter
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Try a different category.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {groupedProducts.map((group) => (
                                <div key={group.category}>
                                    <div className="mb-5 flex items-center gap-3">
                                        <span className="h-px flex-1 bg-[#d4a853]/30" />
                                        <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-[#1e1b2c]/70">
                                            {group.category}
                                        </h3>
                                        <span className="h-px flex-1 bg-[#d4a853]/30" />
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                        {group.products.map((product) => (
                                            <article
                                                key={product.id}
                                                className="group border-2 border-[#1e1b2c] bg-white transition hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#d4a853]"
                                            >
                                                <div className="relative h-52 w-full overflow-hidden bg-[#1e1b2c]">
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                    <span className="absolute right-3 top-3 bg-[#d4a853] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1e1b2c]">
                                                        {product.categoryName}
                                                    </span>
                                                    {product.offerPrice && (
                                                        <span className="absolute left-3 top-3 bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                                                            {Math.round(
                                                                ((product.price -
                                                                    product.offerPrice) /
                                                                    product.price) *
                                                                    100
                                                            )}
                                                            % OFF
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold tracking-tight">
                                                        {product.name}
                                                    </h3>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                                                        {product.description}
                                                    </p>

                                                    <div className="mt-5 flex items-center justify-between border-t border-[#1e1b2c]/10 pt-4">
                                                        <div>
                                                            {product.offerPrice ? (
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-xl font-bold tracking-tight text-[#d4a853]">
                                                                        ₹
                                                                        {
                                                                            product.offerPrice
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-400 line-through">
                                                                        ₹
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xl font-bold tracking-tight text-[#d4a853]">
                                                                    ₹
                                                                    {
                                                                        product.price
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/stores/${store.slug}/products/${product.id}`}
                                                            className="border-2 border-[#1e1b2c] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#1e1b2c] transition hover:bg-[#1e1b2c] hover:text-white"
                                                        >
                                                            View
                                                        </Link>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-fit border-2 border-[#1e1b2c] bg-white p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="h-px flex-1 bg-[#d4a853]/60" />
                        <h2 className="text-base font-bold uppercase tracking-wider text-[#1e1b2c]">
                            Details
                        </h2>
                        <span className="h-px flex-1 bg-[#d4a853]/60" />
                    </div>

                    <div className="space-y-5 text-sm">
                        <div className="border-b border-[#1e1b2c]/10 pb-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a853]">
                                Location
                            </p>
                            <p className="mt-1 font-semibold">
                                {store.location}
                            </p>
                        </div>
                        <div className="border-b border-[#1e1b2c]/10 pb-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a853]">
                                Email
                            </p>
                            <a
                                href={`mailto:${store.contactEmail}`}
                                className="mt-1 block font-semibold text-[#1e1b2c] hover:text-[#d4a853] transition"
                            >
                                {store.contactEmail}
                            </a>
                        </div>
                        <div className="pb-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a853]">
                                Phone
                            </p>
                            <a
                                href={`tel:${store.contactPhone}`}
                                className="mt-1 block font-semibold text-[#1e1b2c] hover:text-[#d4a853] transition"
                            >
                                {store.contactPhone}
                            </a>
                        </div>
                    </div>

                    <a
                        href={`https://wa.me/${store.contactPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 block border-2 border-[#1e1b2c] bg-[#1e1b2c] px-5 py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#d4a853] hover:text-[#1e1b2c]"
                    >
                        Contact on WhatsApp
                    </a>
                </div>
            </section>

            <footer className="mt-8 border-t-4 border-double border-[#d4a853] bg-[#1e1b2c] py-6 text-center text-sm text-gray-400">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d4a853]">
                    {store.name} · {store.location}
                </p>
            </footer>
        </main>
    );
}
