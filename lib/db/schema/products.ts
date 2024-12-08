import { numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';
import db from '../db'
import { ilike, eq } from 'drizzle-orm/sql';
import { relations, TableConfig } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';
import { filamentsToProducts } from './filamentsToProducts';
import { fontsToProducts } from './fontsToProducts';
import { getItemsPaged, PagedResponse } from '@/lib/utils';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const products = pgTable('products', {
  id: serial().primaryKey(),
  price: numeric({ precision: 10, scale: 2 }),
  description: text().notNull(),
  petsName: text(),
  size: text(),
  qty: numeric({precision: 10, scale: 0}),
  font: text(),
});

export const productsRelations = relations(products, ({many}) => ({
  filaments: many(filamentsToProducts),
  fonts: many(fontsToProducts),
  orders: many(productsToOrders),
}));

export const createProductSchema = createInsertSchema(products).extend({
  filamentId: z.number().int().optional().nullable(),
});

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

