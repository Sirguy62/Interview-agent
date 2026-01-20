import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  // ✅ REQUIRED in Next.js 16
  const { id: interviewId } = await params;

  if (!interviewId) {
    return NextResponse.json(
      { error: "Missing interview ID" },
      { status: 400 }
    );
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      transcript: true,
      definition: true,
    },
  });

  if (!interview || !interview.transcript) {
    return NextResponse.json(
      { error: "Transcript not available" },
      { status: 400 }
    );
  }

  // 🔥 MVP AI evaluation (replace with GPT later)
  const scorecard = await prisma.scorecard.create({
    data: {
      interviewId,
      overallScore: 78,
      recommendation: "MAYBE",
      strengths:
        "Good understanding of React fundamentals, hooks, and component structure.",
      weaknesses:
        "Needs improvement in performance optimization and advanced state management.",

      // ✅ REQUIRED BY PRISMA
      rubricResults: {},
    },
  });

  return NextResponse.json(scorecard);
}
