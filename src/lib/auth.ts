import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, mobileNumber: true, role: true, isVerified: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
