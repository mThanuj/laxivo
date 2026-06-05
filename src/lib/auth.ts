import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Please define JWT_SECRET in your .env.local file");
}

export type AuthTokenPayload = {
    userId: string;
    name: string;
    email: string;
    role: "OWNER" | "ADMIN";
};

export function signAuthToken(payload: AuthTokenPayload) {
    return jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: "7d",
    });
}

export function verifyAuthToken(token: string) {
    return jwt.verify(token, JWT_SECRET as string) as AuthTokenPayload;
}

export function getAuthUserFromRequest(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return null;
    }

    try {
        return verifyAuthToken(token);
    } catch {
        return null;
    }
}
