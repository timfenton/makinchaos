import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import db from '../db'
import { count, ilike, eq, or } from 'drizzle-orm/sql';
import { relations } from 'drizzle-orm';
import { orders } from './orders';
import { UUID } from 'crypto';
import { enumToPgEnum } from '@/lib/utils';

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export const statusEnum = pgEnum('status', enumToPgEnum(UserStatus));
export const roleEnum = pgEnum('role', enumToPgEnum(Role));

export const users = pgTable('user', {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  roles: roleEnum().array().default([Role.CUSTOMER]),
  facebookId: text().notNull().unique(),
  email: text().notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
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
  search?: string,
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
      .where(or(ilike(users.email, `%${search}%`), ilike(users.name, `%${search}%`)))
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

export async function deleteUserById(id: UUID) {
  await db.delete(users).where(eq(users.id, id));
}
