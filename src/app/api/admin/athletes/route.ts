import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const athletes = await prisma.athleteRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: athletes });
  } catch (error) {
    console.error("Failed to fetch athletes:", error);
    return NextResponse.json({ error: "Failed to fetch athletes" }, { status: 500 });
  }
}
