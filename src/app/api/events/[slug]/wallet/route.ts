import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Wallet pass generation coming soon. Use the calendar download instead.", fallback: "calendar" },
    { status: 503 }
  );
}
