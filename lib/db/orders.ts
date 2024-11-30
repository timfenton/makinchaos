import { integer, numeric, PgColumn, pgEnum, pgTable, PgTableWithColumns, serial, text, timestamp } from 'drizzle-orm/pg-core';
import db from './db'
import { count, ilike, eq } from 'drizzle-orm/sql';
import { users } from './users';

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customer: one(users, {
    fields: [users.],
    references: [users.id]
  }),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectOrder = typeof orders.$inferSelect;

export async function getOrders(
  search: string,
  offset: number
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
