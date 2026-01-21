import { prisma } from "@/lib/prisma";

export default async function EmployerInterviewDetail({ params }) {
  const { id } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: {
      candidate: true,
      definition: true,
      transcript: true,
      scorecard: true,
    },
  });

  if (!interview) return <div>Not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Interview Review</h1>

      <div className="border rounded p-4">
        <p>
          <b>Role:</b> {interview.definition.role}
        </p>
        <p>
          <b>Candidate:</b> {interview.candidate.email}
        </p>
      </div>

      <div className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Transcript Timeline</h2>

        {interview.transcript?.segments?.map((s, i) => (
          <div key={i} className="border-b pb-2">
            <p className="text-sm opacity-60">{s.timestamp}</p>
            <p>{s.text}</p>
            <p className="text-sm">
              <b>Performance:</b> {s.performance}
            </p>
          </div>
        ))}
      </div>

      <div className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">AI Evaluation</h2>

        {interview.scorecard ? (
          <>
            <p>
              <b>Score:</b> {interview.scorecard.overallScore}
            </p>
            <p>
              <b>Recommendation:</b> {interview.scorecard.recommendation}
            </p>
            <p>
              <b>Strengths:</b> {interview.scorecard.strengths}
            </p>
            <p>
              <b>Weaknesses:</b> {interview.scorecard.weaknesses}
            </p>
          </>
        ) : (
          <p>Evaluation pending…</p>
        )}
      </div>
    </div>
  );
}
