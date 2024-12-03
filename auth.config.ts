import { NextAuthConfig } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import db from './lib/db/db';
import { users } from './lib/db/schema/users';
import { accounts } from './lib/db/schema/accounts';
import { sessions } from './lib/db/schema/sessions';
import { PostgresDrizzleAdapter } from './lib/db/drizzleAdapter';

const authConfig = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID ?? '',
      clientSecret: process.env.FACEBOOK_SECRET ?? '',
    }),
  ],
  adapter: PostgresDrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: {
    strategy: 'database'
  },
  callbacks: {
    async jwt({token, user, account, profile, trigger, session}) {
      return token;
    },
    async session({session, user}){
      session.user.roles = user.roles;
      return session;
    },
    async signIn({ user, account, profile }){
      user.facebookId = account?.providerAccountId;
      return true;
    }
  },
  pages: {
    signIn: '/signin',
  }
} satisfies NextAuthConfig;

export default authConfig;
