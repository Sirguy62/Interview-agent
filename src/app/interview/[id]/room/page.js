import { prisma } from "@/lib/prisma";
import InterviewTimer from "./InterviewTimer";
import AudioCapture from "./AudioCapture";

export default async function InterviewRoom(props) {
  // ✅ Next.js 16: params is a Promise
  const params = await props.params;
  const interviewId = params.id;

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

      <div className="border rounded p-4 space-y-2">
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

      {/* 🎙️ Audio capture (client component) */}
      <AudioCapture />

      {/* ⏱️ Timer */}
      <InterviewTimer
        startedAt={interview.session.startedAt}
        duration={interview.definition.durationMinutes}
      />

      {/* 🤖 AI interviewer prompt */}
      <div className="border rounded p-4 bg-black text-white">
        <p className="opacity-80">AI Interviewer</p>
        <p className="mt-2">
          Hello! Let’s begin. Can you introduce yourself and describe your
          recent experience?
        </p>
      </div>

      <button className="bg-red-600 text-white px-4 py-2 rounded">
        End interview
      </button>
    </div>
  );
}
