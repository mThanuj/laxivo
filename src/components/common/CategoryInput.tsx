"use client";

import { useState, useEffect, useRef } from "react";

type Category = {
    id: number;
    name: string;
};

type CategoryInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function CategoryInput({ value, onChange }: CategoryInputProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCat = categories.find((c) => String(c.id) === value);

    const displayText = selectedCat?.name ?? searchText;

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const isExisting = categories.some(
        (cat) => cat.name.toLowerCase() === searchText.trim().toLowerCase()
    );

    const shouldShowCreate =
        searchText.trim() !== "" && !isExisting && !loading;

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);
                const response = await fetch("/api/dashboard/categories");
                const result = await response.json();

                if (result.success && result.categories) {
                    setCategories(result.categories);
                }
            } catch {
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleCreateCategory() {
        if (!searchText.trim()) return;

        setCreating(true);
        setError("");

        try {
            const response = await fetch("/api/dashboard/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: searchText.trim() }),
            });

            const result = await response.json();

            if (result.success && result.category) {
                setCategories((prev) => {
                    const exists = prev.some(
                        (c) => c.id === result.category.id
                    );
                    return exists ? prev : [...prev, result.category];
                });
                onChange(String(result.category.id));
                setSearchText("");
                setShowDropdown(false);
            } else {
                setError(result.message || "Failed to create category.");
            }
        } catch {
            setError("Something went wrong.");
        } finally {
            setCreating(false);
        }
    }

    function handleSelectCategory(cat: Category) {
        onChange(String(cat.id));
        setSearchText("");
        setShowDropdown(false);
        setError("");
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                value={displayText}
                onChange={(e) => {
                    if (selectedCat && e.target.value !== selectedCat.name) {
                        onChange("");
                    }
                    setSearchText(e.target.value);
                    setShowDropdown(true);
                    setError("");
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder={
                    loading
                        ? "Loading categories..."
                        : "Search or create category"
                }
                disabled={loading}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
            />

            {displayText && !loading && (
                <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isExisting
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {isExisting ? "Existing" : "New"}
                </span>
            )}

            {showDropdown && (categories.length > 0 || shouldShowCreate) && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                    {filteredCategories.length > 0 && (
                        <div>
                            {filteredCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleSelectCategory(cat)}
                                    className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50 ${
                                        String(cat.id) === value
                                            ? "bg-blue-50 font-semibold text-blue-700"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {shouldShowCreate && (
                        <button
                            type="button"
                            disabled={creating}
                            onClick={handleCreateCategory}
                            className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-3 text-left text-sm font-semibold text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                        >
                            <span>
                                {creating
                                    ? "Creating..."
                                    : `+ Create "${searchText.trim()}"`}
                            </span>
                            {creating && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                            )}
                        </button>
                    )}

                    {filteredCategories.length === 0 &&
                        !shouldShowCreate &&
                        searchText.trim() !== "" && (
                            <p className="px-4 py-3 text-sm text-gray-400">
                                {loading
                                    ? "Loading..."
                                    : "No categories found."}
                            </p>
                        )}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
