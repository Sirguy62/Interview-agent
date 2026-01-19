
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const interviewId = params.id;

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

  await prisma.interviewSession.update({
    where: { interviewId },
    data: { endedAt: new Date() },
  });

  await prisma.interview.update({
    where: { id: interviewId },
    data: { status: "COMPLETED" },
  });

  return NextResponse.json({ success: true });
}
