import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { lastAnswer, summary } = await req.json();

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a professional interviewer. Ask exactly ONE concise follow-up question.",
        },
        {
          role: "user",
          content: `
Conversation so far:
${summary || "None"}

Latest answer:
${lastAnswer}
          `,
        },
      ],
    });

    const question = res.output_text || res.output?.[0]?.content?.[0]?.text;

    return NextResponse.json({
      question: question || "Can you explain that a bit more?",
    });
  } catch (err) {
    console.error("next-question error:", err);

    // 🔑 NEVER throw, NEVER 500
    return NextResponse.json({
      question: "Let’s continue. Can you walk me through that again?",
      error: "AI_FAILED",
    });
  }
}
