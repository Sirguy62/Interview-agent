import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  // ✅ MUST await params
  const { id: interviewId } = await params;

  if (!interviewId) {
    return NextResponse.json(
      { error: "Missing interview ID" },
      { status: 400 }
    );
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { session: true },
  });

  if (!interview || !interview.session) {
    return NextResponse.json(
      { error: "Interview not active" },
      { status: 400 }
    );
  }

  if (interview.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Interview already completed" },
      { status: 409 }
    );
  }

  await prisma.interviewSession.update({
    where: { interviewId },
    data: { endedAt: new Date() },
  });

  await prisma.interview.update({
    where: { id: interviewId },
    data: { status: "COMPLETED" },
  });

  await prisma.transcript.create({
    data: {
      interviewId,
      rawText:
        "Candidate introduced themselves, discussed frontend experience with React, hooks, and performance optimization.",
      segments: [],
    },
  });

  // ✅ correct internal fetch
  await fetch(new URL(`/api/interviews/${interviewId}/evaluate`, req.url), {
    method: "POST",
  });

  return NextResponse.json({ success: true });
}
