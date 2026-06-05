"use client";

import Link from "next/link";

type DashboardErrorProps = {
    error: Error;
    reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">
            <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                    Something went wrong
                </p>

                <h1 className="mt-3 text-3xl font-bold text-gray-900">
                    Dashboard failed to load
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    There was a problem loading this dashboard page. You can
                    retry or go back to the dashboard.
                </p>

                {error?.message && (
                    <div className="mt-6 rounded-xl bg-red-50 p-4 text-left text-sm text-red-700 ring-1 ring-red-100">
                        {error.message}
                    </div>
                )}

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/dashboard"
                        className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </section>
        </main>
    );
}
