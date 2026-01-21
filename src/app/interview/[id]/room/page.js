import { prisma } from "@/lib/prisma";
import RoomClient from "./RoomClient";

export default async function InterviewRoom({ params }) {
  const { id: interviewId } = await params;

  if (!interviewId) {
    return <div>Invalid interview ID</div>;
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      session: true,
      definition: true,
    },
  });

  if (!interview || interview.status !== "IN_PROGRESS") {
    return <div>Interview not active</div>;
  }

  return (
    <RoomClient
      interviewId={interview.id}
      role={interview.definition.role}
      level={interview.definition.level}
      duration={interview.definition.durationMinutes}
      startedAt={interview.session.startedAt}
    />
  );
}
