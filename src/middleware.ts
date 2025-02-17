import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Custom redirection logic
    if (req.nextUrl.pathname === '/') {
      const url = new URL('/auth/sign-in/', req.url);
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Protect routes by checking token
    },
  }
);

// Apply the middleware to specific routes
export const config = {
  matcher: ['/', '/protected-route/(.*)'], // Adjust to your protected routes
};
