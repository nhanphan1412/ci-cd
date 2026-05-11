import { NextResponse } from "next/server"

import {
  createAssessmentSession,
  getAssessmentSession,
  type ConfidenceLevel,
  type MobilityGoal,
} from "@/lib/mock-assessment-store"

type CreateAssessmentBody = {
  fullName?: string
  age?: number
  mobilityGoal?: MobilityGoal
  confidenceLevel?: ConfidenceLevel
  usesAssistiveDevice?: boolean
  safetyChecks?: {
    clearArea?: boolean
    stableChair?: boolean
    goodLighting?: boolean
  }
}

const validGoals = new Set<MobilityGoal>([
  "confidence",
  "walking",
  "stairs",
  "recovery",
])

const validConfidenceLevels = new Set<ConfidenceLevel>([
  "low",
  "medium",
  "high",
])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ error: "Thiếu sessionId" }, { status: 400 })
  }

  const session = getAssessmentSession(sessionId)
  if (!session) {
    return NextResponse.json({ found: false }, { status: 404 })
  }

  return NextResponse.json({ found: true, session })
}

export async function POST(request: Request) {
  let body: CreateAssessmentBody
  try {
    body = (await request.json()) as CreateAssessmentBody
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 })
  }

  const fullName = String(body.fullName ?? "").trim()
  const age = Number(body.age)
  const mobilityGoal = body.mobilityGoal
  const confidenceLevel = body.confidenceLevel
  const safetyChecks = {
    clearArea: Boolean(body.safetyChecks?.clearArea),
    stableChair: Boolean(body.safetyChecks?.stableChair),
    goodLighting: Boolean(body.safetyChecks?.goodLighting),
  }

  if (fullName.length < 2) {
    return NextResponse.json(
      { error: "Vui lòng nhập tên người tham gia hợp lệ." },
      { status: 400 }
    )
  }

  if (!Number.isFinite(age) || age < 50 || age > 99) {
    return NextResponse.json(
      { error: "Tuổi trong demo này cần nằm trong khoảng từ 50 đến 99." },
      { status: 400 }
    )
  }

  if (!mobilityGoal || !validGoals.has(mobilityGoal)) {
    return NextResponse.json(
      { error: "Vui lòng chọn một mục tiêu vận động." },
      { status: 400 }
    )
  }

  if (!confidenceLevel || !validConfidenceLevels.has(confidenceLevel)) {
    return NextResponse.json(
      { error: "Vui lòng chọn mức độ tự tin." },
      { status: 400 }
    )
  }

  if (!safetyChecks.clearArea || !safetyChecks.stableChair || !safetyChecks.goodLighting) {
    return NextResponse.json(
      { error: "Vui lòng xác nhận đầy đủ các điều kiện an toàn trước khi bắt đầu." },
      { status: 400 }
    )
  }

  const session = createAssessmentSession({
    fullName,
    age,
    mobilityGoal,
    confidenceLevel,
    usesAssistiveDevice: Boolean(body.usesAssistiveDevice),
    safetyChecks,
  })

  return NextResponse.json({
    sessionId: session.sessionId,
    status: session.status,
  })
}
