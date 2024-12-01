import { numeric, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq, or } from 'drizzle-orm/sql';
import { relations, TableConfig } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';
import { filamentsToProducts } from './filamentsToProducts';
import { fontsToProducts } from './fontsToProducts';
import { getItemsPaged, PagedResponse } from '@/lib/utils';

export const statusEnum = pgEnum('status', ['new_order', 'in_progress', 'awaiting_shipment', 'shipped', 'completed']);

export const products = pgTable('products', {
  id: serial().primaryKey(),
  status: statusEnum().notNull(),
  price: numeric({ precision: 10, scale: 2 }),
  description: text().notNull(),
  petsName: text(),
  font: text(),
});

export const productsRelations = relations(products, ({many}) => ({
  filaments: many(filamentsToProducts),
  fonts: many(fontsToProducts),
  orders: many(productsToOrders),
}));

export type SelectProduct = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export async function getProducts(
  search: string,
  page?: number,
  limit?: number
): Promise<PagedResponse<TableConfig>> {

  const productResult = await getItemsPaged(products, ilike(products.description, `%${search}%`), undefined, page, limit);

  return productResult;
}

export async function updateProduct( id: number, product: Omit<Partial<NewProduct>, 'id'>){
  return await db
    .update(products)
    .set(product)
    .where(eq(products.id, id))
    .returning()
}

export async function createProduct( product: NewProduct ) {
  return await db
    .insert(products)
    .values(product)
    .returning();
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

