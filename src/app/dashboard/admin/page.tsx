import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/serverAuth";
import { db } from "@/lib/db";
import { users, stores, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminDashboardPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const analytics = await getAnalytics();

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                            Admin Dashboard
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">
                            Platform Overview
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Welcome back, {currentUser.name}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Home
                        </Link>
                        <form action="/api/auth/logout" method="POST">
                            <button
                                type="submit"
                                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl gap-4 px-6 py-3">
                    <Link
                        href="/dashboard/admin"
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Overview
                    </Link>
                    <Link
                        href="/dashboard/admin/users"
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Users
                    </Link>
                </div>
            </nav>

            <section className="mx-auto max-w-6xl px-6 py-8">
                <div className="grid gap-6 md:grid-cols-4">
                    <AnalyticsCard
                        label="Total Users"
                        value={analytics.totalUsers}
                        color="indigo"
                        subtitle="Registered accounts"
                    />
                    <AnalyticsCard
                        label="Total Stores"
                        value={analytics.totalStores}
                        color="emerald"
                        subtitle="Created by owners"
                    />
                    <AnalyticsCard
                        label="Total Products"
                        value={analytics.totalProducts}
                        color="amber"
                        subtitle="Across all stores"
                    />
                    <AnalyticsCard
                        label="Published Stores"
                        value={analytics.publishedStores}
                        color="green"
                        subtitle="Visible to customers"
                    />
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-12">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                    Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/dashboard/admin/users"
                        className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Manage Users
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                View, delete, or contact users
                            </p>
                        </div>
                        <span className="text-lg text-indigo-600">→</span>
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                View Public Stores
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Browse all published storefronts
                            </p>
                        </div>
                        <span className="text-lg text-indigo-600">→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

type AnalyticsData = {
    totalUsers: number;
    totalStores: number;
    totalProducts: number;
    publishedStores: number;
};

async function getAnalytics(): Promise<AnalyticsData> {
    try {
        const [totalUsers, totalStores, totalProducts, publishedStores] =
            await Promise.all([
                db.$count(users),
                db.$count(stores),
                db.$count(products),
                db.$count(stores, eq(stores.isPublished, true)),
            ]);

        return { totalUsers, totalStores, totalProducts, publishedStores };
    } catch (error) {
        console.error("Failed to fetch analytics:", error);
        return {
            totalUsers: 0,
            totalStores: 0,
            totalProducts: 0,
            publishedStores: 0,
        };
    }
}

function AnalyticsCard({
    label,
    value,
    color,
    subtitle,
}: {
    label: string;
    value: number;
    color: "indigo" | "emerald" | "amber" | "green";
    subtitle: string;
}) {
    const dotColor = {
        indigo: "bg-indigo-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        green: "bg-green-500",
    }[color];

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span
                    className={`inline-block h-2 w-2 rounded-full ${dotColor}`}
                />
                {subtitle}
            </div>
        </div>
    );
}
