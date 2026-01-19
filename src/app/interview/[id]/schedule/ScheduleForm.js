"use client";

import { useState } from "react";

export default function ScheduleForm({ interviewId }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

 async function confirmSchedule() {
   setLoading(true);

   const scheduledAt = new Date(`${date}T${time}`).toISOString();

   const res = await fetch(`/api/interviews/${interviewId}/schedule`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       scheduledAt,
       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
     }),
   });

   if (!res.ok) {
     console.error("Schedule failed:", res.status, await res.text());
     setLoading(false);
     return;
   }

   window.location.href = `/interview/${interviewId}/lobby`;
 }


  return (
    <div className="space-y-4">
      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={confirmSchedule}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Scheduling..." : "Confirm schedule"}
      </button>
    </div>
  );
}
