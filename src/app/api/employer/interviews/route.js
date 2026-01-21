import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const interviews = await prisma.interview.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      candidate: true,
      definition: true,
      scorecard: true,
    },
  });

  return NextResponse.json(interviews);
}
