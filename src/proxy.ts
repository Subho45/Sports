import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod'
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Paths that require authentication
  const protectedPaths = ['/register', '/athlete/dashboard', '/admin/dashboard', '/coach/dashboard'];
  
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isProtected) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/athlete/dashboard', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/register/:path*',
    '/athlete/dashboard/:path*',
    '/admin/dashboard/:path*',
    '/coach/dashboard/:path*',
  ],
};
