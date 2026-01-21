import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EmployerInterviewsPage() {
  const interviews = await prisma.interview.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      candidate: true,
      definition: true,
      scorecard: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Interviews</h1>

      {interviews.map((i) => (
        <Link
          key={i.id}
          href={`/employer/interviews/${i.id}`}
          className="block border rounded p-4 hover:bg-gray-50"
        >
          <p>
            <b>Role:</b> {i.definition.role}
          </p>
          <p>
            <b>Candidate:</b> {i.candidate.email}
          </p>
          <p>
            <b>Status:</b> {i.status}
          </p>
          {i.scorecard && (
            <p>
              <b>Score:</b> {i.scorecard.overallScore}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
