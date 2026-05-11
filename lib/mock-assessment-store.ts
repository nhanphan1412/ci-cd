import { randomUUID } from "crypto"

export type MobilityGoal =
  | "confidence"
  | "walking"
  | "stairs"
  | "recovery"

export type ConfidenceLevel = "low" | "medium" | "high"

export type ExercisePlan = {
  title: string
  duration: string
  description: string
}

export type AssessmentResult = {
  score: number
  riskLevel: "low" | "moderate" | "elevated"
  summary: string
  observations: string[]
  exercises: ExercisePlan[]
  nextSteps: string[]
}

export type AssessmentSession = {
  sessionId: string
  fullName: string
  age: number
  mobilityGoal: MobilityGoal
  confidenceLevel: ConfidenceLevel
  usesAssistiveDevice: boolean
  safetyChecks: {
    clearArea: boolean
    stableChair: boolean
    goodLighting: boolean
  }
  status: "ready" | "completed"
  createdAt: string
  completedAt?: string
  result?: AssessmentResult
}

export type AssessmentHistoryItem = {
  sessionId: string
  fullName: string
  mobilityGoal: MobilityGoal
  score: number
  riskLevel: AssessmentResult["riskLevel"]
  completedAt: string
}

export type AssessmentProgressSummary = {
  overview: {
    totalCompletedSessions: number
    averageScore: number
    lowRiskRate: number
    latestDelta: number | null
  }
  recentSessions: AssessmentHistoryItem[]
}

type CreateAssessmentInput = Omit<
  AssessmentSession,
  "sessionId" | "status" | "createdAt" | "completedAt" | "result"
>

/**
 * Store chỉ dùng cho demo. Dữ liệu sẽ mất khi server restart.
 */
const assessmentStore = new Map<string, AssessmentSession>()

export function createAssessmentSession(
  input: CreateAssessmentInput
): AssessmentSession {
  const sessionId = randomUUID()
  const session: AssessmentSession = {
    ...input,
    sessionId,
    status: "ready",
    createdAt: new Date().toISOString(),
  }

  assessmentStore.set(sessionId, session)
  return session
}

export function getAssessmentSession(
  sessionId: string
): AssessmentSession | undefined {
  return assessmentStore.get(sessionId)
}

export function completeAssessmentSession(
  sessionId: string
): AssessmentSession | undefined {
  const session = assessmentStore.get(sessionId)
  if (!session) return undefined

  if (session.status === "completed") return session

  const result = buildMockResult(session)
  const completedSession: AssessmentSession = {
    ...session,
    status: "completed",
    completedAt: new Date().toISOString(),
    result,
  }

  assessmentStore.set(sessionId, completedSession)
  return completedSession
}

export function getAssessmentProgressSummary(): AssessmentProgressSummary {
  const recentSessions = [...assessmentStore.values()]
    .filter(
      (session): session is AssessmentSession & { result: AssessmentResult; completedAt: string } =>
        session.status === "completed" &&
        Boolean(session.result) &&
        typeof session.completedAt === "string"
    )
    .sort(
      (left, right) =>
        new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime()
    )

  const recentItems = recentSessions.slice(0, 6).map((session) => ({
    sessionId: session.sessionId,
    fullName: session.fullName,
    mobilityGoal: session.mobilityGoal,
    score: session.result.score,
    riskLevel: session.result.riskLevel,
    completedAt: session.completedAt,
  }))

  const totalCompletedSessions = recentSessions.length
  const averageScore =
    totalCompletedSessions === 0
      ? 0
      : Math.round(
          recentSessions.reduce((sum, session) => sum + session.result.score, 0) /
            totalCompletedSessions
        )
  const lowRiskSessions = recentSessions.filter(
    (session) => session.result.riskLevel === "low"
  ).length
  const lowRiskRate =
    totalCompletedSessions === 0
      ? 0
      : Math.round((lowRiskSessions / totalCompletedSessions) * 100)
  const latestDelta =
    recentSessions.length >= 2
      ? recentSessions[0].result.score - recentSessions[1].result.score
      : null

  return {
    overview: {
      totalCompletedSessions,
      averageScore,
      lowRiskRate,
      latestDelta,
    },
    recentSessions: recentItems,
  }
}

function buildMockResult(session: AssessmentSession): AssessmentResult {
  const variance = hashString(session.sessionId) % 7

  let score = 84
  if (session.age >= 75) {
    score -= 9
  } else if (session.age >= 65) {
    score -= 5
  }

  if (session.confidenceLevel === "low") {
    score -= 8
  } else if (session.confidenceLevel === "medium") {
    score -= 3
  }

  if (session.usesAssistiveDevice) {
    score -= 6
  }

  if (session.mobilityGoal === "recovery") {
    score -= 4
  }

  score = clamp(score + variance - 3, 52, 95)

  const riskLevel =
    score >= 80 ? "low" : score >= 66 ? "moderate" : "elevated"

  const goalLabel = mobilityGoalLabel[session.mobilityGoal]
  const summaryByRisk = {
    low: `Phiên đánh giá cho thấy khả năng giữ thăng bằng tương đối ổn định trong sinh hoạt hằng ngày, nổi bật nhất ở nhóm mục tiêu ${goalLabel}.`,
    moderate: `Phiên đánh giá cho thấy mức ổn định còn dao động, đặc biệt ở nhóm mục tiêu ${goalLabel}. Một kế hoạch bài tập ngắn tại nhà có thể giúp cải thiện tính nhất quán.`,
    elevated: `Phiên đánh giá cho thấy người dùng có thể cần nhiều hỗ trợ hơn ở nhóm mục tiêu ${goalLabel}. Bước tiếp theo nên ưu tiên an toàn, bài tập đơn giản và cân nhắc trao đổi thêm với chuyên gia nếu cần.`,
  } as const

  const observations = buildObservations(session, riskLevel)
  const exercises = buildExercises(session, riskLevel)

  return {
    score,
    riskLevel,
    summary: summaryByRisk[riskLevel],
    observations,
    exercises,
    nextSteps: [
      "Thực hiện lại bài kiểm tra trong không gian yên tĩnh, đủ sáng và dùng cùng một thiết lập để dễ so sánh.",
      "Theo dõi xem mức độ tự tin có cải thiện sau 1-2 tuần luyện tập thăng bằng nhẹ hay không.",
      riskLevel === "elevated"
        ? "Nên cân nhắc chia sẻ kết quả với người chăm sóc hoặc chuyên gia để có đánh giá đầy đủ hơn."
        : "Hãy xem kết quả này như một mốc tham chiếu ban đầu, không phải kết luận chẩn đoán.",
    ],
  }
}

function buildObservations(
  session: AssessmentSession,
  riskLevel: AssessmentResult["riskLevel"]
): string[] {
  const observations = [
    `Phiên đánh giá mock cho thấy ${session.fullName} phản hồi tốt hơn khi hướng dẫn ngắn gọn và dễ đoán trước.`,
    session.usesAssistiveDevice
      ? "Hồ sơ có sử dụng thiết bị hỗ trợ, vì vậy các khuyến nghị ưu tiên bài tập kiểm soát nhịp độ và thực hiện gần ghế hoặc điểm tựa."
      : "Hồ sơ không có thiết bị hỗ trợ, vì vậy kế hoạch ưu tiên các bài tập lặp lại để tăng sự tự tin.",
    `Nhóm cần cải thiện chính là ${mobilityGoalLabel[session.mobilityGoal]}.`,
  ]

  if (riskLevel !== "low") {
    observations.push(
      "Nhịp độ chậm hơn một chút cùng phản hồi thị giác rõ hơn có thể giúp tăng cảm giác tin cậy trong phiên kiểm tra."
    )
  }

  return observations
}

function buildExercises(
  session: AssessmentSession,
  riskLevel: AssessmentResult["riskLevel"]
): ExercisePlan[] {
  const sharedExercises: ExercisePlan[] = [
    {
      title: "Chuyển trọng tâm có hỗ trợ từ ghế",
      duration: "2 hiệp x 45 giây",
      description:
        "Dồn trọng lượng nhẹ nhàng sang hai bên, luôn giữ một tay gần ghế chắc chắn để tạo cảm giác an tâm.",
    },
    {
      title: "Nhấc gối tại chỗ",
      duration: "2 hiệp x 30 giây",
      description:
        "Nhấc từng gối chậm và đều để tăng nhịp điệu vận động mà không cần vội.",
    },
  ]

  const goalExercise: Record<MobilityGoal, ExercisePlan> = {
    confidence: {
      title: "Thở điều hòa để lấy lại sự tự tin",
      duration: "90 giây",
      description:
        "Kết hợp nhịp thở chậm với thao tác chỉnh tư thế trước khi bắt đầu bài tập vận động.",
    },
    walking: {
      title: "Đi bộ theo đường thẳng ngắn",
      duration: "3 phút",
      description:
        "Bước chậm, có kiểm soát theo một đường thẳng và tạm dừng ngắn sau mỗi 6-8 bước.",
    },
    stairs: {
      title: "Tập bước lên bục thấp",
      duration: "2 hiệp x 8 lần",
      description:
        "Dùng bục thấp và tay vịn để luyện cách đặt chân ổn định rồi trở về vị trí ban đầu.",
    },
    recovery: {
      title: "Ngồi xuống và đứng lên có kiểm soát",
      duration: "2 hiệp x 6 lần",
      description:
        "Đứng dậy khỏi ghế thật chậm và ngồi xuống lại với kiểm soát, tránh thả người quá nhanh.",
    },
  }

  return [
    goalExercise[session.mobilityGoal],
    ...sharedExercises,
    {
      title:
        riskLevel === "elevated"
          ? "Đứng thăng bằng so le có hỗ trợ"
          : "Làm quen với giữ thăng bằng một chân",
      duration: riskLevel === "elevated" ? "3 x 20 giây" : "3 x 15 giây",
      description:
        riskLevel === "elevated"
          ? "Tập đứng chân trước chân sau cạnh mặt bàn chắc chắn và dừng lại nếu thấy mất ổn định."
          : "Chạm nhẹ đầu ngón tay vào điểm tựa chắc chắn để thử thách thăng bằng trong khoảng ngắn, an toàn.",
    },
  ]
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const mobilityGoalLabel: Record<MobilityGoal, string> = {
  confidence: "sự tự tin trong sinh hoạt hằng ngày",
  walking: "độ ổn định khi đi lại",
  stairs: "khả năng lên xuống cầu thang",
  recovery: "vận động theo hướng phục hồi",
}
