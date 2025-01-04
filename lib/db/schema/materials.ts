import { pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core";
import db from "../db";
import { eq, relations, sql, ilike, SQL, desc, asc } from "drizzle-orm";
import { materialsToProducts } from "./materialsToProducts";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { materialTypes } from "./materialTypes";

export const materials = pgTable('materials', {
  id: serial().primaryKey(),
  isActive: boolean().default(true),
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  buyUrl: text(),
  stock: integer().notNull().default(1),
  tags: text().array(),
  categories: text().array().notNull(),
  materialTypeId: integer().notNull(),
}, );

export const materialsRelations = relations(materials, ({many, one}) => ({
    products: many(materialsToProducts),
    materialType: one(materialTypes, {
        fields: [materials.materialTypeId],
        references: [materialTypes.id],
    })
}));

export type SelectMaterial = typeof materials.$inferSelect;
export type NewMaterial = typeof materials.$inferInsert;
export enum SortableFields {
    Name = 'name',
}

export const sortColumnsMapping: Record<string, any> = {
    'name': materials.name,
}

export const createMaterialSchema = createInsertSchema(materials, {
    tags: z.array(z.string()),
});

export interface SortBy { 
    column: SortableFields,
    dir?: 'asc' | 'desc',
}

export interface MaterialFilters {
    search?: string;
    materialType?: number;
    categories?: string;
    tags?: string;
}

export async function getMaterials(filters?: MaterialFilters, sortBy?: SortBy) {
    
    let categoryFilter: SQL<unknown>[] | undefined = undefined;
    let tagFilter: SQL<unknown>[] | undefined = undefined;
    
    if(filters)
    {
        categoryFilter = filters.categories && filters.categories !== ''
            ? filters.categories
                .split('.').map((row) => sql`${row}`)
            : undefined;

        tagFilter = filters.tags && filters.tags !== ''
                ? filters.tags
                    .split('.').map((row) => sql`${row}`)
                : undefined;
    }

    const query = db.select().from(materials).leftJoin(materialTypes, eq(materials.materialTypeId, materialTypes.id));

    if(categoryFilter)
        query.where(
            sql`categories::text[] && ARRAY[${sql.join(categoryFilter, ', ')}]::text[]`
        );

    if(filters?.search)
        query.where(ilike(materials.name, `%${filters.search}%`));

    if(tagFilter)
        query.where(
            sql`tags::text[] && ARRAY[${sql.join(tagFilter, ', ')}]::text[]`
        );

    if(filters?.materialType)
        query.where(eq(materialTypes.id, filters.materialType))

    if(sortBy)
    {
        let sortDirection = asc;

        if(sortBy.dir) sortDirection = sortBy.dir === 'asc' ? asc : desc;

        query.orderBy(sortDirection(sortColumnsMapping[sortBy.column]))
    } else {
        query.orderBy(asc(materials.name))
    }

    const materialData = await query;

    return {
        data: materialData,
        totalMaterials: materialData.length,
    }
}

export async function getMaterialByName( name: string ) {
    const materialData = await db
    .select()
    .from(materials)
    .where(ilike(materials.name, `%${name}%`));

    return {
        data: materialData.length > 0 ? materialData[0] : null,
        found: !!materialData && materialData.length > 0
    }
}

export async function getMaterialById( id: string ) {
    const materialId = parseInt(id);

    if(isNaN(materialId)) return {
        data: null,
        found: false
    }; 

    const materialData = await db
    .select()
    .from(materials)
    .where(eq(materials.id, materialId));

    return {
        data: materialData.length > 0 ? materialData[0] : null,
        found: !!materialData && materialData.length > 0
    }
}

export async function incrementMaterialStock(id: number, amount: number)
{
    return await db
        .update(materials)
        .set({
            stock: sql`GREATEST(${materials.stock} + ${amount}, 0)`,
        })
        .where(eq(materials.id, id))
}

export async function insertMaterial(material: NewMaterial) {
    const insertedMaterial = await db.insert(materials).values(material);

    return insertedMaterial;
}

export async function updateMaterial(id: number, materialUpdates: Omit<Partial<NewMaterial>,'id'>): Promise<SelectMaterial[]> {
    const updatedMaterial = await db
        .update(materials)
        .set(materialUpdates)
        .where(eq(materials.id, id))
        .returning();

    return updatedMaterial;
}

export async function deleteMaterial(id: number) {
    const deletedMaterial = await db
        .delete(materials)
        .where(eq(materials.id, id))
        .returning({deletedId: materials.id});

    return deletedMaterial;
}