import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { previousSummary, answer } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "Summarize the candidate's answer into 2–3 concise bullet points. Focus on skills, correctness, and depth.",
      },
      {
        role: "user",
        content: `
Previous summary:
${previousSummary || "None"}

Candidate answer:
${answer}
        `,
      },
    ],
  });

  return NextResponse.json({
    summary: completion.choices[0].message.content,
  });
}
