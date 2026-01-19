import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, props) {
  try {
    const params = await props.params;
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

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Prevent double start
    if (interview.session) {
      return NextResponse.json(interview.session);
    }

    const session = await prisma.interviewSession.create({
      data: {
        interviewId,
        startedAt: new Date(),
      },
    });

    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json(session);
  } catch (err) {
    console.error("Start interview error:", err);
    return NextResponse.json(
      { error: "Failed to start interview" },
      { status: 500 }
    );
  }
}
