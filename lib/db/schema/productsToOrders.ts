import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./products";
import { orders } from "./orders";

export const productsToOrders = pgTable(
    'products_to_orders',
    {
      productId: integer('product_id')
        .notNull()
        .references(() => products.id),
      orderId: integer('order_id')
        .notNull()
        .references(() => orders.id),
      qty: integer().default(1),
    },
    (t) => ({
      pk: primaryKey({ columns: [t.productId, t.orderId] }),
    }),
  );