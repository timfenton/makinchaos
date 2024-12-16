import { pgEnum, pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core";
import db from "../db";
import { eq, relations, sql, inArray, ilike, SQL, desc, asc } from "drizzle-orm";
import { filamentsToProducts } from "./filamentsToProducts";
import { enumToPgEnum } from "@/lib/utils";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export enum FilamentCategories {
    GLITTER = 'glitter',
    SILK = 'silk',
    TRI_COLOR = 'tri_color',
    DUO_COLOR = 'duo_color',
    SHIMMER = 'shimmer',
    SOLID = 'solid',
    RAINBOW = 'rainbow'
}

export const filamentCategories = pgEnum('filament_categories', enumToPgEnum(FilamentCategories))

export const filaments = pgTable('filaments', {
  id: serial().primaryKey(),
  isActive: boolean().default(true),
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  buyUrl: text(),
  stock: integer().notNull().default(1),
  tags: text().array(),
  category: filamentCategories().notNull()
});

export const filamentsRelations = relations(filaments, ({many}) => ({
    products: many(filamentsToProducts)
}));

export type SelectFilament = typeof filaments.$inferSelect;
export type NewFilament = typeof filaments.$inferInsert;
export enum SortableFields {
    Name = 'name',
}

export const sortColumnsMapping: Record<string, any> = {
    'name': filaments.name,
}

export const createFilamentSchema = createInsertSchema(filaments, {
    tags: z.array(z.string()),
});

export interface SortBy { 
    column: SortableFields,
    dir?: 'asc' | 'desc',
}

export interface FilamentFilters {
    search?: string;
    categories?: string;
    tags?: string;
}

export async function getFilaments(filters?: FilamentFilters, sortBy?: SortBy) {
    
    let categoryFilter: FilamentCategories[] | undefined = undefined;
    let tagFilter: SQL<unknown>[] | undefined = undefined;
    
    if(filters)
    {
        categoryFilter = filters.categories && filters.categories !== ''
            ? filters.categories
                .split('.')
                .filter((cat) => Object.values(FilamentCategories).includes(cat as FilamentCategories))
                .map((cat) => cat as FilamentCategories) // Convert to enum type
            : undefined;

            if (filters.tags && filters.tags !== '') {
                tagFilter = filters.tags.split('.').map((row) => sql`${row}`);
            }
    }

    const query = db.select().from(filaments);

    if(categoryFilter)
        query.where(inArray(filaments.category, categoryFilter));

    if(filters?.search)
        query.where(ilike(filaments.name, `%${filters.search}%`));

    if(tagFilter)
        query.where(
            sql`tags::text[] && ARRAY[${sql.join(tagFilter, ', ')}]::text[]`
        );

    if(sortBy)
    {
        let sortDirection = asc;

        if(sortBy.dir) sortDirection = sortBy.dir === 'asc' ? asc : desc;

        query.orderBy(sortDirection(sortColumnsMapping[sortBy.column]))
    } else {
        query.orderBy(asc(filaments.name))
    }

    const filamentData = await query;

    return {
        data: filamentData,
        totalFilaments: filamentData.length,
    }
}

export async function getFilamentByName( name: string ) {
    const filamentData = await db
    .select()
    .from(filaments)
    .where(ilike(filaments.name, `%${name}%`));

    return {
        data: filamentData.length > 0 ? filamentData[0] : null,
        found: !!filamentData && filamentData.length > 0
    }
}

export async function getFilamentById( id: string ) {
    const filamentId = parseInt(id);

    if(isNaN(filamentId)) return {
        data: null,
        found: false
    }; 

    const filamentData = await db
    .select()
    .from(filaments)
    .where(eq(filaments.id, filamentId));

    return {
        data: filamentData.length > 0 ? filamentData[0] : null,
        found: !!filamentData && filamentData.length > 0
    }
}

export async function incrementFilamentStock(id: number, amount: number)
{
    return await db
        .update(filaments)
        .set({
            stock: sql`GREATEST(${filaments.stock} + ${amount}, 0)`,
        })
        .where(eq(filaments.id, id))
}

export async function insertFilament(filament: NewFilament) {
    const insertedFilament = await db.insert(filaments).values(filament);

    return insertedFilament;
}

export async function updateFilament(id: number, filamentUpdates: Omit<Partial<NewFilament>,'id'>): Promise<SelectFilament[]> {
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