import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { materials } from "./materials";

export const materialTypes = pgTable('materials', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  categories: text().array(),
  tags: text().array(),
});

export const materialRelations = relations(materialTypes, ({ many }) => ({
  materials: many(materials),
}));