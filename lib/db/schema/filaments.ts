import { pgEnum, pgTable, serial, text, boolean } from "drizzle-orm/pg-core";
import db from "../db";
import { eq, relations } from "drizzle-orm";
import { filamentsToProducts } from "./filamentsToProducts";

export const filamentCategories = pgEnum('filament_categories', ['glitter', 'silk', 'tri_color', 'duo_color', 'shimmer', 'solid', 'rainbows'])

export const filaments = pgTable('filaments', {
  id: serial().primaryKey(),
  isActive: boolean().default(true),
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  tags: text().array(),
  category: filamentCategories().notNull()
});

export const filamentsRelations = relations(filaments, ({many}) => ({
    products: many(filamentsToProducts)
}));

export type SelectFilament = typeof filaments.$inferSelect;
export type NewFilament = typeof filaments.$inferInsert;

export async function getFilaments() {
    return await db
    .select()
    .from(filaments)
}

export async function insertFilament(filament: NewFilament) {
    return db.insert(filaments).values(filament);
}

export async function updateFilament(id: number, filamentUpdates: Omit<Partial<NewFilament>,'id'>) {
    const updatedFilament = await db
        .update(filaments)
        .set(filamentUpdates)
        .where(eq(filaments.id, id))
        .returning();

    return updatedFilament;
}

export async function deleteFilament(id: number) {
    const deletedFilament = await db
        .delete(filaments)
        .where(eq(filaments.id, id))
        .returning({deletedId: filaments.id});

    return deletedFilament;
}