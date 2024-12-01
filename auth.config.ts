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
  callbacks: {
    jwt({token, user, account, profile, trigger, session}) {
      console.log('the token is', token);
      console.log('the user is', user);
      console.log('the account is', account);
      console.log('the profile is', profile);
      console.log('the trigger is', trigger);
      console.log('the session is', session);
      return token;
    },
    session({session, user, token, trigger}){
      console.log('the token is', token);
      console.log('the user is', user);
      console.log('the trigger is', trigger);
      console.log('the session is', session);
      return session;
    },
    signIn({ user, account, profile }){
      console.log('the user is', user);
      console.log('the account is', account);
      console.log('the profile is', profile);
      return true;
    }
  },
  pages: {
    signIn: '/signin',
  }
} satisfies NextAuthConfig;

export default authConfig;
