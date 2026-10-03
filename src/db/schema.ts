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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
export const userRoleEnum = pgEnum("user_role", [
  "superadmin",
  "admin",
  "client",
]);
export const currencyEnum = pgEnum("currency", ["SYP", "USD"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  fullName: varchar("full_name", { length: 100 }).unique().notNull(),
  phone: varchar("phone", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  bio: varchar("bio", { length: 700 }),
  role: userRoleEnum("role").default("client").notNull(),
  city: varchar("city", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
//Categeoris table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon"),
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
    budgetAmount: integer("budget_amount"),
    budgetCurrency: currencyEnum("budget_currency").default("SYP"),
    titleEn: varchar("title_en", { length: 100 }),
    titleAr: varchar("title_ar", { length: 100 }).notNull(),
    description: text("description"),
    city: varchar("city", { length: 100 }),
    image: varchar("image"),
    updatedAt: timestamp().defaultNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    cityCatIdx: index("services_city_cat_idx").on(table.city, table.categoryId), //these will make searching faster
    userIdx: index("services_user_idx").on(table.userId),
  }),
);
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
    budgetAmount: integer("budget_amount"),
    budgetCurrency: currencyEnum("budget_currency").default("SYP"),

    titleEn: varchar("title_en", { length: 100 }),
    titleAr: varchar("title_ar").notNull(),
    description: text("description"),
    city: varchar("city", { length: 100 }),

    updatedAt: timestamp().defaultNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    image: varchar("image"),
  },
  (table) => ({
    cityCatIdx: index("tasks_city_cat_idx").on(table.city, table.categoryId), //these will make searching faster
    userIdx: index("tasks_user_idx").on(table.userId),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  services: many(services),
  tasks: many(tasks),
}));
export const categoriesRelations = relations(categories, ({ many }) => ({
  // A category contains many service listings
  services: many(services),
  // A category contains many task requests
  tasks: many(tasks),
}));
export const serviceRelations = relations(services, ({ one }) => ({
  user: one(users, {
    fields: [services.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
}));
export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type NewTask = typeof tasks.$inferInsert;
export type NewUser = typeof users.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
