"use client";

import { useEffect, useRef } from "react";

export default function AudioCapture({ onFinalTranscript, disabled = false }) {
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalText = "";

    recognition.onresult = (event) => {
      clearTimeout(silenceTimer.current);

      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // Auto-submit after silence
      silenceTimer.current = setTimeout(() => {
        if (finalText.trim()) {
          onFinalTranscript(finalText.trim());
          finalText = "";
        }
      }, 1200);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
    };

    recognition.onend = () => {
      // 🔁 THIS IS THE CRITICAL PART
      if (!disabled) {
        recognition.start();
      }
    };

    recognition.start();

    return () => {
      recognition.onend = null;
      recognition.stop();
      clearTimeout(silenceTimer.current);
    };
  }, [disabled, onFinalTranscript]);

  return null;
}
