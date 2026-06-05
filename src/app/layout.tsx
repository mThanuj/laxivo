import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
    title: "Xovio - Build, Launch & Grow Your Online Store",
    description:
        "Create stunning online stores without the hassle. Build, customize and launch you e-commerce business with Xovio's fast, modern storefront builder.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
