"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/product";

export type SortOption = "default" | "price-high" | "price-low";

export function useProductFilters(products: Product[]) {
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = useMemo(() => {
        const cats = new Set<string>();
        products.forEach((p) => {
            if (p.categoryName) cats.add(p.categoryName);
        });
        return Array.from(cats).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== "all") {
            result = result.filter((p) => p.categoryName === selectedCategory);
        }

        if (sortBy === "price-high") {
            result.sort((a, b) => {
                const priceA = a.offerPrice || a.price;
                const priceB = b.offerPrice || b.price;
                return priceB - priceA;
            });
        } else if (sortBy === "price-low") {
            result.sort((a, b) => {
                const priceA = a.offerPrice || a.price;
                const priceB = b.offerPrice || b.price;
                return priceA - priceB;
            });
        }

        return result;
    }, [products, sortBy, selectedCategory]);

    const groupedProducts = useMemo(() => {
        const groups: { category: string; products: Product[] }[] = [];
        const categoryMap = new Map<string, Product[]>();

        filteredProducts.forEach((product) => {
            const cat = product.categoryName || "Uncategorized";
            if (!categoryMap.has(cat)) {
                categoryMap.set(cat, []);
            }
            categoryMap.get(cat)!.push(product);
        });

        const seenCategories = new Set<string>();
        products.forEach((p) => {
            const cat = p.categoryName || "Uncategorized";
            if (!seenCategories.has(cat) && categoryMap.has(cat)) {
                seenCategories.add(cat);
                groups.push({
                    category: cat,
                    products: categoryMap.get(cat)!,
                });
            }
        });

        return groups;
    }, [filteredProducts, products]);

    return {
        sortBy,
        setSortBy,
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredProducts,
        groupedProducts,
    };
}
