"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const AudioCapture = forwardRef(function AudioCapture(
  { onFinalTranscript = () => {}, disabled = false },
  ref
) {
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);
  const bufferRef = useRef("");

  useImperativeHandle(ref, () => ({
    start() {
      if (!recognitionRef.current) return;
      try {
        recognitionRef.current.start();
      } catch {}
    },
    stop() {
      recognitionRef.current?.stop();
    },
  }));

  useEffect(() => {
    if (disabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      clearTimeout(silenceTimer.current);

      for (let i = event.resultIndex; i < event.results.length; i++) {
        bufferRef.current += event.results[i][0].transcript + " ";
      }

      silenceTimer.current = setTimeout(() => {
        const text = bufferRef.current.trim();
        if (text) {
          onFinalTranscript(text);
          bufferRef.current = "";
        }
      }, 1200);
    };

    recognition.onend = () => {
      if (!disabled) recognition.start();
    };

    return () => {
      recognition.stop();
      clearTimeout(silenceTimer.current);
    };
  }, [disabled, onFinalTranscript]);

  return null;
});

export default AudioCapture;
