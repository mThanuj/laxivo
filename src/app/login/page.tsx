"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginFormState = {
    email: string;
    password: string;
};

const initialFormState: LoginFormState = {
    email: "",
    password: "",
};

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<LoginFormState>(initialFormState);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(field: keyof LoginFormState, value: string) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!formData.email.trim()) {
            setMessageType("error");
            setMessage("Email is required.");
            return;
        }

        if (!formData.password.trim()) {
            setMessageType("error");
            setMessage("Password is required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage("");

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to login.");
            }

            setMessageType("success");
            setMessage("Logged in successfully. Redirecting to dashboard...");

            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 700);
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
                        Sign in to manage your online storefront.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Owner Login
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Login with your owner account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                                placeholder="demo-owner@example.com"
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
                                placeholder="password123"
                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
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
                        </div>
                    )}

                    <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800 ring-1 ring-blue-100">
                        <p className="font-semibold">Demo credentials</p>
                        <p className="mt-1">Email: demo-owner@example.com</p>
                        <p>Password: password123</p>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create one
                        </Link>
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
