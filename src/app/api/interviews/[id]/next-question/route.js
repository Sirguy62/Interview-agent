export async function POST(req, context) {
  const { lastAnswer } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: "You are a live interviewer." },
      { role: "user", content: lastAnswer },
    ],
  });

  return NextResponse.json({
    question: completion.choices[0].message.content,
  });
}
