"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";
import { useProductFilters, SortOption } from "@/hooks/useProductFilters";

export default function MinimalTemplate({
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
        <main className="min-h-screen bg-[#fdf8f4] text-[#2d1b14]">
            <div className="bg-[#2d1b14]">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
                    <span className="text-xs font-semibold tracking-wide text-[#f7b7a3]">
                        ✦ {store.name}
                    </span>
                    <Link
                        href="/"
                        className="rounded-full bg-[#f7b7a3]/20 px-4 py-1.5 text-xs font-medium text-[#f7b7a3] hover:bg-[#f7b7a3] hover:text-[#2d1b14] transition"
                    >
                        Back to platform
                    </Link>
                </div>
            </div>

            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-[#f7b7a3] bg-white shadow-[0_0_0_6px_#f7b7a3/30]">
                        <Image
                            src={store.logoUrl}
                            alt={`${store.name} logo`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="mt-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f7b7a3]">
                            {store.location}
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                            {store.name}
                        </h1>
                        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#5c4033]">
                            {store.description}
                        </p>
                    </div>
                </div>

                <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2.5rem] bg-[#edd7ce] p-3 shadow-inner">
                    <div className="relative h-48 w-full overflow-hidden rounded-[2rem] md:h-64">
                        <Image
                            src={store.bannerUrl}
                            alt={store.name}
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b14]/40 to-transparent" />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-20">
                <div className="mb-10 text-center">
                    <span className="inline-block rounded-full bg-[#f7b7a3]/15 px-5 py-1.5 text-xs font-semibold tracking-wide text-[#f7b7a3]">
                        ✦ Our Collection
                    </span>
                </div>

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {["all", ...categories].map((cat) => (
                            <button
                                key={cat}
                                onClick={() =>
                                    setSelectedCategory(
                                        cat === "all" ? "all" : cat
                                    )
                                }
                                className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold transition ${
                                    (cat === "all" &&
                                        selectedCategory === "all") ||
                                    selectedCategory === cat
                                        ? "border-[#f7b7a3] bg-[#f7b7a3] text-white"
                                        : "border-[#edd7ce] text-[#5c4033] hover:border-[#f7b7a3]"
                                }`}
                            >
                                {cat === "all" ? "All" : cat}
                            </button>
                        ))}
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                        }
                        className="rounded-full border border-[#edd7ce] bg-white px-4 py-1.5 text-[11px] font-semibold text-[#5c4033]"
                    >
                        <option value="default">Default</option>
                        <option value="price-low">Low to High</option>
                        <option value="price-high">High to Low</option>
                    </select>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-[2rem] border-2 border-dashed border-[#e0c4b8] p-16 text-center">
                        <span className="text-3xl">🌸</span>
                        <h3 className="mt-3 text-lg font-bold">
                            No products yet
                        </h3>
                        <p className="mt-2 text-sm text-[#5c4033]">
                            We are preparing something lovely for you.
                        </p>
                    </div>
                ) : groupedProducts.length === 0 ? (
                    <div className="rounded-[2rem] border-2 border-dashed border-[#e0c4b8] p-16 text-center">
                        <span className="text-3xl">🌸</span>
                        <h3 className="mt-3 text-lg font-bold">
                            No products match
                        </h3>
                        <p className="mt-2 text-sm text-[#5c4033]">
                            Try a different category.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {groupedProducts.map((group) => (
                            <div key={group.category}>
                                <div className="mb-5 flex items-center gap-3">
                                    <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-[#f7b7a3]">
                                        {group.category}
                                    </h3>
                                    <span className="h-px flex-1 bg-[#edd7ce]" />
                                </div>
                                <div className="space-y-6">
                                    {group.products.map((product) => (
                                        <article
                                            key={product.id}
                                            className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(45,27,20,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(247,183,163,0.2)] sm:flex-row"
                                        >
                                            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#edd7ce] sm:h-44 sm:w-48">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition duration-500 group-hover:scale-105"
                                                />
                                                <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2d1b14] backdrop-blur-sm">
                                                    {product.categoryName}
                                                </span>
                                                {product.offerPrice && (
                                                    <span className="absolute right-3 top-3 rounded-full bg-red-400/90 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                                                        -
                                                        {Math.round(
                                                            ((product.price -
                                                                product.offerPrice) /
                                                                product.price) *
                                                                100
                                                        )}
                                                        %
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col justify-center p-6">
                                                <h3 className="text-lg font-bold">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#5c4033]">
                                                    {product.description}
                                                </p>
                                                <div className="mt-4 flex items-center justify-between">
                                                    {product.offerPrice ? (
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xl font-bold text-[#f7b7a3]">
                                                                ₹
                                                                {
                                                                    product.offerPrice
                                                                }
                                                            </p>
                                                            <p className="text-sm text-[#5c4033]/40 line-through">
                                                                ₹{product.price}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xl font-bold text-[#f7b7a3]">
                                                            ₹{product.price}
                                                        </p>
                                                    )}
                                                    <Link
                                                        href={`/stores/${store.slug}/products/${product.id}`}
                                                        className="rounded-full bg-[#2d1b14] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#f7b7a3] hover:text-[#2d1b14]"
                                                    >
                                                        Add to cart
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
            </section>

            <footer className="border-t border-[#edd7ce] bg-white">
                <div className="mx-auto max-w-5xl px-6 py-10">
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                        <div>
                            <p className="text-sm font-semibold text-[#2d1b14]">
                                {store.name}
                            </p>
                            <p className="mt-1 text-xs text-[#5c4033]">
                                {store.location}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <a
                                href={`mailto:${store.contactEmail}`}
                                className="text-[#5c4033] hover:text-[#f7b7a3] transition"
                            >
                                {store.contactEmail}
                            </a>
                            <a
                                href={`tel:${store.contactPhone}`}
                                className="text-[#5c4033] hover:text-[#f7b7a3] transition"
                            >
                                {store.contactPhone}
                            </a>
                            <a
                                href={`https://wa.me/${store.contactPhone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#f7b7a3] px-4 py-2 font-semibold text-white hover:bg-[#e89a83] transition"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
