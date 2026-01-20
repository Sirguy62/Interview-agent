"use client";

import { useEffect, useState } from "react";
import AudioCapture from "./AudioCapture";
import InterviewTimer from "./InterviewTimer";
import EndInterviewButton from "./EndInterviewButton";

export default function RoomClient({
  interviewId,
  role,
  level,
  duration,
  startedAt,
}) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [state, setState] = useState("THINKING");
  // LISTENING | THINKING | SPEAKING

  /* ===============================
     SPEAK AI (ELEVENLABS)
  =============================== */
  async function speak(text) {
    setState("SPEAKING");

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const audioBlob = await res.blob();
    const audio = new Audio(URL.createObjectURL(audioBlob));

    audio.onended = () => setState("LISTENING");
    audio.play();

    setAiPrompt(text);
  }

  /* ===============================
     SEND USER ANSWER TO AI
  =============================== */
  async function sendAnswer(answer) {
    setState("THINKING");

    const res = await fetch(`/api/interviews/${interviewId}/next-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastAnswer: answer }),
    });

    const data = await res.json();
    if (data?.question) {
      speak(data.question);
    }
  }

  /* ===============================
     OPEN INTERVIEW
  =============================== */
  useEffect(() => {
    sendAnswer("Start the interview.");
  }, []);

  function stateLabel() {
    if (state === "LISTENING") return "Listening…";
    if (state === "THINKING") return "Thinking…";
    if (state === "SPEAKING") return "Speaking…";
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Interview in progress</h1>

      <div className="border rounded p-4">
        <p>
          <b>Role:</b> {role}
        </p>
        <p>
          <b>Level:</b> {level}
        </p>
        <p>
          <b>Duration:</b> {duration} mins
        </p>
      </div>

      <AudioCapture
        disabled={state !== "LISTENING"}
        onFinalTranscript={sendAnswer}
      />

      <InterviewTimer startedAt={startedAt} duration={duration} />

      <div className="border rounded p-4 bg-black text-white">
        <p className="opacity-70 text-sm">{stateLabel()}</p>
        <p className="mt-2">{aiPrompt}</p>
      </div>

      <EndInterviewButton interviewId={interviewId} />
    </div>
  );
}
