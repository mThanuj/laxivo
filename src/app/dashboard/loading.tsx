export default function DashboardLoading() {
    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">
            <section className="mx-auto max-w-6xl">
                <div className="animate-pulse">
                    <div className="h-8 w-64 rounded bg-gray-200" />
                    <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />

                    <div className="mt-8 grid gap-6 md:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
                            >
                                <div className="h-4 w-24 rounded bg-gray-200" />
                                <div className="mt-4 h-8 w-20 rounded bg-gray-200" />
                                <div className="mt-4 h-3 w-full rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <div className="h-6 w-40 rounded bg-gray-200" />
                            <div className="mt-6 space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-20 rounded-2xl border border-gray-100 bg-gray-50"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <div className="h-6 w-32 rounded bg-gray-200" />
                            <div className="mt-6 h-20 rounded-xl bg-gray-100" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
