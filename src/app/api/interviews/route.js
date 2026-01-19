import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("POST /api/interviews body:", body);

    const { definitionId, candidateId, timezone } = body;

    if (!definitionId || !candidateId || !timezone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

  const candidate = await prisma.user.upsert({
    where: { email: "guest@candidate.ai" },
    update: {},
    create: {
      email: "guest@candidate.ai",
      role: "CANDIDATE",
    },
  });

  const interview = await prisma.interview.create({
    data: {
      definitionId,
      candidateId: candidate.id,
      timezone,
      scheduledAt: new Date(),
    },
  });


    return NextResponse.json(interview);
  } catch (error) {
    console.error("Interview creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
