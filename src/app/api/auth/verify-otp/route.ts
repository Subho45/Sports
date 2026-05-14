import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and OTP code are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "User is already verified" }, { status: 400 });
    }

    const otp = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() } // Must not be expired
      },
      orderBy: { createdAt: "desc" }
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true }
    });

    // Delete used OTPs
    await prisma.oTP.deleteMany({ where: { userId: user.id } });

    // Generate JWT and set cookie
    const token = await signToken({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, message: "Account verified successfully", role: user.role });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
