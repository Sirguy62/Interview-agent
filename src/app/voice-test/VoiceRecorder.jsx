"use client";

import { useRef, useState } from "react";

export default function VoiceRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [status, setStatus] = useState("Idle");

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm", // 🔑 REQUIRED
    });

    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      setStatus("Transcribing…");

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      console.log("🎙 Blob:", blob.size, blob.type);

      const formData = new FormData();
      formData.append("file", blob, "speech.webm");

      const res = await fetch("/api/audio/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("❌ Transcription failed");
        setStatus("Transcription failed");
        return;
      }

      const data = await res.json();
      setStatus(`You said: ${data.text}`);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setStatus("Recording…");
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  return (
    <div className="p-6 space-y-4">
      <p>{status}</p>
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
    </div>
  );
}
