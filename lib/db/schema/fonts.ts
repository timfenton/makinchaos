import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core";
import db from "../db";
import { eq, relations } from "drizzle-orm";
import { fontsToProducts } from "./fontsToProducts";

export const fonts = pgTable('fonts', {
  id: serial().primaryKey(),
  isActive: boolean().default(true),
  name: text().notNull(),
  imageUrl: text().notNull(),
  tags: text().array(),
});

export const fontsRelations = relations(fonts, ({many}) => ({
    products: many(fontsToProducts)
}));

export type SelectFont = typeof fonts.$inferSelect;
export type NewFont = typeof fonts.$inferInsert;

export async function getfonts() {
    return await db
    .select()
    .from(fonts)
}

export async function insertFont(font: NewFont) {
    return db.insert(fonts).values(font);
}

export async function updateFont(id: number, fontUpdates: Omit<Partial<NewFont>,'id'>) {
    const updatedFont = await db
        .update(fonts)
        .set(fontUpdates)
        .where(eq(fonts.id, id))
        .returning();

    return updatedFont;
}

export async function deleteFont(id: number) {
    const deletedFont = await db
        .delete(fonts)
        .where(eq(fonts.id, id))
        .returning({deletedId: fonts.id});

    return deletedFont;
}