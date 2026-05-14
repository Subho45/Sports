import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/Mobile and password required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { mobileNumber: identifier }] }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: "Account not verified. Please verify OTP.", unverified: true, email: user.email }, { status: 403 });
    }

    const token = await signToken({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
