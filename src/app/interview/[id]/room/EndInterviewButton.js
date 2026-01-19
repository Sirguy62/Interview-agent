"use client";

export default function EndInterviewButton({ interviewId }) {
//   async function endInterview() {
//     await fetch(`/api/interviews/${interviewId}/end`, {
//       method: "POST",
//     });

//     window.location.href = `/interview/${interviewId}/summary`;
//   }

  return (
    <button
      onClick={async () => {
        await fetch(`/api/interviews/${interviewId}/end`, {
          method: "POST",
        });
        window.location.href = `/interview/${interviewId}/summary`;
      }}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      End interview
    </button>
  );
}
