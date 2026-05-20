import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Get recent signups
    const recentSignups = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        fullName: true,
        role: true,
        createdAt: true
      }
    });

    // 2. Get recent registration attempts
    const recentRegistrations = await prisma.athleteRegistration.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        fullName: true,
        createdAt: true,
        status: true,
        paymentStatus: true
      }
    });

    // 3. Combine and format
    const activities = [
      ...recentSignups.map(user => ({
        type: 'SIGNUP',
        message: `${user.fullName} joined as ${user.role}`,
        timestamp: user.createdAt
      })),
      ...recentRegistrations.map(reg => ({
        type: 'REGISTRATION',
        message: `${reg.fullName} submitted a registration (${reg.paymentStatus})`,
        timestamp: reg.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error("Admin Activities Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
