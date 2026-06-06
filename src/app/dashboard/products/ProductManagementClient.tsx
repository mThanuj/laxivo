"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { Product } from "@/types/product";
import { Store } from "@/types/store";
import { AuthTokenPayload } from "@/lib/auth";
import CategoryInput from "@/components/common/CategoryInput";

type ProductFormState = {
    name: string;
    description: string;
    price: string;
    offerPrice: string;
    imageUrl: string;
    categoryId: string;
};

type ProductManagementClientProps = {
    initialStore: Store;
    initialProducts: Product[];
    currentUser?: AuthTokenPayload;
};

const emptyProductForm: ProductFormState = {
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    imageUrl: "",
    categoryId: "",
};

export default function ProductManagementClient({
    initialStore,
    initialProducts,
}: ProductManagementClientProps) {
    const [store] = useState<Store>(initialStore);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [formData, setFormData] =
        useState<ProductFormState>(emptyProductForm);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actionProductId, setActionProductId] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    function updateFormField(field: keyof ProductFormState, value: string) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const numericPrice = Number(formData.price);

        if (!formData.name.trim()) {
            setMessageType("error");
            setMessage("Product name is required.");
            return;
        }

        if (!numericPrice || numericPrice <= 0) {
            setMessageType("error");
            setMessage("Enter a valid product price.");
            return;
        }

        if (!formData.imageUrl.trim()) {
            setMessageType("error");
            setMessage("Product image is required.");
            return;
        }

        try {
            setIsCreating(true);
            setMessage("");

            const response = await fetch("/api/dashboard/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    categoryId: formData.categoryId || null,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to create product.");
            }

            setProducts((current) => [result.product, ...current]);
            setFormData(emptyProductForm);
            fileInputRef.current!.value = "";
            setMessageType("success");
            setMessage("Product created successfully.");
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setIsCreating(false);
        }
    }

    async function toggleProductStatus(product: Product) {
        try {
            setActionProductId(product.id);
            setMessage("");

            const response = await fetch(
                `/api/dashboard/products/${product.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        isActive: !product.isActive,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update product.");
            }

            setProducts((current) =>
                current.map((item) =>
                    item.id === product.id ? result.product : item
                )
            );

            setMessageType("success");
            setMessage("Product status updated successfully.");
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setActionProductId("");
        }
    }

    async function deleteProduct(productId: string) {
        try {
            setActionProductId(productId);
            setMessage("");

            const response = await fetch(
                `/api/dashboard/products/${productId}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to delete product.");
            }

            setProducts((current) => current.filter((p) => p.id !== productId));

            setMessageType("success");
            setMessage("Product deleted successfully.");
        } catch (error) {
            setMessageType("error");
            setMessage(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setActionProductId("");
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

    async function handleFileChange<K extends keyof ProductFormState>(
        e: React.ChangeEvent<HTMLInputElement>,
        field: K
    ) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setIsLoading(true);

        const response = await uploadToCloudinary(file);

        updateFormField(field, response.secure_url);

        setIsLoading(false);
    }

    const activeProductCount = products.filter(
        (product) => product.isActive
    ).length;

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
                            Manage Products
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Add and manage products listed in {store.name}.
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

            <section className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[380px_1fr]">
                <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        Add Product
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                        New Product
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        This creates a new product in the database.
                    </p>

                    <form
                        onSubmit={handleAddProduct}
                        className="mt-6 space-y-4 text-black"
                    >
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Product Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={formData.name}
                                onChange={(event) =>
                                    updateFormField("name", event.target.value)
                                }
                                placeholder="Example: Vanilla Cupcake"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <CategoryInput
                                value={formData.categoryId}
                                onChange={(val) =>
                                    updateFormField("categoryId", val)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Original Price{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.price}
                                onChange={(event) =>
                                    updateFormField("price", event.target.value)
                                }
                                placeholder="Example: 299"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Offer Price{" "}
                                <span className="text-gray-400">
                                    (optional)
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.offerPrice}
                                onChange={(event) =>
                                    updateFormField(
                                        "offerPrice",
                                        event.target.value
                                    )
                                }
                                placeholder="Example: 199 (leave empty if no offer)"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Image URL{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFileChange(e, "imageUrl")
                                }
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Description{" "}
                                <span className="text-gray-400">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    updateFormField(
                                        "description",
                                        event.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Short product description"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating || isLoading}
                            className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isCreating ? "Creating..." : "+ Add Product"}
                        </button>
                    </form>

                    {message && (
                        <div
                            className={`mt-5 rounded-xl p-4 text-sm font-semibold ring-1 ${
                                messageType === "success"
                                    ? "bg-green-50 text-green-700 ring-green-100"
                                    : "bg-red-50 text-red-700 ring-red-100"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </aside>

                <div>
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                            <p className="text-sm font-medium text-gray-500">
                                Total Products
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                {products.length}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                            <p className="text-sm font-medium text-gray-500">
                                Active Products
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                {activeProductCount}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                            <p className="text-sm font-medium text-gray-500">
                                Store
                            </p>
                            <h2 className="mt-2 text-lg font-bold text-gray-900">
                                {store.name}
                            </h2>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                            <h2 className="text-lg font-bold text-gray-900">
                                No products yet
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Add your first product using the form.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                            <div className="hidden grid-cols-[90px_1fr_120px_100px_180px] border-b bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
                                <p>Image</p>
                                <p>Product</p>
                                <p>Category</p>
                                <p>Price</p>
                                <p className="text-right">Actions</p>
                            </div>

                            <div className="divide-y">
                                {products.map((product) => {
                                    const isActionLoading =
                                        actionProductId === product.id;

                                    return (
                                        <article
                                            key={product.id}
                                            className="grid gap-4 px-6 py-5 md:grid-cols-[90px_1fr_120px_100px_180px] md:items-center"
                                        >
                                            <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {product.name}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            product.isActive
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}
                                                    >
                                                        {product.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>

                                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                                    {product.description ||
                                                        "No description added."}
                                                </p>
                                            </div>

                                            <p className="text-sm font-medium text-gray-700">
                                                {product.categoryName || "—"}
                                            </p>

                                            <div className="text-sm">
                                                {product.offerPrice ? (
                                                    <div>
                                                        <span className="font-medium text-gray-400 line-through">
                                                            ₹{product.price}
                                                        </span>
                                                        <span className="ml-1.5 font-bold text-green-600">
                                                            ₹
                                                            {product.offerPrice}
                                                        </span>
                                                        <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                                                            {Math.round(
                                                                ((product.price -
                                                                    product.offerPrice) /
                                                                    product.price) *
                                                                    100
                                                            )}
                                                            % off
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-gray-900">
                                                        ₹{product.price}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-3 md:justify-end">
                                                <Link
                                                    href={`/stores/${store.slug}/products/${product.id}`}
                                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                                >
                                                    View
                                                </Link>

                                                <button
                                                    type="button"
                                                    disabled={isActionLoading}
                                                    onClick={() =>
                                                        toggleProductStatus(
                                                            product
                                                        )
                                                    }
                                                    className="text-sm font-semibold text-gray-700 hover:text-gray-950 disabled:cursor-not-allowed disabled:text-gray-300"
                                                >
                                                    {product.isActive
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isActionLoading}
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product.id
                                                        )
                                                    }
                                                    className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
