"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        try {
            setIsLoggingOut(true);

            await fetch("/api/auth/logout", {
                method: "POST",
            });

            router.push("/login");
            router.refresh();
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
    );
}
