"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";
import { useProductFilters, SortOption } from "@/hooks/useProductFilters";

export default function VintageTemplate({
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
        <main className="min-h-screen bg-[#f2eadc] font-serif text-[#2c1810]">
            <div className="border-b-2 border-[#2c1810]/20 bg-[#2c1810] py-3 text-center font-sans text-[10px] uppercase tracking-[0.5em] text-[#d4a373]">
                ✦ Established ✦ Quality ✦ Heritage ✦
            </div>

            <section className="mx-auto max-w-6xl px-6 py-14">
                <div className="border-[3px] border-[#2c1810] bg-[#faf5eb] p-1 shadow-[8px_8px_0_0_#d4a373]">
                    <div className="border border-[#2c1810]/20 bg-[#e8dccc] p-1">
                        <div className="relative h-56 w-full overflow-hidden md:h-72">
                            <Image
                                src={store.bannerUrl}
                                alt={`${store.name} banner`}
                                fill
                                priority
                                className="object-cover sepia"
                            />
                            <div className="absolute inset-0 bg-[#2c1810]/20" />
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-10 max-w-2xl text-center">
                    <div className="flex items-center gap-4">
                        <span className="block h-px flex-1 bg-[#d4a373]" />
                        <span className="block h-2 w-2 rotate-45 border border-[#d4a373]" />
                        <span className="block h-px flex-1 bg-[#d4a373]" />
                    </div>

                    <div className="relative mx-auto my-2 h-20 w-20 overflow-hidden rounded-full border-2 border-[#d4a373] bg-[#faf5eb] p-1 shadow-[0_0_0_4px_#d4a373/30]">
                        <Image
                            src={store.logoUrl}
                            alt={`${store.name} logo`}
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>

                    <h1 className="mt-4 text-5xl font-bold italic tracking-tight md:text-6xl">
                        {store.name}
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5c4033] italic">
                        {store.description}
                    </p>
                    <p className="mt-3 text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                        {store.location}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                        <span className="block h-px flex-1 bg-[#d4a373]" />
                        <span className="block h-2 w-2 rotate-45 border border-[#d4a373]" />
                        <span className="block h-px flex-1 bg-[#d4a373]" />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-16">
                <div className="mb-10 text-center">
                    <h2 className="inline-block border-b-2 border-[#d4a373] pb-2 font-sans text-xs font-bold uppercase tracking-[0.4em] text-[#2c1810]">
                        ✦ Our Provisions ✦
                    </h2>
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
                                className={`border-2 px-4 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                                    (cat === "all" &&
                                        selectedCategory === "all") ||
                                    selectedCategory === cat
                                        ? "border-[#2c1810] bg-[#2c1810] text-[#f2eadc]"
                                        : "border-[#d4a373]/50 text-[#5c4033] hover:border-[#d4a373]"
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
                        className="border-2 border-[#d4a373]/50 bg-[#faf5eb] px-4 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c4033]"
                    >
                        <option value="default">Default</option>
                        <option value="price-low">Price ↑</option>
                        <option value="price-high">Price ↓</option>
                    </select>
                </div>

                {products.length === 0 ? (
                    <div className="border-2 border-dashed border-[#d4a373]/50 bg-[#faf5eb] p-14 text-center">
                        <p className="text-3xl">📜</p>
                        <h3 className="mt-3 text-lg font-bold italic">
                            The shelves are bare
                        </h3>
                        <p className="mt-2 text-sm italic text-[#5c4033]">
                            Come back soon — we are restocking our finest goods.
                        </p>
                    </div>
                ) : groupedProducts.length === 0 ? (
                    <div className="border-2 border-dashed border-[#d4a373]/50 bg-[#faf5eb] p-14 text-center">
                        <p className="text-3xl">📜</p>
                        <h3 className="mt-3 text-lg font-bold italic">
                            Nothing found
                        </h3>
                        <p className="mt-2 text-sm italic text-[#5c4033]">
                            Try a different category.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {groupedProducts.map((group) => (
                            <div key={group.category}>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="h-px flex-1 bg-[#d4a373]/30" />
                                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                                        ── {group.category} ──
                                    </h3>
                                    <span className="h-px flex-1 bg-[#d4a373]/30" />
                                </div>
                                <div className="space-y-8">
                                    {group.products.map((product, index) => (
                                        <article
                                            key={product.id}
                                            className="group border-2 border-[#2c1810]/20 bg-[#faf5eb] p-4 transition hover:border-[#d4a373] hover:shadow-[6px_6px_0_0_#d4a373] md:p-6"
                                        >
                                            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                                                <div className="relative">
                                                    <div className="border border-[#2c1810]/30 bg-[#e8dccc] p-1">
                                                        <div className="relative h-44 w-full overflow-hidden md:h-40">
                                                            <Image
                                                                src={
                                                                    product.imageUrl
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                fill
                                                                className="object-cover sepia transition duration-500 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-[#2c1810]/10" />
                                                        </div>
                                                    </div>
                                                    <span className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center border border-[#d4a373] bg-[#2c1810] font-sans text-xs font-bold text-[#d4a373]">
                                                        {String(
                                                            index + 1
                                                        ).padStart(2, "0")}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                                                            {product.categoryName ??
                                                                "General"}
                                                        </span>
                                                        {product.offerPrice && (
                                                            <span className="rounded bg-red-700/20 px-2 py-0.5 font-sans text-[10px] font-bold text-red-700">
                                                                -
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

                                                    <h3 className="mt-2 text-2xl font-bold italic">
                                                        {product.name}
                                                    </h3>

                                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5c4033]">
                                                        {product.description}
                                                    </p>

                                                    <div className="my-4 h-px bg-gradient-to-r from-[#d4a373] via-transparent to-[#d4a373]" />

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#5c4033]">
                                                                Price
                                                            </p>
                                                            {product.offerPrice ? (
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-2xl font-bold text-[#2c1810]">
                                                                        ₹
                                                                        {
                                                                            product.offerPrice
                                                                        }
                                                                    </p>
                                                                    <p className="font-sans text-sm text-[#5c4033] line-through">
                                                                        ₹
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-2xl font-bold text-[#2c1810]">
                                                                    ₹
                                                                    {
                                                                        product.price
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/stores/${store.slug}/products/${product.id}`}
                                                            className="border-2 border-[#2c1810] bg-[#2c1810] px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#faf5eb] transition hover:bg-transparent hover:text-[#2c1810]"
                                                        >
                                                            Purchase
                                                        </Link>
                                                    </div>
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

            <footer className="border-t-2 border-[#2c1810] bg-[#2c1810]">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
                        <div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#d4a373]">
                                Visit Us
                            </p>
                            <p className="mt-2 text-sm italic text-[#d4a373]/70">
                                {store.location}
                            </p>
                        </div>
                        <div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#d4a373]">
                                Contact
                            </p>
                            <div className="mt-2 space-y-1 text-sm italic text-[#d4a373]/70">
                                <p>{store.contactEmail}</p>
                                <p>{store.contactPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-end">
                            <a
                                href={`https://wa.me/${store.contactPhone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-[#d4a373] bg-transparent px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#d4a373] transition hover:bg-[#d4a373] hover:text-[#2c1810]"
                            >
                                Send Inquiry
                            </a>
                        </div>
                    </div>
                    <div className="mx-auto mt-8 h-px max-w-md bg-[#d4a373]/30" />
                    <p className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.3em] text-[#d4a373]/50">
                        {store.name} · Est. 2024 · All rights reserved
                    </p>
                </div>
            </footer>
        </main>
    );
}
