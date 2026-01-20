// /api/jobs/run-evaluations
export async function POST() {
  const pending = await prisma.interview.findMany({
    where: {
      evaluationQueued: true,
      scorecard: null,
    },
  });

  for (const i of pending) {
    await fetch(
      new URL(`/api/interviews/${i.id}/evaluate`, "http://localhost:3000"),
      { method: "POST" }
    );

    await prisma.interview.update({
      where: { id: i.id },
      data: { evaluationQueued: false },
    });
  }

  return NextResponse.json({ processed: pending.length });
}
