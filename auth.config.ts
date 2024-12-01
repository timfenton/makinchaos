import { NextAuthConfig } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import db from './lib/db/db';
import { users } from './lib/db/schema/users';
import { accounts } from './lib/db/schema/accounts';
import { sessions } from './lib/db/schema/sessions';

const authConfig = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID ?? '',
      clientSecret: process.env.FACEBOOK_SECRET ?? '',
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  pages: {
    signIn: '/signin',
  }
} satisfies NextAuthConfig;

export default authConfig;
