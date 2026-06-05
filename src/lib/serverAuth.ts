import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return null;
    }

    try {
        return verifyAuthToken(token);
    } catch {
        return null;
    }
}
