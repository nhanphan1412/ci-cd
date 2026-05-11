"use client"

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import {
  IconAlertCircle,
  IconArrowLeft,
  IconCamera,
  IconCircleCheck,
  IconDeviceCameraPhone,
  IconLoader2,
  IconPlayerPlay,
  IconRefresh,
  IconSparkles,
} from "@tabler/icons-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  mobilityGoalLabel,
  type AssessmentSession,
} from "@/lib/mock-assessment-store"

type AssessmentSessionResponse =
  | { found: true; session: AssessmentSession }
  | { found: false; error?: string }

type CameraState = "idle" | "requesting" | "ready" | "denied" | "unsupported"
type CameraMode = "live" | "simulated" | null
type SessionPhase = "idle" | "countdown" | "assessing" | "processing"

const ASSESSMENT_SECONDS = 20
const COUNTDOWN_SECONDS = 5

export function SessionAssessmentPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId") ?? ""

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [session, setSession] = useState<AssessmentSession | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  const [cameraState, setCameraState] = useState<CameraState>("idle")
  const [cameraMode, setCameraMode] = useState<CameraMode>(null)

  const [phase, setPhase] = useState<SessionPhase>("idle")
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [phaseError, setPhaseError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchSession() {
      if (!sessionId) {
        setIsLoadingSession(false)
        setSessionError("Thiếu sessionId. Vui lòng quay lại bước setup để bắt đầu lại.")
        return
      }

      setIsLoadingSession(true)

      try {
        const response = await fetch(
          `/api/assessments?sessionId=${encodeURIComponent(sessionId)}`
        )
        const data = (await response.json()) as AssessmentSessionResponse

        if (!response.ok || !data.found) {
          if (!ignore) {
            setSessionError("Không tìm thấy phiên demo này.")
            setSession(null)
          }
          return
        }

        if (!ignore) {
          setSession(data.session)
          setSessionError(null)
        }
      } catch {
        if (!ignore) {
          setSessionError("Không thể tải phiên đánh giá.")
          setSession(null)
        }
      } finally {
        if (!ignore) {
          setIsLoadingSession(false)
        }
      }
    }

    void fetchSession()

    return () => {
      ignore = true
    }
  }, [sessionId])

  useEffect(() => {
    const videoElement = videoRef.current

    return () => {
      stopStream(streamRef.current, videoElement)
    }
  }, [])

  useEffect(() => {
    if (phase !== "countdown") return

    const timeoutId = window.setTimeout(() => {
      if (countdown <= 1) {
        setPhase("assessing")
        setElapsedSeconds(0)
        return
      }

      setCountdown((value: number) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [countdown, phase])

  useEffect(() => {
    if (phase !== "assessing") return

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current: number) => {
        if (current >= ASSESSMENT_SECONDS - 1) {
          window.clearInterval(intervalId)
          setPhase("processing")
          return ASSESSMENT_SECONDS
        }

        return current + 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [phase])

  useEffect(() => {
    if (phase !== "processing" || !sessionId) return

    let ignore = false

    async function finalizeAssessment() {
      try {
        const response = await fetch("/api/assessments/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })

        const data = (await response.json()) as {
          error?: string
          sessionId?: string
        }

        if (!response.ok || !data.sessionId) {
          if (!ignore) {
            setPhaseError(data.error ?? "Không thể tạo kết quả.")
            setPhase("idle")
          }
          return
        }

        if (!ignore) {
          router.replace(`/results?sessionId=${encodeURIComponent(sessionId)}`)
        }
      } catch {
        if (!ignore) {
          setPhaseError("Lỗi mạng khi hoàn tất phiên đánh giá.")
          setPhase("idle")
        }
      }
    }

    void finalizeAssessment()

    return () => {
      ignore = true
    }
  }, [phase, router, sessionId])

  const canStart = Boolean(session) && cameraState === "ready" && phase === "idle"
  const progress = Math.round((elapsedSeconds / ASSESSMENT_SECONDS) * 100)

  const coachingMessage = useMemo(() => {
    if (phase === "countdown") {
      return "Đứng thẳng, giữ hai chân vững và nhìn về phía trước."
    }

    if (phase === "assessing") {
      const messages = [
        "Giữ vai thả lỏng và ánh nhìn ổn định.",
        "Phân bổ trọng lượng đều lên hai chân.",
        "Đứng gần điểm tựa nhưng chỉ bám vào khi thật sự cần thiết.",
        "Hít thở bình thường và di chuyển chậm nếu bạn muốn lấy lại nhịp.",
      ]

      return messages[Math.min(messages.length - 1, Math.floor(elapsedSeconds / 5))]
    }

    if (phase === "processing") {
      return "Đang xử lý kết quả mock và tạo khuyến nghị phù hợp..."
    }

    return "Khi sẵn sàng, hãy bật camera hoặc dùng chế độ preview mô phỏng để tiếp tục."
  }, [elapsedSeconds, phase])

  const cameraStatusLabel = useMemo(() => {
    switch (cameraState) {
      case "ready":
        return "Camera đã sẵn sàng"
      case "requesting":
        return "Đang xin quyền camera"
      case "denied":
        return "Camera bị từ chối"
      case "unsupported":
        return "Thiết bị không hỗ trợ"
      default:
        return "Chưa bật camera"
    }
  }, [cameraState])

  async function requestCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported")
      setCameraMode(null)
      return
    }

    setPhaseError(null)
    setCameraState("requesting")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      })

      stopStream(streamRef.current, videoRef.current)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }

      setCameraMode("live")
      setCameraState("ready")
    } catch {
      setCameraMode(null)
      setCameraState("denied")
    }
  }

  function enableSimulatedMode() {
    stopStream(streamRef.current, videoRef.current)
    streamRef.current = null
    setCameraMode("simulated")
    setCameraState("ready")
    setPhaseError(null)
  }

  function resetTimer() {
    setPhase("idle")
    setCountdown(COUNTDOWN_SECONDS)
    setElapsedSeconds(0)
    setPhaseError(null)
  }

  function startAssessment() {
    if (!canStart) return
    resetTimer()
    setPhase("countdown")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardHeader className="gap-3">
          <CardTitle className="text-2xl">Phiên camera</CardTitle>
          <CardDescription className="leading-7">
            Màn hình này thể hiện cách xử lý quyền truy cập, hành vi fallback,
            hướng dẫn theo thời gian và nhiều trạng thái runtime thường gặp ở
            các sản phẩm dùng camera.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-border/80 bg-slate-950 shadow-inner">
            {cameraMode === "live" ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : cameraMode === "simulated" ? (
              <div className="relative flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.35),rgba(15,23,42,0.9)_55%)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div className="relative flex flex-col items-center gap-4 text-white">
                  <div className="flex size-24 items-center justify-center rounded-full border border-white/30 bg-white/10">
                    <IconDeviceCameraPhone className="size-12" aria-hidden />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-lg font-semibold">Preview mô phỏng</p>
                    <p className="max-w-xs text-sm text-white/80">
                      Hãy dùng chế độ này khi phỏng vấn nếu camera bị chặn quyền
                      hoặc thiết bị không sẵn sàng.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),rgba(15,23,42,0.96)_65%)] p-6 text-center text-white">
                <div className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <IconCamera className="size-8" aria-hidden />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Xem trước camera</p>
                  <p className="max-w-sm text-sm leading-6 text-white/75">
                    Cho phép camera để xem preview trực tiếp, hoặc chuyển sang
                    preview mô phỏng để toàn bộ demo vẫn hoạt động.
                  </p>
                </div>
              </div>
            )}

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {cameraState === "ready" ? (
                <IconCircleCheck className="size-3.5 text-emerald-300" aria-hidden />
              ) : (
                <IconCamera className="size-3.5 text-white/80" aria-hidden />
              )}
              {cameraStatusLabel}
            </div>

            {phase === "countdown" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <div className="flex size-28 items-center justify-center rounded-full border border-white/25 bg-black/45 text-5xl font-semibold text-white shadow-2xl">
                  {countdown}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/25 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Hướng dẫn trực tiếp</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {coachingMessage}
                </p>
              </div>

              {phase === "assessing" ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                  Hoàn thành {progress}%
                </span>
              ) : null}
            </div>

            <div className="h-2 rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${phase === "assessing" ? progress : 0}%` }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="justify-center rounded-2xl"
                onClick={() => void requestCamera()}
                disabled={cameraState === "requesting" || phase !== "idle"}
              >
                {cameraState === "requesting" ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" aria-hidden />
                    Đang xin quyền camera...
                  </>
                ) : (
                  <>
                    <IconCamera className="size-4" aria-hidden />
                    Bật camera thật
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="justify-center rounded-2xl"
                onClick={enableSimulatedMode}
                disabled={phase !== "idle"}
              >
                <IconSparkles className="size-4" aria-hidden />
                Dùng preview mô phỏng
              </Button>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full justify-center rounded-2xl py-6 text-base"
              onClick={startAssessment}
              disabled={!canStart}
            >
              {phase === "processing" ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" aria-hidden />
                  Đang tạo kết quả...
                </>
              ) : (
                <>
                  <IconPlayerPlay className="size-4" aria-hidden />
                  Bắt đầu bài kiểm tra 20 giây
                </>
              )}
            </Button>
          </div>

          {cameraState === "denied" ? (
            <WarningMessage>
              Quyền truy cập camera đã bị từ chối. Bạn có thể thử lại hoặc dùng
              preview mô phỏng để buổi demo vẫn diễn ra trơn tru.
            </WarningMessage>
          ) : null}

          {cameraState === "unsupported" ? (
            <WarningMessage>
              Môi trường trình duyệt này không hỗ trợ camera API, vì vậy
              preview mô phỏng là phương án fallback phù hợp nhất khi demo.
            </WarningMessage>
          ) : null}

          {phaseError ? (
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>{phaseError}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
          <CardHeader>
            <CardTitle className="text-2xl">Ngữ cảnh phiên đánh giá</CardTitle>
            <CardDescription>
              Kết quả được cá nhân hóa dựa trên các thông tin đầu vào này.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingSession ? (
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm text-muted-foreground">
                <IconLoader2 className="size-4 animate-spin" aria-hidden />
                Đang tải hồ sơ phiên kiểm tra...
              </div>
            ) : sessionError ? (
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p>{sessionError}</p>
              </div>
            ) : session ? (
              <>
                <dl className="space-y-3 text-sm">
                  <InfoRow label="Người tham gia" value={session.fullName} />
                  <InfoRow label="Tuổi" value={String(session.age)} />
                  <InfoRow
                    label="Mục tiêu"
                    value={mobilityGoalLabel[session.mobilityGoal]}
                  />
                  <InfoRow
                    label="Mức tự tin"
                    value={getConfidenceLabel(session.confidenceLevel)}
                  />
                </dl>

                <div className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm leading-7 text-muted-foreground">
                  <p className="font-medium text-foreground">Điều phần này chứng minh</p>
                  <p className="mt-2">
                    Demo này không chỉ là một trang tĩnh. Nó mô hình hóa những
                    trạng thái thật ngoài đời, vốn thường quyết định việc một
                    sản phẩm camera-first tạo cảm giác đáng tin hay gây khó chịu.
                  </p>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
          <CardHeader>
            <CardTitle className="text-xl">Gợi ý khi trình bày</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <p className="font-medium text-foreground">Nếu camera hoạt động</p>
              <p className="mt-1">
                Hãy cho người phỏng vấn thấy bước xin quyền camera, màn preview
                và lớp countdown để nhấn mạnh UX ở runtime.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <p className="font-medium text-foreground">Nếu camera gặp lỗi</p>
              <p className="mt-1">
                Chuyển sang preview mô phỏng và giải thích rằng sản phẩm vẫn giữ
                nguyên được phần còn lại của luồng healthcare.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/assessment"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
              >
                <IconArrowLeft className="size-4" aria-hidden />
                Làm lại từ đầu
              </Link>

              <Button
                type="button"
                variant="ghost"
                className="flex-1 justify-center"
                onClick={resetTimer}
              >
                <IconRefresh className="size-4" aria-hidden />
                Đặt lại bộ đếm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background p-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

function WarningMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
      <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  )
}

function getConfidenceLabel(level: AssessmentSession["confidenceLevel"]): string {
  switch (level) {
    case "low":
      return "Thấp"
    case "medium":
      return "Trung bình"
    default:
      return "Cao"
  }
}

function stopStream(stream: MediaStream | null, video: HTMLVideoElement | null) {
  stream?.getTracks().forEach((track) => track.stop())

  if (video) {
    video.srcObject = null
  }
}
