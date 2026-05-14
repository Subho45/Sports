import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  console.log("--> API: GET /api/auth/me");
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error("ME API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
