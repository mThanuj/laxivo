import Link from "next/link";
import { redirect } from "next/navigation";
import { getOwnerStore } from "@/lib/dashboardData";
import { getCurrentUser } from "@/lib/serverAuth";
import StoreSettingsForm from "./StoreSettingsForm";

export default async function StoreSettingsPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const store = await getOwnerStore(currentUser.userId);

    if (!store) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-16">
                <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                        Store not found
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-gray-900">
                        No demo owner store found
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Run the seed route first to create the demo store.
                    </p>

                    <code className="mt-6 block rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                        http://localhost:3000/api/seed
                    </code>

                    <Link
                        href="/dashboard"
                        className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </Link>
                </section>
            </main>
        );
    }

    return <StoreSettingsForm initialStore={store} currentUser={currentUser} />;
}
