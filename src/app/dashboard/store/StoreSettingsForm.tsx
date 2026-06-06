"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Store } from "@/types/store";
import { AuthTokenPayload } from "@/lib/auth";
import { TEMPLATE_MANIFEST } from "@/data/templates/template-manifest";

type StoreSettingsFormProps = {
    initialStore: Store;
    currentUser: AuthTokenPayload;
};

export default function StoreSettingsForm({
    initialStore,
}: StoreSettingsFormProps) {
    const [store, setStore] = useState<Store>(initialStore);
    const [formData, setFormData] = useState<Store>(initialStore);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    function updateField<K extends keyof Store>(field: K, value: Store[K]) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsSaving(true);
            setMessage("");

            console.log(formData);

            const response = await fetch("/api/dashboard/store", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update store.");
            }

            setStore(result.store);
            setFormData(result.store);
            setMessageType("success");
            setMessage("Store updated successfully.");
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function uploadToCloudinary(file: File) {
        const sign = await fetch("/api/cloudinary", {
            method: "POST",
        });

        const { timestamp, signature, apiKey, cloudName } = await sign.json();

        const formData = new FormData();

        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "laxivo");

        const upload = await fetch(
            "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        return upload.json();
    }

    async function handleFileChange<K extends keyof Store>(
        e: React.ChangeEvent<HTMLInputElement>,
        field: K
    ) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setIsLoading(true);

        const response = await uploadToCloudinary(file);

        updateField(field, response.secure_url);

        setIsLoading(false);
    }

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
                            Store Settings
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Edit your store details and save them to the
                            database.
                        </p>
                    </div>

                    <Link
                        href={`/stores/${store.slug}`}
                        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View Public Store
                    </Link>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1fr_340px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Business Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            These details are visible to customers.
                        </p>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Business Name
                                </label>
                                <input
                                    value={formData.name}
                                    onChange={(event) =>
                                        updateField("name", event.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Store Slug
                                </label>
                                <input
                                    value={formData.slug}
                                    onChange={(event) =>
                                        updateField("slug", event.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Public URL: /stores/{formData.slug}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(event) =>
                                        updateField(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(event) =>
                                        updateField(
                                            "contactEmail",
                                            event.target.value
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Contact Phone
                                </label>
                                <input
                                    value={formData.contactPhone}
                                    onChange={(event) =>
                                        updateField(
                                            "contactPhone",
                                            event.target.value
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    value={formData.location}
                                    onChange={(event) =>
                                        updateField(
                                            "location",
                                            event.target.value
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Brand Assets
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload logos and banners via Cloudinary.
                        </p>

                        <div className="mt-6 grid gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Logo URL
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileChange(e, "logoUrl")
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Banner URL
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileChange(e, "bannerUrl")
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Template
                                </label>

                                <select
                                    value={formData.template}
                                    onChange={(event) =>
                                        updateField(
                                            "template",
                                            event.target
                                                .value as Store["template"]
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    {TEMPLATE_MANIFEST.map((tpl) => (
                                        <option key={tpl.key} value={tpl.key}>
                                            {tpl.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Theme Color
                                </label>

                                <div className="mt-1 flex gap-3">
                                    <input
                                        type="color"
                                        value={formData.themeColor}
                                        onChange={(event) =>
                                            updateField(
                                                "themeColor",
                                                event.target.value
                                            )
                                        }
                                        className="h-12 w-16 rounded-xl border border-gray-300 bg-white p-1"
                                    />

                                    <input
                                        value={formData.themeColor}
                                        onChange={(event) =>
                                            updateField(
                                                "themeColor",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(event) =>
                                        updateField(
                                            "isPublished",
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Publish store
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Save Store Settings
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                This will update the store in the database.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving || isLoading}
                            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                    {message && (
                        <div
                            className={`rounded-2xl p-4 text-sm font-semibold ring-1 ${
                                messageType === "success"
                                    ? "bg-green-50 text-green-700 ring-green-100"
                                    : "bg-red-50 text-red-700 ring-red-100"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </form>

                <aside className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">
                            Live Preview
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            This preview updates while typing.
                        </p>

                        <div className="mt-5 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200">
                            <div className="relative h-36 bg-gray-100">
                                <Image
                                    src={formData.bannerUrl}
                                    alt={`${formData.name} banner`}
                                    fill
                                    className="object-cover"
                                    sizes="340px"
                                />
                            </div>

                            <div className="p-5">
                                <div className="relative -mt-12 h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-sm">
                                    <Image
                                        src={formData.logoUrl}
                                        alt={`${formData.name} logo`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>

                                <h3 className="mt-4 text-xl font-bold text-gray-900">
                                    {formData.name}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                                    {formData.description}
                                </p>

                                <div className="mt-4 space-y-1 text-sm text-gray-500">
                                    <p>{formData.location}</p>
                                    <p>{formData.contactEmail}</p>
                                    <p>{formData.contactPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">
                            Store Summary
                        </h2>

                        <div className="mt-5 space-y-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-500">
                                    Saved Store
                                </p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {store.name}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium text-gray-500">
                                    Status
                                </p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {formData.isPublished
                                        ? "Published"
                                        : "Draft"}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium text-gray-500">
                                    Template
                                </p>
                                <p className="mt-1 font-semibold capitalize text-gray-900">
                                    {formData.template}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium text-gray-500">
                                    Theme Color
                                </p>

                                <div className="mt-2 flex items-center gap-3">
                                    <span
                                        className="h-8 w-8 rounded-full ring-1 ring-gray-200"
                                        style={{
                                            backgroundColor:
                                                formData.themeColor,
                                        }}
                                    />

                                    <span className="font-semibold text-gray-900">
                                        {formData.themeColor}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
