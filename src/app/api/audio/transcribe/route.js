import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60_000, // ⏱ 60s hard timeout
});

async function transcribeWithRetry(file, retries = 3) {
  try {
    return await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });
  } catch (err) {
    if (retries === 0) throw err;

    console.warn("🔁 Whisper retrying…", retries);
    await new Promise((r) => setTimeout(r, 1500));
    return transcribeWithRetry(file, retries - 1);
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const blob = formData.get("file");

    if (!blob) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const file = new File([buffer], "audio.webm", {
      type: "audio/webm",
    });

    const transcription = await transcribeWithRetry(file);

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error("🔥 Whisper failed permanently:", err);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
