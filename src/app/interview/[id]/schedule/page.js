import { prisma } from "@/lib/prisma";
import ScheduleForm from "./ScheduleForm";

export default async function SchedulePage({ params }) {
  const { id: interviewId } = await params; // ✅ IMPORTANT

  if (!interviewId) {
    return <div>Invalid interview ID</div>;
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      definition: true,
    },
  });

  if (!interview) {
    return <div>Interview not found</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Schedule your interview</h1>

      <div className="border rounded p-4 bg-gray-50">
        <p>
          <b>Role:</b> {interview.definition.role}
        </p>
        <p>
          <b>Level:</b> {interview.definition.level}
        </p>
        <p>
          <b>Duration:</b> {interview.definition.durationMinutes} mins
        </p>
      </div>

      {/* enable this next */}
      <ScheduleForm interviewId={interview.id} />
    </div>
  );
}
