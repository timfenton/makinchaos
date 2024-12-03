import { Role } from '@/lib/db/schema/users';
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  export interface User{
    facebookId?: string;
    roles?: Role[];
  }
  export interface Session {
    user: User & DefaultSession
  } 
}
