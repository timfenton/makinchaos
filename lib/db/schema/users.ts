import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq, or } from 'drizzle-orm/sql';
import { relations } from 'drizzle-orm';
import { orders } from './orders';

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);
export const roleEnum = pgEnum('role', ['admin', 'customer']);

export const users = pgTable('users', {
  id: serial().primaryKey(),
  roles: roleEnum().array().default(['customer']),
  facebookId: text().notNull().unique(),
  email: text().notNull(),
  firstName: text().notNull(),
  lastName: text().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export type SelectUser = typeof users.$inferSelect;

export async function getUserByFbId(
    facebookId: string,
): Promise<SelectUser | null> {
    const userResult = await db
    .select()
    .from(users)
    .where(eq(users.facebookId, facebookId));

    if(!userResult || userResult.length < 1)
        return null;

    return userResult[0];
}

export async function getUsers(
  search: string,
  page?: number,
  limit?: number
): Promise<{
  users: SelectUser[];
  nextPage: number | null;
  totalPages: number;
  totalUsers: number;
}> {
  let totalUsers = await db.select({ count: count() }).from(users);

  const currentPage = page ?? 1;
  const currentPageIndex = currentPage - 1;
  const resultLimit = (limit || 1000);

  const offset = (currentPageIndex * resultLimit);
  const nextPage = totalUsers[0].count > (currentPage * resultLimit) ? currentPage + 1 : null;

  const userResult = search ? 
    await db
      .select()
      .from(users)
      .where(or(ilike(users.email, `%${search}%`), ilike(users.firstName, `%${search}%`), ilike(users.lastName, `%${search}%`)))
      .offset(offset)
      .limit(resultLimit) 
    : 
    await db.select().from(users).limit(resultLimit).offset(offset);

  return {
    users: userResult,
    nextPage: nextPage,
    totalPages: Math.ceil(totalUsers[0].count / resultLimit),
    totalUsers: totalUsers[0].count
  };
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}
