import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import db from './db'
import { count, ilike, eq } from 'drizzle-orm/sql';

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  facebookid: text('fbid').notNull().unique(),
  email: statusEnum('email').notNull(),
});

export type SelectUser = typeof users.$inferSelect;

export async function getUserByFbId(
    fbid: string,
): Promise<SelectUser | null> {
    const userResult = await db
    .select()
    .from(users)
    .where(eq(users.facebookid, fbid));

    if(!userResult || userResult.length < 1)
        return null;

    return userResult[0];
}

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
  totalUsers: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      users: await db
        .select()
        .from(users)
        .where(ilike(users.email, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalUsers: 0
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null, totalUsers: 0 };
  }

  let totalUsers = await db.select({ count: count() }).from(users);
  let moreUsers = await db.select().from(users).limit(5).offset(offset);
  let newOffset = moreUsers.length >= 5 ? offset + 5 : null;

  return {
    users: moreUsers,
    newOffset,
    totalUsers: totalUsers[0].count
  };
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}
