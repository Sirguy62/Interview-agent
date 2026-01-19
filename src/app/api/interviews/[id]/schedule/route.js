import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id: interviewId } = await params; // ✅ REQUIRED in Next 16
    const { scheduledAt, timezone } = await req.json();

    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        scheduledAt: date,
        timezone,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json(interview);
  } catch (err) {
    console.error("Schedule error:", err); // 🔥 now you'll see it
    return NextResponse.json(
      { error: "Failed to schedule interview" },
      { status: 500 }
    );
  }
}
