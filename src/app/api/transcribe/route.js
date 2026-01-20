import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  const transcript = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return NextResponse.json({ text: transcript.text });
}
