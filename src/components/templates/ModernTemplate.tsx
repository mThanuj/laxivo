"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreTemplateProps } from "@/types/template";
import { useProductFilters, SortOption } from "@/hooks/useProductFilters";

export default function ModernTemplate({
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
        <main className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <header className="relative z-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#00e5ff]">
                        ◇ Modern Boutique
                    </span>
                    <Link
                        href="/"
                        className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-mono font-semibold text-white/70 backdrop-blur-sm hover:bg-[#00e5ff] hover:text-[#0a0a1a] transition"
                    >
                        ← Platform
                    </Link>
                </div>
            </header>

            <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:pb-20">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-[#00e5ff]">
                            New Collection
                        </p>
                        <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
                            <span className="bg-gradient-to-r from-white via-white to-[#00e5ff]/40 bg-clip-text text-transparent">
                                {store.name}
                            </span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
                            {store.description}
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <a
                                href="#products"
                                className="inline-flex items-center gap-2 rounded-full bg-[#00e5ff] px-7 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#0a0a1a] transition hover:bg-[#00e5ff]/80"
                            >
                                <span>Explore Products</span>
                                <span className="text-sm">→</span>
                            </a>
                            <a
                                href={`tel:${store.contactPhone}`}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm hover:bg-white/10 transition"
                            >
                                <span>Call Us</span>
                            </a>
                        </div>
                        <div className="mt-12 flex gap-10 border-t border-white/5 pt-8">
                            <div>
                                <p className="font-mono text-2xl font-black text-[#00e5ff]">
                                    {products.length}
                                </p>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                    Products
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-2xl font-black text-[#00e5ff]">
                                    ★
                                </p>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                    Premium
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-2xl font-black text-[#00e5ff]">
                                    {store.location.slice(0, 3).toUpperCase()}
                                </p>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                    Based
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-[#00e5ff]/30 via-transparent to-purple-500/20 opacity-50 blur-xl transition duration-500 group-hover:opacity-80" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                            <div className="relative h-80 w-full md:h-96">
                                <Image
                                    src={store.bannerUrl}
                                    alt={store.name}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/60 to-transparent" />
                            </div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-4">
                                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                                    <Image
                                        src={store.logoUrl}
                                        alt={store.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                                        {store.name}
                                    </p>
                                    <p className="font-mono text-[10px] text-white/50">
                                        {store.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="products"
                className="relative z-10 mx-auto max-w-7xl px-6 pb-20"
            >
                <div className="mb-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <h2 className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#00e5ff]" />
                        Products
                        <span className="inline-block h-2 w-2 rounded-full bg-[#00e5ff]" />
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
                                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                                    (cat === "all" &&
                                        selectedCategory === "all") ||
                                    selectedCategory === cat
                                        ? "border-[#00e5ff] bg-[#00e5ff] text-[#0a0a1a]"
                                        : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
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
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 backdrop-blur-sm"
                    >
                        <option value="default">Default</option>
                        <option value="price-low">Price ↑</option>
                        <option value="price-high">Price ↓</option>
                    </select>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-sm">
                        <p className="font-mono text-sm text-white/30">
                            No products available yet.
                        </p>
                    </div>
                ) : groupedProducts.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-sm">
                        <p className="font-mono text-sm text-white/30">
                            No products match this filter.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {groupedProducts.map((group) => (
                            <div key={group.category}>
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                    <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">
                                        <span className="text-[#00e5ff]/50">
                                            ──{" "}
                                        </span>
                                        {group.category}
                                    </h3>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                </div>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {group.products.map((product) => (
                                        <article
                                            key={product.id}
                                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#00e5ff]/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.1)]"
                                        >
                                            <div className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100">
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00e5ff]/10 via-transparent to-purple-500/10" />
                                            </div>

                                            <div className="relative h-56 w-full overflow-hidden bg-white/5">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/80 via-transparent to-transparent" />
                                                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                                                    {product.categoryName ??
                                                        "General"}
                                                </span>
                                                {product.offerPrice && (
                                                    <span className="absolute right-4 top-4 rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/20 px-3 py-1 font-mono text-[10px] font-bold text-[#00e5ff] backdrop-blur-md">
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

                                            <div className="relative p-6">
                                                <h3 className="text-lg font-bold tracking-tight">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/40">
                                                    {product.description}
                                                </p>

                                                <div className="mt-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                                            Price
                                                        </p>
                                                        {product.offerPrice ? (
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xl font-black text-[#00e5ff]">
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
                                                            <p className="text-xl font-black text-[#00e5ff]">
                                                                ₹{product.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Link
                                                        href={`/stores/${store.slug}/products/${product.id}`}
                                                        className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm hover:bg-[#00e5ff] hover:text-[#0a0a1a] transition"
                                                    >
                                                        View →
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

            <footer className="relative z-10 border-t border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 text-center">
                    <div className="flex items-center gap-3">
                        <span className="inline-block h-px w-10 bg-gradient-to-r from-transparent to-white/20" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                            Contact
                        </span>
                        <span className="inline-block h-px w-10 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
                        <a
                            href={`mailto:${store.contactEmail}`}
                            className="font-mono text-xs hover:text-[#00e5ff] transition"
                        >
                            {store.contactEmail}
                        </a>
                        <a
                            href={`tel:${store.contactPhone}`}
                            className="font-mono text-xs hover:text-[#00e5ff] transition"
                        >
                            {store.contactPhone}
                        </a>
                        <a
                            href={`https://wa.me/${store.contactPhone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-xs text-[#00e5ff] hover:text-white transition"
                        >
                            WhatsApp ↗
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
