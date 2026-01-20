import { NextResponse } from "next/server";

export async function POST(req) {
  const { text } = await req.json();

  const res = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.7,
        },
      }),
    }
  );

  const audio = await res.arrayBuffer();
  return new NextResponse(audio, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
