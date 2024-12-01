import { pgTable, integer, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import type { AdapterAccountType } from "next-auth/adapters"

export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    }, (table) => {
        return {
            pk: primaryKey({ columns: [ table.providerAccountId, table.provider ]})
        }
    }
    
  )