"use client";

import { useEffect, useRef } from "react";
import { useWhisper } from "@/lib/speechMode";

export default function AudioCapture({ onFinalTranscript, disabled }) {
  const silenceTimer = useRef(null);

  useEffect(() => {
    if (useWhisper) return; // 🚫 PROD: do nothing
    if (disabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalText = "";

    recognition.onresult = (event) => {
      finalText = "";
      for (const r of event.results) finalText += r[0].transcript;

      clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        recognition.stop();
        onFinalTranscript(finalText.trim());
      }, 1200);
    };

    recognition.start();
    return () => recognition.stop();
  }, [disabled, onFinalTranscript]);

  return null;
}
