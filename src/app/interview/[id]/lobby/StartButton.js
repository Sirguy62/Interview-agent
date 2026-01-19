"use client";

export default function StartButton({ interviewId, requiresScreen, canStart }) {
  async function startInterview() {
    if (!canStart) return;

    try {
      // 🎙️ Mic permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 🖥️ Screen permission if required
      if (requiresScreen) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
      }

      const res = await fetch(`/api/interviews/${interviewId}/start`, {
        method: "POST",
      });

      if (!res.ok) {
        console.error(await res.json());
        return;
      }

      window.location.href = `/interview/${interviewId}/room`;
    } catch (err) {
      console.error("Start interview failed:", err);
    }
  }

  return (
    <button
      disabled={!canStart}
      onClick={startInterview}
      className={`px-4 py-2 rounded ${
        canStart ? "bg-black text-white" : "bg-gray-300 text-gray-600"
      }`}
    >
      Start interview
    </button>
  );
}
