export default function ProductDetailLoading() {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-2">
                <div className="h-[420px] animate-pulse rounded-3xl bg-gray-200" />

                <div className="flex flex-col justify-center">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="mt-4 h-10 w-72 animate-pulse rounded bg-gray-200" />
                    <div className="mt-4 h-8 w-28 animate-pulse rounded bg-gray-200" />

                    <div className="mt-6 space-y-3">
                        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="mt-8 flex gap-3">
                        <div className="h-12 w-40 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200" />
                    </div>
                </div>
            </section>
        </main>
    );
}
