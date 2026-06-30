import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.enum(["host", "organizer", "photographer"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }

    const { userId, email, fullName, role } = parsed.data;

    const profile = await prisma.profile.upsert({
      where: { id: userId },
      update: { email, fullName, role },
      create: { id: userId, email, fullName, role },
    });

    return NextResponse.json({ id: profile.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
