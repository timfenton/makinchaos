import { numeric, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq, or } from 'drizzle-orm/sql';
import { relations } from 'drizzle-orm';
import { productsToOrders } from './productsToOrders';
import { filamentsToProducts } from './filamentsToProducts';
import { fontsToProducts } from './fontsToProducts';

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
): Promise<{
  products: SelectProduct[];
  nextPage: number | null;
  totalPages: number;
  totalProducts: number;
}> {
  let totalProducts = await db.select({ count: count() }).from(products);

  const currentPage = page ?? 1;
  const currentPageIndex = currentPage - 1;
  const resultLimit = (limit || 1000);

  const offset = (currentPageIndex * resultLimit);
  const nextPage = totalProducts[0].count > (currentPage * resultLimit) ? currentPage + 1 : null;

  const productResult = search ? 
    await db
      .select()
      .from(products)
      .where(or(ilike(products.description, `%${search}%`)))
      .offset(offset)
      .limit(resultLimit) 
    : 
    await db.select().from(products).limit(resultLimit).offset(offset);

  return {
    products: productResult,
    nextPage: nextPage,
    totalPages: Math.ceil(totalProducts[0].count / resultLimit),
    totalProducts: totalProducts[0].count
  };
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

