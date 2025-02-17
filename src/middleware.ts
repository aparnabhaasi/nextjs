export const runtime = 'experimental-edge';  // Use experimental-edge for rendering

import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default function middleware(req) {
  // Custom redirection for root path
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/sign-in/', req.url));
  }

  // Continue to next-auth's withAuth() middleware
  return withAuth(req);
}

// Apply the middleware to specific routes
export const config = {
  matcher: ['/', '/protected-route/(.*)'], // Adjust for your protected routes
};
