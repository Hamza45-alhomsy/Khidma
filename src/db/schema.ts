import {
  pgTable,
  text,
  varchar,
  boolean,
  pgEnum,
  uuid,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { Relation } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["admin", "client"]);
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  fullName: varchar("full_name", { length: 100 }).unique().notNull(),
  phone: varchar("phone", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  role: userRoleEnum("role").default("client").notNull(),
  city: varchar("city", { length: 100 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
//Categeoris table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameAr: varchar("name_ar").notNull(),
  description: text("description"),
  updatedAt: timestamp().defaultNow().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
    budgetSyp: integer("budget_syp"), // Syrian Pounds (optional price guide)
    titleEn: varchar("title_en", { length: 100 }).notNull(),
    titleAr: varchar("title_ar").notNull(),
    description: text("description"),
    city: varchar("city", { length: 100 }),

    updatedAt: timestamp().defaultNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    cityCatIdx: index("services_city_cat_idx").on(table.city, table.categoryId), //these will make searching faster
    userIdx: index("services_user_idx").on(table.userId),
  }),
);
