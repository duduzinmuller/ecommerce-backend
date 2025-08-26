import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  category_id: uuid("category_id").notNull(),
  image_url: text("image_url"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  order_date: timestamp("order_date").notNull().defaultNow(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  delivery_street: varchar("delivery_street", { length: 255 }).notNull(),
  delivery_number: varchar("delivery_number", { length: 20 }).notNull(),
  delivery_neighborhood: varchar("delivery_neighborhood", {
    length: 100,
  }).notNull(),
  delivery_complement: text("delivery_complement"),
  delivery_city: varchar("delivery_city", { length: 100 }).notNull(),
  delivery_state: varchar("delivery_state", { length: 2 }).notNull(),
  delivery_zip_code: varchar("delivery_zip_code", { length: 10 }).notNull(),
});

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const cart_items = pgTable("cart_items", {
  id: uuid("id").primaryKey(),
  cart_id: uuid("cart_id").notNull(),
  product_id: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const order_items = pgTable("order_items", {
  id: uuid("id").primaryKey(),
  order_id: uuid("order_id").notNull(),
  product_id: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unit_price: decimal("unit_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  carts: many(carts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
  cart_items: many(cart_items),
  order_items: many(order_items),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  order_items: many(order_items),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.user_id],
    references: [users.id],
  }),
  cart_items: many(cart_items),
}));

export const cartItemsRelations = relations(cart_items, ({ one }) => ({
  cart: one(carts, {
    fields: [cart_items.cart_id],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cart_items.product_id],
    references: [products.id],
  }),
}));

export const orderItemsRelations = relations(order_items, ({ one }) => ({
  order: one(orders, {
    fields: [order_items.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [order_items.product_id],
    references: [products.id],
  }),
}));
