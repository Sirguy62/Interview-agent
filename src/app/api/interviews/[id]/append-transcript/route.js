import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id: interviewId } = await params;
  const { text, performance, summary } = await req.json();

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { transcript: true },
  });

  if (!interview) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const segment = {
    timestamp: new Date().toISOString(),
    text,
    performance,
    summary,
  };

  // create transcript if missing
  if (!interview.transcript) {
    await prisma.transcript.create({
      data: {
        interviewId,
        rawText: text,
        segments: [segment],
      },
    });
  } else {
    await prisma.transcript.update({
      where: { interviewId },
      data: {
        rawText: interview.transcript.rawText + "\n\n" + text,
        segments: {
          push: segment,
        },
      },
    });
  }

  return NextResponse.json({ ok: true });
}
