import { prisma } from "@/lib/prisma";
import StartButton from "./StartButton";

export default async function InterviewLobby(props) {
  const params = await props.params;
  const interviewId = params.id;

  if (!interviewId) {
    return <div>Invalid interview ID</div>;
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { definition: true },
  });

  if (!interview) {
    return <div>Interview not found</div>;
  }

  const now = new Date();
  const scheduled = new Date(interview.scheduledAt);
  const canStart = now >= scheduled;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Interview Lobby</h1>

      <p>
        <b>Role:</b> {interview.definition.role}
      </p>
      <p>
        <b>Level:</b> {interview.definition.level}
      </p>
      <p>
        <b>Duration:</b> {interview.definition.durationMinutes} mins
      </p>
      <p>
        <b>Scheduled:</b> {scheduled.toLocaleString()}
      </p>

      {!canStart && (
        <p className="text-sm text-gray-500">
          Interview unlocks at scheduled time
        </p>
      )}

      <StartButton
        interviewId={interview.id}
        requiresScreen={interview.definition.requiresScreenShare}
        canStart={canStart}
      />
    </div>
  );
}
