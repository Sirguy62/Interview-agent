"use client";

import { useEffect, useState } from "react";

export default function InterviewTimer({ startedAt, duration }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startedAt) return;

    const start = new Date(startedAt).getTime();
    const end = start + duration * 60 * 1000;

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      setRemaining(diff);
    }

    tick(); // initial
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [startedAt, duration]);

  // ✅ Stable SSR render
  if (remaining === null) {
    return (
      <div className="text-lg font-mono text-gray-500">Loading timer…</div>
    );
  }

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="text-lg font-mono">
      Time remaining: {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
}
