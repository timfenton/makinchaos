import { integer, numeric, PgColumn, pgEnum, pgTable, PgTableWithColumns, serial, text, timestamp } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq, desc, asc, or, SQL } from 'drizzle-orm/sql';
import { users } from './users';
import { OrderByOperators, getTableColumns, ColumnsWithTable, relations } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';
import { getItemsPaged, OrderBy, PagedResponse } from '@/lib/utils';

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

export async function getOrders(
  where?: SQL<unknown>,
  orderBy?: OrderBy<SelectOrders>,
  page?: number,
  limit?: number,
): Promise<PagedResponse<SelectOrders>> {
  const productResult = await getItemsPaged(orders, where, orderBy, page, limit);

  return productResult;
}

export async function deleteOrderById(id: number) {
  await db.delete(orders).where(eq(orders.id, id));
}
