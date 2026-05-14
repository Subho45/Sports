import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updatedAthlete = await prisma.athleteRegistration.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updatedAthlete });
  } catch (error: any) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
