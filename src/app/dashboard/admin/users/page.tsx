import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/serverAuth";
import { db } from "@/lib/db";
import { users, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const allUsers = await db.select().from(users).orderBy(users.createdAt);

    const usersWithStoreCounts = await Promise.all(
        allUsers.map(async (user) => {
            const storeCount = await db.$count(
                stores,
                eq(stores.ownerId, user.id)
            );
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt.toISOString(),
                storeCount,
            };
        })
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <Link
                            href="/dashboard/admin"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            ← Back to Admin Dashboard
                        </Link>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900">
                            User Management
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage all registered users on the platform
                        </p>
                    </div>

                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </header>

            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl gap-4 px-6 py-3">
                    <Link
                        href="/dashboard/admin"
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Overview
                    </Link>
                    <Link
                        href="/dashboard/admin/users"
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Users
                    </Link>
                </div>
            </nav>

            <section className="mx-auto max-w-6xl px-6 py-8">
                <AdminUsersClient
                    users={usersWithStoreCounts}
                    currentUserId={Number(currentUser.userId)}
                />
            </section>
        </main>
    );
}
