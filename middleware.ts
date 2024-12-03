// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { Role } from './lib/db/schema/users';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if(req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/admin'))
  {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    if(!req.auth.user.roles?.includes(Role.ADMIN) && req.nextUrl.pathname.startsWith('/admin'))
    {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
});

export const config = { matcher: '/:path*', };
