import Link from "next/link";
import { redirect } from "next/navigation";
import { getOwnerDashboardData } from "@/lib/dashboardData";
import { getCurrentUser } from "@/lib/serverAuth";
import DashboardHeader from "@/components/common/DashboardHeader";

export default async function DashboardPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const dashboardData = await getOwnerDashboardData(currentUser.userId);

    if (!dashboardData) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-16">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                        Store not found
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-gray-900">
                        No store found
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Create a store first to get started.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Home
                    </Link>
                </section>
            </main>
        );
    }

    const { store, recentProducts, totalProducts, activeProducts } =
        dashboardData;

    return (
        <main className="min-h-screen bg-gray-50">
            <DashboardHeader
                storeSlug={store.slug}
                userName={currentUser.name}
                userEmail={currentUser.email}
            />
            <section className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Owner Dashboard
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900">
                            Manage {store.name}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Dashboard data is loaded from the database.
                        </p>
                    </div>

                    <Link
                        href={`/stores/${store.slug}`}
                        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View Public Store
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-8">
                <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-medium text-gray-500">
                            Store Status
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            {store.isPublished ? "Published" : "Draft"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {store.isPublished
                                ? "Your store is visible to customers."
                                : "Your store is hidden."}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-medium text-gray-500">
                            Template
                        </p>

                        <h2 className="mt-2 text-2xl font-bold capitalize text-gray-900">
                            {store.template}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            This controls how your storefront looks.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-medium text-gray-500">
                            Total Products
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            {totalProducts}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Products created for this store.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-medium text-gray-500">
                            Active Products
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            {activeProducts}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Products visible on storefront.
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Store Setup
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Complete these steps to prepare your online
                                storefront.
                            </p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <Link
                                href="/dashboard/store"
                                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Edit store information
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Update business name, description,
                                        contact, and location.
                                    </p>
                                </div>

                                <span className="text-sm font-semibold text-blue-600">
                                    Open →
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/templates"
                                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Choose storefront template
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Select Classic, Modern, or Minimal
                                        layout.
                                    </p>
                                </div>

                                <span className="text-sm font-semibold text-blue-600">
                                    Open →
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/products"
                                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Manage products
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Add, edit, or remove products from your
                                        storefront.
                                    </p>
                                </div>

                                <span className="text-sm font-semibold text-blue-600">
                                    Open →
                                </span>
                            </Link>
                        </div>
                    </div>

                    <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Public URL
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Share this link with customers.
                        </p>

                        <div className="mt-4 break-all rounded-xl bg-gray-50 p-4 text-sm font-medium text-gray-700">
                            /stores/{store.slug}
                        </div>

                        <Link
                            href={`/stores/${store.slug}`}
                            className="mt-5 block rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Open Store
                        </Link>

                        <div className="mt-6 rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Store Location
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-800">
                                {store.location}
                            </p>
                        </div>
                    </aside>
                </div>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest products from your store.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/products"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Manage all →
                        </Link>
                    </div>

                    {recentProducts.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                            <h3 className="font-semibold text-gray-900">
                                No products yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Add products to start building your storefront.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 divide-y">
                            {recentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between gap-4 py-4"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {product.name}
                                            </h3>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    product.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {product.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {product.categoryName ||
                                                "Uncategorized"}{" "}
                                            ·{" "}
                                            {product.offerPrice ? (
                                                <>
                                                    <span className="text-gray-400 line-through">
                                                        ₹{product.price}
                                                    </span>{" "}
                                                    <span className="font-semibold text-green-600">
                                                        ₹{product.offerPrice}
                                                    </span>
                                                </>
                                            ) : (
                                                <>₹{product.price}</>
                                            )}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/stores/${store.slug}/products/${product.id}`}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
