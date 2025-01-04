// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { Role } from './lib/db/schema/users';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if(req.nextUrl.pathname.startsWith('/admin'))
  {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    if(!req.auth.user.roles?.includes(Role.ADMIN) && req.nextUrl.pathname.startsWith('/admin'))
    {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/filament')) {
    const apiKey = req.headers.get('X-API-KEY');

    if (apiKey !== process.env.SIRI_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = { matcher: '/:path*', };
