import { prisma } from "@/lib/prisma";

export default async function InterviewSummary({ params }) {
  const { id: interviewId } = await params; // ✅ FIX

  if (!interviewId) {
    return <div>Invalid interview ID</div>;
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      definition: true,
      transcript: true,
      scorecard: true,
    },
  });

  if (!interview) {
    return <div>Interview not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Interview Summary</h1>

      <div className="border rounded p-4 space-y-2">
        <p>
          <b>Role:</b> {interview.definition.role}
        </p>
        <p>
          <b>Level:</b> {interview.definition.level}
        </p>
        <p>
          <b>Status:</b> {interview.status}
        </p>
      </div>

      <div className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">Transcript</h2>
        {interview.transcript ? (
          <pre className="whitespace-pre-wrap text-sm">
            {interview.transcript.rawText}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">No transcript yet</p>
        )}
      </div>

      <div className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">Evaluation</h2>
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
          <p className="text-sm text-gray-500">Evaluation pending…</p>
        )}
      </div>
    </div>
  );
}
