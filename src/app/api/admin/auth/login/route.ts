import { NextRequest, NextResponse } from "next/server";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === "admin123") {
      // Create a mock admin session
      const token = await signToken({ userId: 'admin-1', role: 'ADMIN' });
      await setSessionCookie(token);

      return NextResponse.json({ success: true, role: 'ADMIN' });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
