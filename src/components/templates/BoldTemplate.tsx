"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";
import { useProductFilters, SortOption } from "@/hooks/useProductFilters";

export default function BoldTemplate({ store, products }: StoreTemplateProps) {
    const accent = store.themeColor || "#ff4500";

    const {
        sortBy,
        setSortBy,
        selectedCategory,
        setSelectedCategory,
        categories,
        groupedProducts,
    } = useProductFilters(products);

    return (
        <main className="min-h-screen bg-[#0f0f0f] text-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black">
                <div
                    className="absolute -right-32 top-0 h-[150%] w-[60%] -skew-x-12"
                    style={{ backgroundColor: accent }}
                />
                <div className="absolute -right-32 top-0 h-[150%] w-[55%] -skew-x-12 bg-black/30" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:py-24">
                    <div className="z-10">
                        <span
                            className="inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                            style={{ backgroundColor: accent }}
                        >
                            ⚡ {store.location}
                        </span>
                        <h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
                            {store.name}
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
                            {store.description}
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <a
                                href="#products"
                                className="flex items-center gap-3 bg-white px-8 py-3.5 text-sm font-black uppercase tracking-wider text-[#0f0f0f] transition hover:bg-gray-200"
                                style={{ boxShadow: `6px 6px 0 0 ${accent}` }}
                            >
                                <span>Shop Now</span>
                                <span className="text-lg">→</span>
                            </a>
                            <a
                                href={`tel:${store.contactPhone}`}
                                className="flex items-center gap-3 border-2 border-white/20 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-[#0f0f0f]"
                            >
                                <span>Call</span>
                            </a>
                        </div>
                    </div>

                    <div className="relative z-10 lg:pl-8">
                        <div
                            className="relative overflow-hidden border-2 border-white/10 shadow-[12px_12px_0_0_white] transition hover:shadow-[12px_12px_0_0_var(--accent-color)]"
                            style={
                                {
                                    "--accent-color": accent,
                                } as React.CSSProperties
                            }
                        >
                            <div className="relative h-72 w-full md:h-96">
                                <Image
                                    src={store.bannerUrl}
                                    alt={store.name}
                                    fill
                                    priority
                                    className="object-cover grayscale transition duration-500 hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                            <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded bg-black/80 px-4 py-2 backdrop-blur-sm">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/30">
                                    <Image
                                        src={store.logoUrl}
                                        alt={store.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wide">
                                        {store.name}
                                    </p>
                                    <p className="text-[10px] text-white/50">
                                        {products.length} Products
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="products" className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-12 flex items-center gap-6">
                    <div className="h-1 flex-1 bg-white/10" />
                    <h2 className="flex items-center gap-4 text-3xl font-black uppercase tracking-tight">
                        <span
                            className="inline-block h-4 w-4"
                            style={{ backgroundColor: accent }}
                        />
                        Products
                        <span
                            className="inline-block h-4 w-4"
                            style={{ backgroundColor: accent }}
                        />
                    </h2>
                    <div className="h-1 flex-1 bg-white/10" />
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
                                className={`border-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition ${
                                    (cat === "all" &&
                                        selectedCategory === "all") ||
                                    selectedCategory === cat
                                        ? "border-white bg-white text-[#0f0f0f]"
                                        : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                                }`}
                            >
                                {cat === "all" ? "ALL" : cat}
                            </button>
                        ))}
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                        }
                        className="border-2 border-white/20 bg-transparent px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/50"
                    >
                        <option value="default">DEFAULT</option>
                        <option value="price-low">PRICE ↑</option>
                        <option value="price-high">PRICE ↓</option>
                    </select>
                </div>

                {products.length === 0 ? (
                    <div className="border-2 border-dashed border-white/10 p-16 text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-white/30">
                            No products yet
                        </p>
                    </div>
                ) : groupedProducts.length === 0 ? (
                    <div className="border-2 border-dashed border-white/10 p-16 text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-white/30">
                            No products match this filter
                        </p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {groupedProducts.map((group) => (
                            <div key={group.category}>
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="h-1 flex-1 bg-white/10" />
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">
                                        <span
                                            className="inline-block"
                                            style={{ color: accent }}
                                        >
                                            ◆{" "}
                                        </span>
                                        {group.category}
                                    </h3>
                                    <div className="h-1 flex-1 bg-white/10" />
                                </div>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {group.products.map((product, i) => (
                                        <article
                                            key={product.id}
                                            className="group relative border-2 border-white/10 bg-[#1a1a1a] transition hover:-translate-y-2"
                                            style={{
                                                boxShadow:
                                                    i % 3 === 0
                                                        ? `8px 8px 0 0 ${accent}`
                                                        : i % 3 === 1
                                                          ? `-8px 8px 0 0 white`
                                                          : `8px -8px 0 0 ${accent}`,
                                            }}
                                        >
                                            <div
                                                className="absolute right-0 top-0 h-12 w-12"
                                                style={{
                                                    background: `linear-gradient(135deg, transparent 50%, ${accent} 50%)`,
                                                }}
                                            />

                                            <div className="relative h-52 w-full overflow-hidden bg-[#2a2a2a]">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                                <span
                                                    className="absolute bottom-3 left-3 rounded px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                                                    style={{
                                                        backgroundColor: accent,
                                                        color: "#fff",
                                                    }}
                                                >
                                                    {product.categoryName ??
                                                        "Featured"}
                                                </span>
                                                {product.offerPrice && (
                                                    <span className="absolute right-3 top-3 rounded bg-black/80 px-3 py-1 text-[10px] font-black text-white backdrop-blur-sm">
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

                                            <div className="p-6">
                                                <h3 className="text-lg font-black uppercase tracking-tight">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/40">
                                                    {product.description}
                                                </p>

                                                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                                                    <div>
                                                        {product.offerPrice ? (
                                                            <div className="flex items-center gap-2">
                                                                <p
                                                                    className="text-2xl font-black"
                                                                    style={{
                                                                        color: accent,
                                                                    }}
                                                                >
                                                                    ₹
                                                                    {
                                                                        product.offerPrice
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-white/20 line-through">
                                                                    ₹
                                                                    {
                                                                        product.price
                                                                    }
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p
                                                                className="text-2xl font-black"
                                                                style={{
                                                                    color: accent,
                                                                }}
                                                            >
                                                                ₹{product.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Link
                                                        href={`/stores/${store.slug}/products/${product.id}`}
                                                        className="bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#0f0f0f] transition hover:bg-gray-200"
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
            </section>

            <section
                className="relative overflow-hidden py-16"
                style={{ backgroundColor: accent }}
            >
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
                <div className="relative mx-auto max-w-4xl px-6 text-center">
                    <h2 className="text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl">
                        Ready to Order?
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
                        Get in touch with us on WhatsApp for quick ordering.
                    </p>
                    <a
                        href={`https://wa.me/${store.contactPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-flex items-center gap-3 bg-black px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:scale-105"
                    >
                        <span>Message on WhatsApp</span>
                        <span className="text-lg">⚡</span>
                    </a>
                </div>
            </section>

            <footer className="border-t border-white/5 bg-[#1a1a1a] py-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div className="flex items-center gap-4 text-sm text-white/40">
                        <span className="font-black uppercase tracking-wider">
                            {store.name}
                        </span>
                        <span className="h-4 w-px bg-white/10" />
                        <span>{store.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <a
                            href={`mailto:${store.contactEmail}`}
                            className="text-white/40 transition hover:text-white"
                        >
                            {store.contactEmail}
                        </a>
                        <a
                            href={`tel:${store.contactPhone}`}
                            className="text-white/40 transition hover:text-white"
                        >
                            {store.contactPhone}
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
