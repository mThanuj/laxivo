import {
    pgTable,
    serial,
    varchar,
    boolean,
    doublePrecision,
    timestamp,
    uniqueIndex,
    foreignKey,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
    "user",
    {
        id: serial("id").primaryKey(),
        name: varchar("name").notNull(),
        email: varchar("email").notNull().unique(),
        passwordHash: varchar("password_hash").notNull(),
        role: varchar("role").default("OWNER").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        emailIdx: uniqueIndex("user_email_idx").on(table.email),
    })
);

export const stores = pgTable(
    "store",
    {
        id: serial("id").primaryKey(),
        ownerId: serial("owner_id").notNull(),
        name: varchar("name").notNull(),
        slug: varchar("slug").notNull().unique(),
        description: varchar("description").notNull(),
        logoUrl: varchar("logo_url").notNull(),
        bannerUrl: varchar("banner_url").notNull(),
        contactEmail: varchar("contact_email").notNull(),
        contactPhone: varchar("contact_phone").notNull(),
        location: varchar("location").notNull(),
        template: varchar("template").default("classic").notNull(),
        themeColor: varchar("theme_color").default("#2563eb").notNull(),
        isPublished: boolean("is_published").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        ownerIdIdx: index("store_owner_id_idx").on(table.ownerId),
        slugIdx: uniqueIndex("store_slug_idx").on(table.slug),
        ownerFk: foreignKey({
            columns: [table.ownerId],
            foreignColumns: [users.id],
            name: "store_owner_id_fk",
        }).onDelete("cascade"),
    })
);

export const categories = pgTable(
    "category",
    {
        id: serial("id").primaryKey(),
        storeId: serial("store_id").notNull(),
        name: varchar("name").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        storeIdIdx: index("category_store_id_idx").on(table.storeId),
        storeFk: foreignKey({
            columns: [table.storeId],
            foreignColumns: [stores.id],
            name: "category_store_id_fk",
        }).onDelete("cascade"),
        uniqueNamePerStore: uniqueIndex("category_store_name_idx").on(
            table.storeId,
            table.name
        ),
    })
);

export const products = pgTable(
    "product",
    {
        id: serial("id").primaryKey(),
        storeId: serial("store_id").notNull(),
        name: varchar("name").notNull(),
        description: varchar("description"),
        price: doublePrecision("price").default(0).notNull(),
        offerPrice: doublePrecision("offer_price"),
        imageUrl: varchar("image_url").notNull(),
        categoryId: serial("category_id"),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        storeIdIdx: index("product_store_id_idx").on(table.storeId),
        categoryIdIdx: index("product_category_id_idx").on(table.categoryId),
        storeFk: foreignKey({
            columns: [table.storeId],
            foreignColumns: [stores.id],
            name: "product_store_id_fk",
        }).onDelete("cascade"),
    })
);

export const usersRelations = relations(users, ({ many }) => ({
    stores: many(stores),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
    owner: one(users, {
        fields: [stores.ownerId],
        references: [users.id],
    }),
    products: many(products),
    categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    store: one(stores, {
        fields: [categories.storeId],
        references: [stores.id],
    }),
    products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
    store: one(stores, {
        fields: [products.storeId],
        references: [stores.id],
    }),
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
}));
