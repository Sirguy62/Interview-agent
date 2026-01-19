"use client";

import { useEffect } from "react";

export default function AudioCapture() {
  useEffect(() => {
    async function initMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Mic stream ready", stream);
    }

    initMic();
  }, []);

  return null;
}
