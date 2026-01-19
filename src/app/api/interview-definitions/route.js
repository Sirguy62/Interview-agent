import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const definitions = await prisma.interviewDefinition.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(definitions);
}
