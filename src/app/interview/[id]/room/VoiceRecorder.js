"use client";

import { useEffect, useRef } from "react";

export default function VoiceRecorder({ onFinalTranscript }) {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const silenceTimer = useRef(null);

  useEffect(() => {
    startRecording();
    return stopRecording;
  }, []);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    recorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    recorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
      resetSilence();
    };

    recorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      const form = new FormData();
      form.append("file", blob);

      const res = await fetch("/api/audio/transcribe", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.text) onFinalTranscript(data.text);
    };

    recorderRef.current.start();
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function resetSilence() {
    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(stopRecording, 1500);
  }

  return null;
}
