import { NextResponse } from "next/server"

import { completeAssessmentSession } from "@/lib/mock-assessment-store"

type CompleteAssessmentBody = {
  sessionId?: string
}

export async function POST(request: Request) {
  let body: CompleteAssessmentBody
  try {
    body = (await request.json()) as CompleteAssessmentBody
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 })
  }

  const sessionId = String(body.sessionId ?? "")
  if (!sessionId) {
    return NextResponse.json({ error: "Thiếu sessionId" }, { status: 400 })
  }

  const session = completeAssessmentSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: "Không tìm thấy session" }, { status: 404 })
  }

  return NextResponse.json({
    sessionId: session.sessionId,
    status: session.status,
    result: session.result,
  })
}
