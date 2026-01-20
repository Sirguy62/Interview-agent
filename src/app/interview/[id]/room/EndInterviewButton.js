"use client";

export default function EndInterviewButton({ interviewId }) {
  if (!interviewId) {
    console.error("EndInterviewButton rendered without interviewId");
    return null;
  }

  async function endInterview() {
    const res = await fetch(`/api/interviews/${interviewId}/end`, {
      method: "POST",
    });

    if (!res.ok) {
      console.error("End interview failed:", await res.text());
      return;
    }

    window.location.href = `/interview/${interviewId}/summary`;
  }

  return (
    <button
      onClick={endInterview}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      End interview
    </button>
  );
}
