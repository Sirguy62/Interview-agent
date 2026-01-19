"use client";

import { useEffect, useState } from "react";

export default function InterviewSetupPage() {
  const [definitions, setDefinitions] = useState([]);

  const [track, setTrack] = useState(null);
  const [discipline, setDiscipline] = useState(null);
  const [role, setRole] = useState(null);
  const [focus, setFocus] = useState(null);
  const [level, setLevel] = useState(null);

  useEffect(() => {
    fetch("/api/interview-definitions")
      .then((res) => res.json())
      .then(setDefinitions);
  }, []);

 async function createInterview() {
   const res = await fetch("/api/interviews", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       definitionId: selectedDefinition.id,
       candidateId: "temp-candidate-id", // TEMP (we'll wire auth next)
       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
     }),
   });

   if (!res.ok) {
     const err = await res.json();
     console.error("Interview creation failed:", err);
     return;
   }

   const interview = await res.json();
   window.location.href = `/interview/${interview.id}/schedule`;
 }



  // FILTER HELPERS
  const tracks = [...new Set(definitions.map((d) => d.track))];

  const disciplines = definitions
    .filter((d) => d.track === track)
    .map((d) => d.discipline);

  const roles = definitions
    .filter((d) => d.track === track && d.discipline === discipline)
    .map((d) => d.role);

  const focuses = definitions
    .filter((d) => d.role === role)
    .map((d) => d.focus);

  const levels = definitions
    .filter((d) => d.role === role && d.focus === focus)
    .map((d) => d.level);

  const selectedDefinition = definitions.find(
    (d) =>
      d.track === track &&
      d.discipline === discipline &&
      d.role === role &&
      d.focus === focus &&
      d.level === level
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Set up your interview</h1>

      {/* STEP 1 */}
      <Step title="Track" options={tracks} value={track} onSelect={setTrack} />

      {/* STEP 2 */}
      {track && (
        <Step
          title="Discipline"
          options={[...new Set(disciplines)]}
          value={discipline}
          onSelect={setDiscipline}
        />
      )}

      {/* STEP 3 */}
      {discipline && (
        <Step
          title="Role"
          options={[...new Set(roles)]}
          value={role}
          onSelect={setRole}
        />
      )}

      {/* STEP 4 */}
      {role && (
        <Step
          title="Focus"
          options={[...new Set(focuses)]}
          value={focus}
          onSelect={setFocus}
        />
      )}

      {/* STEP 5 */}
      {focus && (
        <Step
          title="Level"
          options={[...new Set(levels)]}
          value={level}
          onSelect={setLevel}
        />
      )}

      {/* RESULT */}
      {selectedDefinition && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-medium">Interview ready</p>
          <p>Duration: {selectedDefinition.durationMinutes} mins</p>
          <p>
            Screen sharing:{" "}
            {selectedDefinition.requiresScreenShare ? "Required" : "Optional"}
          </p>

          <button
            onClick={createInterview}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            Continue to scheduling
          </button>
        </div>
      )}
    </div>
  );
}

function Step({ title, options, value, onSelect }) {
  return (
    <div>
      <h2 className="font-medium mb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-1 rounded border ${
              value === opt ? "bg-black text-white" : "bg-white"
            }`}
          >
            {opt.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
