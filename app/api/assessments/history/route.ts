import { NextResponse } from "next/server"

import { getAssessmentProgressSummary } from "@/lib/mock-assessment-store"

export async function GET() {
  return NextResponse.json(getAssessmentProgressSummary())
}
