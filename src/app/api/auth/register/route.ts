import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTPVerificationEmail } from "@/lib/email/mailer";

export async function POST(request: NextRequest) {
  console.log("--> API: POST /api/auth/register");
  try {
    const body = await request.json();
    const { fullName, email, mobileNumber, password, role } = body;

    if (!fullName || !email || !mobileNumber || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { mobileNumber }] }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with email or mobile already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = role === 'COACH' ? 'COACH' : 'ATHLETE';

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobileNumber,
        password: hashedPassword,
        role: safeRole,
      }
    });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.oTP.create({
      data: {
        code: otpCode,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });

    // Send OTP via Email
    const emailResult = await sendOTPVerificationEmail(email, otpCode);
    
    if (!emailResult.success) {
      console.warn("⚠️ OTP Email failed to send, but proceeding for dev. OTP is:", otpCode);
    } else {
      console.log("📬 OTP sent to email. Backup for terminal:", otpCode);
    }

    return NextResponse.json({ 
      success: true, 
      message: "User registered. OTP sent." 
    }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
