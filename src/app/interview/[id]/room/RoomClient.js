"use client";

import { useEffect, useRef, useState } from "react";
import InterviewTimer from "./InterviewTimer";
import EndInterviewButton from "./EndInterviewButton";

const STATES = {
  THINKING: "THINKING",
  LISTENING: "LISTENING",
  SPEAKING: "SPEAKING",
};

export default function RoomClient({
  interviewId,
  role,
  level,
  duration,
  startedAt,
}) {
  const [state, setState] = useState(STATES.THINKING);
  const [aiPrompt, setAiPrompt] = useState("");
  const [summary, setSummary] = useState("");

  const busyRef = useRef(false);

  /* ===============================
     AI SPEAK (SAFE)
  =============================== */
  async function speak(text) {
    setAiPrompt(text);
    setState(STATES.SPEAKING);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));

      const unlock = () => setState(STATES.LISTENING);

      audio.onended = unlock;
      audio.onerror = unlock;
      audio.play().catch(unlock);

      setTimeout(unlock, 4000); // failsafe
    } catch {
      // 🔁 TEXT FALLBACK
      setState(STATES.LISTENING);
    }
  }

  /* ===============================
     ASK AI
  =============================== */
async function askAI(answer) {
  if (busyRef.current) return;
  busyRef.current = true;
  setState(STATES.THINKING);

  try {
    const res = await fetch(`/api/interviews/${interviewId}/next-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastAnswer: answer, summary }),
    });

    // 🔑 NEVER call res.json() blindly
    if (!res.ok) {
      const text = await res.text();
      console.error("next-question failed:", res.status, text);

      setAiPrompt("Let’s continue. Can you explain that in more detail?");
      setState(STATES.LISTENING);
      return;
    }

    const data = await res.json();

    if (data?.question) {
      setSummary((prev) => (prev ? prev + "\n" + answer : answer));
      await speak(data.question);
    } else {
      setAiPrompt("Can you expand a bit more on that?");
      setState(STATES.LISTENING);
    }
  } catch (err) {
    console.error("askAI crashed:", err);
    setAiPrompt("Something went wrong. Please continue.");
    setState(STATES.LISTENING);
  } finally {
    busyRef.current = false;
  }
}



  useEffect(() => {
    askAI("Start the interview.");
  }, []);

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

      <InterviewTimer startedAt={startedAt} duration={duration} />

      <div className="border rounded p-4 bg-black text-white">
        <p className="opacity-70 text-sm">{state}</p>
        <p className="mt-2">{aiPrompt}</p>
      </div>

      {/* TEXT INPUT (always works) */}
      <input
        className="border p-2 w-full text-black"
        placeholder="Type your answer and press Enter"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            askAI(e.target.value);
            e.target.value = "";
          }
        }}
      />

      <EndInterviewButton interviewId={interviewId} />
    </div>
  );
}
