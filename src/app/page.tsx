import Link from "next/link";
import { getDbPublishedStores } from "@/lib/storefrontData";
import { getCurrentUser } from "@/lib/serverAuth";

export default async function HomePage() {
    const stores = await getDbPublishedStores();
    const user = await getCurrentUser();

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">
            <section className="mx-auto max-w-5xl text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Storefront Builder
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
                    Build a beautiful online store in minutes
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                    A simple platform for small business owners to create their
                    own e-commerce storefront using ready-made templates.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    {!user && (
                        <>
                            <Link
                                href="/register"
                                className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Start Your Store
                            </Link>

                            <Link
                                href="/login"
                                className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Owner Login
                            </Link>
                        </>
                    )}

                    {user && (
                        <Link
                            href="/dashboard"
                            className="inline-flex rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {stores.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10">
                        <h3 className="text-lg font-bold text-gray-900">
                            No published stores found
                        </h3>

                        {process.env.NODE_ENV !== "production" && (
                            <>
                                <p className="mt-2 text-sm text-gray-500">
                                    Run the seed route first:
                                </p>

                                <code className="mt-4 block rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                                    http://localhost:3000/api/seed
                                </code>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {stores.map((store) => (
                            <Link
                                key={store.id}
                                href={`/stores/${store.slug}`}
                                className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    {store.template} template
                                </p>

                                <h3 className="mt-2 text-lg font-bold text-gray-900">
                                    {store.name}
                                </h3>

                                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                    {store.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        {store.location}
                                    </p>

                                    <p className="text-sm font-semibold text-blue-600">
                                        View store →
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
