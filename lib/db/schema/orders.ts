import { integer, numeric, pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import db from '../db'
import { eq, asc, SQL } from 'drizzle-orm/sql';
import { users } from './users';
import { relations, TableConfig } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';
import { getItemsPaged, OrderBy, PagedResponse } from '@/lib/utils';
import { products } from './products';

export const statusEnum = pgEnum('status', ['placed', 'in_progress', 'shipped', 'completed']);
export const paidEnum = pgEnum('paid', ['paid', 'not_paid', 'needs_price']);

export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  customerId: integer().notNull(), 
  status: statusEnum().notNull(),
  orderPaid: paidEnum().notNull(),
  price: numeric({ precision: 10, scale: 2 }),
  submitted: timestamp().defaultNow()
});

export const ordersRelations = relations(orders, ({one, many}) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  products: many(productsToOrders),
}));

export type SelectOrders = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export async function getOrdersForCustomer(customerId: number) {
  return await getItemsPaged(orders, eq(orders.customerId, customerId), { column: 'submitted', direction: asc});
}

export async function getOrdersWithProducts() {
  const ordersWithProductsAndUsers = await db
    .select()
    .from(orders)
    .leftJoin(productsToOrders, eq(productsToOrders.orderId, orders.id))
    .leftJoin(products, eq(products.id, productsToOrders.productId))
    .leftJoin(users, eq(orders.customerId, users.id));

  return ordersWithProductsAndUsers;
}

export async function getOrders(
  where?: SQL<unknown>,
  orderBy?: OrderBy<SelectOrders>,
  page?: number,
  limit?: number,
): Promise<PagedResponse<TableConfig>> {
  const productResult = await getItemsPaged(orders, where, orderBy, page, limit);

  return productResult;
}

export async function deleteOrderById(id: number) {
  await db.delete(orders).where(eq(orders.id, id));
}
