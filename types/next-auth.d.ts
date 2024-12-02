import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  export interface User{
    facebookId?: string;
  }
  export interface Session {
    user: User & DefaultSession
  } 
}
