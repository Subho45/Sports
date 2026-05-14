import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
