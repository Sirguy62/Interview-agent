import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { answer } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "Classify the candidate's answer. Respond with only one word: WEAK, OK, or STRONG.",
      },
      { role: "user", content: answer },
    ],
  });

  return NextResponse.json({
    performance: completion.choices[0].message.content.trim(),
  });
}
