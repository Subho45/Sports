import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch registrations for this user
    const registrations = await prisma.athleteRegistration.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        fullName: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        ageGroupApplied: true,
        categoryLevel: true
      }
    });

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error("Athlete Registration Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
