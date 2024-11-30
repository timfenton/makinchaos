import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./products";
import { fonts } from "./fonts";

export const fontsToProducts = pgTable(
    'fonts_to_products',
    {
      productId: integer('product_id')
        .notNull()
        .references(() => products.id),
      fontId: integer('font_id')
        .notNull()
        .references(() => fonts.id),
    },
    (t) => ({
      pk: primaryKey({ columns: [t.productId, t.fontId] }),
    }),
  );