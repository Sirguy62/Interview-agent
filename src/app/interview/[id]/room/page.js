import { prisma } from "@/lib/prisma";
import InterviewTimer from "./InterviewTimer";
import AudioCapture from "./AudioCapture";
import EndInterviewButton from "./EndInterviewButton";

export default async function InterviewRoom({ params }) {
  // ✅ MUST await params
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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Interview in progress</h1>

      <AudioCapture />

      <InterviewTimer
        startedAt={interview.session.startedAt}
        duration={interview.definition.durationMinutes}
      />

      <div className="border rounded p-4 bg-black text-white">
        <p className="opacity-80">AI Interviewer</p>
        <p className="mt-2">
          Hello! Let’s begin. Can you introduce yourself and describe your
          recent experience?
        </p>
      </div>

      <EndInterviewButton interviewId={interview.id} />
    </div>
  );
}
