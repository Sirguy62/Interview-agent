import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const interviewId = formData.get("interviewId");

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  await prisma.transcript.upsert({
    where: { interviewId },
    update: {
      rawText: { append: transcription.text },
    },
    create: {
      interviewId,
      rawText: transcription.text,
      segments: [],
    },
  });

  return NextResponse.json({ success: true });
}
