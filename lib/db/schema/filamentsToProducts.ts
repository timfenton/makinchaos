import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./products";
import { filaments } from "./filaments";

export const filamentsToProducts = pgTable(
    'filaments_to_products',
    {
      productId: integer('product_id')
        .notNull()
        .references(() => products.id),
      filamentId: integer('filament_id')
        .notNull()
        .references(() => filaments.id),
    },
    (t) => ({
      pk: primaryKey({ columns: [t.productId, t.filamentId] }),
    }),
  );