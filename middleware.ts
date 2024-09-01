import NextAuth from 'next-auth';
import { i18nRouter } from 'next-i18n-router';

import { i18nConfig } from '@/app/i18n/data/i18n.constants';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authConfig from '@/auth/config';

const { auth } = NextAuth(authConfig);

const protectedRoutes = ['/restful', '/graphql', '/requestsHistory'];
const unprotectedRoutes = ['/signin'];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (!session && isProtectedRoute) {
    const absoluteURL = new URL(
      `/sign-in?callbackUrl=${request.nextUrl.href}`,
      request.nextUrl.origin
    );

    return NextResponse.redirect(absoluteURL.toString());
  }

  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL('/', request.nextUrl.origin);

    return NextResponse.redirect(absoluteURL.toString());
  }

  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico).*)'],
};
