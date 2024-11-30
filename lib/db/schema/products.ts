import { numeric, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq } from 'drizzle-orm/sql';
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

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

