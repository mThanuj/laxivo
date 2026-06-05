"use client";

import Link from "next/link";
import { useState } from "react";
import { mockTemplates } from "@/data/mockTemplates";
import { Store, StoreTemplate } from "@/types/store";
import { AuthTokenPayload } from "@/lib/auth";

type TemplateSelectionClientProps = {
    initialStore: Store;
    currentUser: AuthTokenPayload;
};

export default function TemplateSelectionClient({
    initialStore,
    currentUser,
}: TemplateSelectionClientProps) {
    const [store, setStore] = useState<Store>(initialStore);
    const [selectedTemplate, setSelectedTemplate] = useState<StoreTemplate>(
        initialStore.template
    );
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );
    const [isSaving, setIsSaving] = useState(false);

    async function handleUseTemplate(template: StoreTemplate) {
        try {
            setIsSaving(true);
            setMessage("");

            const response = await fetch("/api/dashboard/template", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ template }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update template.");
            }

            setStore(result.store);
            setSelectedTemplate(result.store.template);
            setMessageType("success");
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setIsSaving(false);
        }
    }

    const selectedTemplateInfo = mockTemplates.find(
        (template) => template.key === selectedTemplate
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <Link
                            href="/dashboard"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            ← Back to Dashboard
                        </Link>

                        <h1 className="mt-2 text-2xl font-bold text-gray-900">
                            Choose Storefront Template
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Select a layout and save it to MongoDB.
                        </p>
                    </div>

                    <Link
                        href={`/stores/${store.slug}`}
                        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View Current Store
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-8">
                <div className="rounded-2xl bg-blue-50 p-6 ring-1 ring-blue-100">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Current Template
                    </p>

                    <h2 className="mt-2 text-2xl font-bold capitalize text-blue-950">
                        {selectedTemplate}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-800">
                        This template is saved in MongoDB for {store.name}. Your
                        public storefront will render using this selected
                        template.
                    </p>

                    {selectedTemplateInfo && (
                        <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm text-blue-900">
                            <p className="font-semibold">
                                {selectedTemplateInfo.name}
                            </p>
                            <p className="mt-1 leading-6">
                                {selectedTemplateInfo.description}
                            </p>
                        </div>
                    )}
                </div>

                {message && (
                    <div
                        className={`mt-6 rounded-2xl p-4 text-sm font-semibold ring-1 ${
                            messageType === "success"
                                ? "bg-green-50 text-green-700 ring-green-100"
                                : "bg-red-50 text-red-700 ring-red-100"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {mockTemplates.map((template) => {
                        const isSelected = template.key === selectedTemplate;

                        return (
                            <article
                                key={template.id}
                                className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition ${
                                    isSelected
                                        ? "ring-blue-500"
                                        : "ring-gray-200"
                                }`}
                            >
                                <div
                                    className={`flex h-44 items-center justify-center ${
                                        template.key === "classic"
                                            ? "bg-green-100"
                                            : template.key === "modern"
                                              ? "bg-neutral-900"
                                              : "bg-pink-100"
                                    }`}
                                >
                                    <div
                                        className={`rounded-2xl px-6 py-4 text-center ${
                                            template.key === "modern"
                                                ? "bg-white text-neutral-950"
                                                : "bg-white text-gray-900"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold uppercase tracking-wide">
                                            {template.name}
                                        </p>

                                        <p className="mt-1 text-xs opacity-70">
                                            Template Preview
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {template.name}
                                            </h2>

                                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                {template.key} layout
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                Selected
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-gray-600">
                                        {template.description}
                                    </p>

                                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Best for
                                        </p>

                                        <p className="mt-1 text-sm text-gray-700">
                                            {template.bestFor}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link
                                            href={`/stores/${template.previewStoreSlug}`}
                                            className="rounded-full border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            Preview Template
                                        </Link>

                                        <button
                                            type="button"
                                            disabled={isSelected || isSaving}
                                            onClick={() =>
                                                handleUseTemplate(template.key)
                                            }
                                            className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
                                                isSelected
                                                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            } disabled:cursor-not-allowed disabled:opacity-60`}
                                        >
                                            {isSelected
                                                ? "Currently Selected"
                                                : isSaving
                                                  ? "Saving..."
                                                  : "Use Template"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Template Selection Is Now Persistent
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        This page now updates MongoDB. After selecting a
                        template, open your public store to confirm the
                        storefront layout changes.
                    </p>
                </div>
            </section>
        </main>
    );
}
