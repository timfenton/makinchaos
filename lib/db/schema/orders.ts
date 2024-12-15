import { integer, numeric, pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import db from '../db'
import { eq, asc, SQL, desc } from 'drizzle-orm/sql';
import { users } from './users';
import { AnyColumn, relations, TableConfig } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';
import { enumToPgEnum, getItemsPaged, PagedResponse } from '@/lib/utils';
import { products } from './products';

export enum OrderStatus {
  NEW = 'new_order',
  IN_PROGRESS = 'in_progress',
  AWAITING_SHIPMENT = 'awaiting_shipment',
  GENERATED_TRACKING = 'generated_tracking',
  SHIPPED = 'shipped',
  COMPLETED = 'completed'
}

export enum OrderPaidStatus {
  PAID = 'order_paid',
  NOT_PAID = 'not_paid',
  NEEDS_PRICE = 'needs_price'
}

export const orderStatusEnum = pgEnum('status', enumToPgEnum(OrderStatus));
export const orderPaidStatus = pgEnum('paid', enumToPgEnum(OrderPaidStatus));

export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  customerId: integer().notNull(), 
  status: orderStatusEnum().notNull(),
  orderPaid: orderPaidStatus().notNull(),
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
  return await getItemsPaged(orders, eq(orders.customerId, customerId), { column: orders.submitted, direction: asc});
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
  orderBy?: {column: AnyColumn, direction: typeof asc | typeof desc},
  page?: number,
  limit?: number,
): Promise<PagedResponse<TableConfig>> {
  const productResult = await getItemsPaged(orders, where, orderBy, page, limit);

  return productResult;
}

export async function deleteOrderById(id: number) {
  await db.delete(orders).where(eq(orders.id, id));
}
