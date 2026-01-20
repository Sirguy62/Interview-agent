import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { lastAnswer } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are a professional technical interviewer. Ask one concise question at a time.",
      },
      {
        role: "user",
        content: lastAnswer || "Start the interview.",
      },
    ],
  });

  return NextResponse.json({
    question: completion.choices[0].message.content,
  });
}
