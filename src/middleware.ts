import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default function middleware(req) {
  // Custom redirection logic
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/sign-in/', req.url));
  }

  // Continue with next-auth middleware
  return withAuth(req);
}

// Configure the matcher for both root and next-auth protected routes
export const config = {
  matcher: ['/', '/protected-route/(.*)'], // Adjust according to your protected routes
};
