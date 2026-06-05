import Link from "next/link";
import LogoutButton from "@/components/common/LogoutButton";

type DashboardHeaderProps = {
    storeSlug?: string;
    userName?: string;
    userEmail?: string;
};

export default function DashboardHeader({
    storeSlug,
    userName,
    userEmail,
}: DashboardHeaderProps) {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Link href="/" className="text-lg font-bold text-gray-900">
                        Storefront Builder
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                        MVP dashboard for managing your online storefront.
                    </p>

                    {(userName || userEmail) && (
                        <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-gray-100">
                            <p>
                                Signed in as{" "}
                                <span className="font-semibold text-gray-900">
                                    {userName || "Owner"}
                                </span>
                            </p>

                            {userEmail && (
                                <p className="mt-0.5 text-gray-500">
                                    {userEmail}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <nav className="flex flex-wrap gap-2">
                        <Link
                            href="/"
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Home
                        </Link>

                        <Link
                            href="/dashboard"
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/dashboard/store"
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Store Settings
                        </Link>

                        <Link
                            href="/dashboard/templates"
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Templates
                        </Link>

                        <Link
                            href="/dashboard/products"
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Products
                        </Link>

                        {storeSlug && (
                            <Link
                                href={`/stores/${storeSlug}`}
                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Public Store
                            </Link>
                        )}
                    </nav>

                    <div className="flex justify-start lg:justify-end">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
