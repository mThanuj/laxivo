import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { db } from "@/lib/db";
import { stores } from "@/db/schema";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getAllTemplateKeysSync } from "@/lib/templateLoader";

export async function PUT(request: NextRequest) {
  try {
    const currentUser = getAuthUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      description,
      logoUrl,
      bannerUrl,
      contactEmail,
      contactPhone,
      location,
      template,
      themeColor,
      isPublished,
    } = body;

    if (
      !name ||
      !slug ||
      !description ||
      !contactEmail ||
      !contactPhone ||
      !location
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required store fields.",
        },
        { status: 400 },
      );
    }

    if (template && !getAllTemplateKeysSync().includes(template)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid template selected.",
        },
        { status: 400 },
      );
    }

    const normalizedSlug = String(slug)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!normalizedSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Store slug is invalid.",
        },
        { status: 400 },
      );
    }

    const [duplicateStore] = await db
      .select()
      .from(stores)
      .where(
        and(
          eq(stores.slug, normalizedSlug),
          ne(stores.ownerId, Number(currentUser.userId)),
        ),
      )
      .limit(1);

    if (duplicateStore) {
      return NextResponse.json(
        {
          success: false,
          message: "This slug is already used by another store.",
        },
        { status: 409 },
      );
    }

    const [updatedStore] = await db
      .update(stores)
      .set({
        name: String(name).trim(),
        slug: normalizedSlug,
        description: String(description).trim(),
        logoUrl: String(logoUrl || "").trim(),
        bannerUrl: String(bannerUrl || "").trim(),
        contactEmail: String(contactEmail).trim().toLowerCase(),
        contactPhone: String(contactPhone).trim(),
        location: String(location).trim(),
        template: template || "classic",
        themeColor: themeColor || "#16a34a",
        isPublished: Boolean(isPublished),
        updatedAt: new Date(),
      })
      .where(eq(stores.ownerId, Number(currentUser.userId)))
      .returning();

    if (!updatedStore) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Store updated successfully.",
      store: {
        id: updatedStore.id,
        ownerId: updatedStore.ownerId,
        name: updatedStore.name,
        slug: updatedStore.slug,
        description: updatedStore.description,
        logoUrl: updatedStore.logoUrl,
        bannerUrl: updatedStore.bannerUrl,
        contactEmail: updatedStore.contactEmail,
        contactPhone: updatedStore.contactPhone,
        location: updatedStore.location,
        template: updatedStore.template,
        themeColor: updatedStore.themeColor,
        isPublished: updatedStore.isPublished,
      },
    });
  } catch (error) {
    console.error("Store update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update store.",
      },
      { status: 500 },
    );
  }
}
