"use client";

import { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";

export default function VoiceTestPage() {
  const [status, setStatus] = useState("Idle");

  return (
    <div className="p-6 max-w-xl mx-auto text-white bg-black min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Voice Baseline Test</h1>

      <p className="mb-4 opacity-70">{status}</p>

      <VoiceRecorder setStatus={setStatus} />
    </div>
  );
}
