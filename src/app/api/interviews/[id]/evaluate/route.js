import { NextResponse } from "next/server";

export async function POST() {
  console.log("⚠️ Evaluation skipped (quota exhausted)");
  return NextResponse.json({
    overallScore: 0,
    recommendation: "PENDING",
    strengths: "",
    weaknesses: "",
  });
}
