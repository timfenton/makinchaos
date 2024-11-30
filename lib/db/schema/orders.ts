import { integer, numeric, PgColumn, pgEnum, pgTable, PgTableWithColumns, serial, text, timestamp } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq, desc, asc } from 'drizzle-orm/sql';
import { users } from './users';
import { OrderByOperators, getTableColumns, ColumnsWithTable, relations } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';

export const statusEnum = pgEnum('status', ['placed', 'in_progress', 'shipped', 'completed']);
export const paidEnum = pgEnum('paid', ['paid', 'not_paid', 'needs_price']);

export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  customerId: integer().notNull(), 
  status: statusEnum().notNull(),
  orderPaid: paidEnum().notNull(),
  price: numeric({ precision: 10, scale: 2 }),
});

export const ordersRelations = relations(orders, ({one, many}) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  products: many(productsToOrders),
}));

export type SelectOrder = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export async function getOrders(
  orderBy: 
): Promise<{
  orders: SelectOrder[];
  newOffset: number | null;
  totalOrders: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      orders: await db
        .select()
        .from(orders)
        .where(ilike(orders.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalOrders: 0
    };
  }

  if (offset === null) {
    return { orders: [], newOffset: null, totalOrders: 0 };
  }

  let totalOrders = await db.select({ count: count() }).from(orders);
  let moreOrders = await db.select().from(orders).limit(5).offset(offset);
  let newOffset = moreOrders.length >= 5 ? offset + 5 : null;

  return {
    orders: moreOrders,
    newOffset,
    totalOrders: totalOrders[0].count
  };
}

export async function deleteOrderById(id: number) {
  await db.delete(orders).where(eq(orders.id, id));
}
