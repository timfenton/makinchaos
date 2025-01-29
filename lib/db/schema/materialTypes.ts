import { eq, InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { materials } from "./materials";
import { createInsertSchema } from "drizzle-zod";
import db from "../db";

export const materialTypes = pgTable('material_types', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  categories: text().array(),
  tags: text().array(),
});

export const materialRelations = relations(materialTypes, ({ many }) => ({
  materials: many(materials),
}));

export type MaterialType = InferSelectModel<typeof materialTypes>;
export type NewMaterialType = InferInsertModel<typeof materialTypes>;

export const NewMaterialTypeSchema = createInsertSchema(materialTypes);

export async function postMaterialType(newMaterialType: NewMaterialType) {
    if(!!newMaterialType.id)
    {
        await db.update(materialTypes).set(newMaterialType).where(eq(materialTypes.id, newMaterialType.id));
    } else {
        await db.insert(materialTypes).values(newMaterialType);
    }
}

export async function getMaterialTypes(): Promise<MaterialType[]> {
    const result = await db.select().from(materialTypes);
    return result;
}

export async function getMaterialTypeById(id: number) {
  const result = await db.select().from(materialTypes).where(eq(materialTypes.id, id));
  
  if(result && result.length > 0)
    return result[0];

  return null;
}

export async function deleteMaterialType(id: number) {
  const result = await db.delete(materialTypes).where(eq(materialTypes.id, id));
  return result;
}