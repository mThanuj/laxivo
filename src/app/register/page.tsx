"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type RegisterFormState = {
    name: string;
    email: string;
    password: string;
    businessName: string;
};

const initialFormState: RegisterFormState = {
    name: "",
    email: "",
    password: "",
    businessName: "",
};

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] =
        useState<RegisterFormState>(initialFormState);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdStoreSlug, setCreatedStoreSlug] = useState("");

    function updateField(field: keyof RegisterFormState, value: string) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!formData.name.trim()) {
            setMessageType("error");
            setMessage("Full name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setMessageType("error");
            setMessage("Email is required.");
            return;
        }

        if (formData.password.length < 6) {
            setMessageType("error");
            setMessage("Password must be at least 6 characters.");
            return;
        }

        if (!formData.businessName.trim()) {
            setMessageType("error");
            setMessage("Business name is required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage("");
            setCreatedStoreSlug("");

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to create account.");
            }

            setMessageType("success");
            setMessage("Account created successfully. Starter store is ready.");
            setCreatedStoreSlug(result.store.slug);
            setFormData(initialFormState);
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">
            <section className="mx-auto max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-lg font-bold text-gray-900">
                        Storefront Builder
                    </Link>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your owner account and launch your storefront.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Owner Registration
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Start your store
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Create a real owner account and starter store in
                            MongoDB.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Full name
                            </label>

                            <input
                                type="text"
                                value={formData.name}
                                onChange={(event) =>
                                    updateField("name", event.target.value)
                                }
                                placeholder="Example: Demo Owner"
                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={formData.email}
                                onChange={(event) =>
                                    updateField("email", event.target.value)
                                }
                                placeholder="owner@example.com"
                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={formData.password}
                                onChange={(event) =>
                                    updateField("password", event.target.value)
                                }
                                placeholder="Minimum 6 characters"
                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Business name
                            </label>

                            <input
                                type="text"
                                value={formData.businessName}
                                onChange={(event) =>
                                    updateField(
                                        "businessName",
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Green Bakery"
                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    {message && (
                        <div
                            className={`mt-6 rounded-xl p-4 text-sm font-semibold ring-1 ${
                                messageType === "success"
                                    ? "bg-green-50 text-green-700 ring-green-100"
                                    : "bg-red-50 text-red-700 ring-red-100"
                            }`}
                        >
                            {message}

                            {createdStoreSlug && (
                                <div className="mt-4 flex flex-col gap-2">
                                    <Link
                                        href={`/stores/${createdStoreSlug}`}
                                        className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-green-700 ring-1 ring-green-200 hover:bg-green-50"
                                    >
                                        View Created Store
                                    </Link>

                                    <Link
                                        href="/dashboard"
                                        className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-green-700 ring-1 ring-green-200 hover:bg-green-50"
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login">Sign in</Link>
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                        ← Back to home
                    </Link>
                </div>
            </section>
        </main>
    );
}
