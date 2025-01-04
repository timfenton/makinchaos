import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./products";
import { materials } from "./materials";

export const materialsToProducts = pgTable(
    'materials_to_products',
    {
      productId: integer('product_id')
        .notNull()
        .references(() => products.id),
      materialId: integer('material_id')
        .notNull()
        .references(() => materials.id),
    },
    (t) => ({
      pk: primaryKey({ columns: [t.productId, t.materialId] }),
    }),
  );