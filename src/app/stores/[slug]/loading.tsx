export default function StorefrontLoading() {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="h-72 w-full animate-pulse bg-gray-200" />

            <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_280px]">
                <div>
                    <div className="mb-6">
                        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
                            >
                                <div className="h-48 animate-pulse bg-gray-200" />

                                <div className="p-5">
                                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                                    <div className="mt-3 h-5 w-36 animate-pulse rounded bg-gray-200" />
                                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-100" />
                                    <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="mt-5 space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item}>
                                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </main>
    );
}
