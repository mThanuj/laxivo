"use client";

import { useState } from "react";

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string | null;
    createdAt: string;
    storeCount: number;
};

type AdminUsersClientProps = {
    users: UserRow[];
    currentUserId: number;
};

export default function AdminUsersClient({
    users: initialUsers,
    currentUserId,
}: AdminUsersClientProps) {
    const [users, setUsers] = useState<UserRow[]>(initialUsers);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );
    const [actionUserId, setActionUserId] = useState<number | null>(null);

    async function handleDeleteUser(userId: number, userName: string) {
        if (
            !confirm(
                `Are you sure you want to delete "${userName}"? This will also delete all their stores and products.`
            )
        ) {
            return;
        }

        try {
            setActionUserId(userId);
            setMessage("");

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to delete user.");
            }

            setUsers((current) => current.filter((u) => u.id !== userId));
            setMessageType("success");
            setMessage(`User "${userName}" deleted successfully.`);
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setActionUserId(null);
        }
    }

    async function handleContactUser(userId: number) {
        const subject = prompt("Subject:");
        if (!subject) return;

        const messageText = prompt("Message:");
        if (!messageText) return;

        try {
            setActionUserId(userId);
            setMessage("");

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message: messageText }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to contact user.");
            }

            setMessageType("success");
            setMessage(result.message);
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setActionUserId(null);
        }
    }

    return (
        <div>
            {message && (
                <div
                    className={`mb-6 rounded-xl p-4 text-sm font-semibold ring-1 ${
                        messageType === "success"
                            ? "bg-green-50 text-green-700 ring-green-100"
                            : "bg-red-50 text-red-700 ring-red-100"
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="hidden grid-cols-[40px_1fr_1fr_100px_100px_180px_200px] border-b bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
                    <p>#</p>
                    <p>Name</p>
                    <p>Email</p>
                    <p>Role</p>
                    <p>Stores</p>
                    <p>Joined</p>
                    <p className="text-right">Actions</p>
                </div>

                <div className="divide-y">
                    {users.map((user, index) => {
                        const isLoading = actionUserId === user.id;

                        return (
                            <div
                                key={user.id}
                                className="grid items-center gap-4 px-6 py-5 md:grid-cols-[40px_1fr_1fr_100px_100px_180px_200px]"
                            >
                                <p className="text-sm font-medium text-gray-400">
                                    {index + 1}
                                </p>

                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {user.name}
                                        {user.id === currentUserId && (
                                            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                                You
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-600">
                                    {user.email}
                                </p>

                                <p>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            user.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {user.role || "OWNER"}
                                    </span>
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {user.storeCount}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <div className="flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() =>
                                            handleContactUser(user.id)
                                        }
                                        className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Contact
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            isLoading ||
                                            user.id === currentUserId
                                        }
                                        onClick={() =>
                                            handleDeleteUser(user.id, user.name)
                                        }
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            user.id === currentUserId
                                                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                : "bg-red-50 text-red-700 hover:bg-red-100"
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        {isLoading
                                            ? "Deleting..."
                                            : user.id === currentUserId
                                              ? "Cannot Delete"
                                              : "Delete"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {users.length === 0 && (
                        <div className="p-10 text-center">
                            <p className="text-sm text-gray-500">
                                No users found.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
