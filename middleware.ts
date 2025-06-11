import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Since we can't access localStorage in middleware, we'll let the client-side handle the auth check
  // The documents page will handle the redirect if no token is found
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/documents/:path*',
}; 