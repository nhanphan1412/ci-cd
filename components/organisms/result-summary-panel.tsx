"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconLoader2,
  IconTrendingUp,
} from "@tabler/icons-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  type AssessmentSession,
  type AssessmentResult,
  mobilityGoalLabel,
} from "@/lib/mock-assessment-store"

type AssessmentSessionResponse =
  | { found: true; session: AssessmentSession }
  | { found: false; error?: string }

const riskStyles: Record<
  AssessmentResult["riskLevel"],
  { badge: string; bar: string; label: string }
> = {
  low: {
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200",
    bar: "bg-emerald-500",
    label: "Rủi ro thấp",
  },
  moderate: {
    badge:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200",
    bar: "bg-amber-500",
    label: "Rủi ro trung bình",
  },
  elevated: {
    badge:
      "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200",
    bar: "bg-rose-500",
    label: "Rủi ro cao hơn",
  },
}

export function ResultSummaryPanel() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId") ?? ""

  const [session, setSession] = useState<AssessmentSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchSession() {
      if (!sessionId) {
        setError("Thiếu sessionId. Vui lòng bắt đầu lại flow demo.")
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const response = await fetch(
          `/api/assessments?sessionId=${encodeURIComponent(sessionId)}`
        )
        const data = (await response.json()) as AssessmentSessionResponse

        if (!response.ok || !data.found) {
          if (!ignore) {
            setError("Không tìm thấy session kết quả.")
            setSession(null)
          }
          return
        }

        if (!ignore) {
          setSession(data.session)
          setError(null)
        }
      } catch {
        if (!ignore) {
          setError("Không thể tải kết quả.")
          setSession(null)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void fetchSession()

    return () => {
      ignore = true
    }
  }, [sessionId])

  const result = session?.result
  const riskStyle = useMemo(
    () => (result ? riskStyles[result.riskLevel] : null),
    [result]
  )

  if (isLoading) {
    return (
      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
          <IconLoader2 className="size-4 animate-spin" aria-hidden />
          Đang tải kết quả đánh giá mock...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border/80 shadow-sm">
        <CardContent className="py-10">
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="space-y-3">
              <p>{error}</p>
              <Link
                href="/assessment"
                className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
              >
                Bắt đầu lại demo
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session || session.status !== "completed" || !result || !riskStyle) {
    return (
      <Card className="border-border/80 shadow-sm">
        <CardContent className="py-10">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
            <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="space-y-3">
              <p>Phiên này vẫn chưa hoàn tất.</p>
              <Link
                href={sessionId ? `/assessment/session?sessionId=${encodeURIComponent(sessionId)}` : "/assessment"}
                className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
              >
                Quay lại session
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">Kết quả đánh giá</CardTitle>
              <CardDescription className="leading-7">
                Điểm số được sinh từ dữ liệu mock, nhưng cấu trúc trình bày được
                thiết kế như một sản phẩm healthcare thực tế: ngắn gọn, dễ hiểu
                và có định hướng hành động rõ ràng cho người dùng.
              </CardDescription>
            </div>
            <span
              className={cn(
                "w-fit rounded-full border px-3 py-1 text-sm font-medium",
                riskStyle.badge
              )}
            >
              {riskStyle.label}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[32px] border border-border/70 bg-gradient-to-br from-emerald-50 to-background p-6 dark:from-emerald-950/20">
              <p className="text-sm font-medium text-muted-foreground">Điểm thăng bằng</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-tight">
                  {result.score}
                </span>
                <span className="pb-2 text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-5 h-3 rounded-full bg-background">
                <div
                  className={cn("h-full rounded-full transition-all", riskStyle.bar)}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Phiên đánh giá đã hoàn tất cho <span className="font-medium text-foreground">{session.fullName}</span>.
              </p>
            </div>

            <div className="rounded-[32px] border border-border/70 bg-background p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <IconTrendingUp className="size-5" aria-hidden />
                </span>
                <p className="text-base font-medium text-foreground">Tóm tắt</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {result.summary}
              </p>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                  <dt className="text-sm text-muted-foreground">Hoàn tất lúc</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {session.completedAt
                      ? new Date(session.completedAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Vừa xong"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                  <dt className="text-sm text-muted-foreground">Trọng tâm đánh giá</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {mobilityGoalLabel[session.mobilityGoal]}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[32px] border border-border/70 bg-background p-6 shadow-sm">
              <p className="text-base font-medium text-foreground">Nhận định chính</p>
              <div className="mt-4 space-y-3">
                {result.observations.map((observation) => (
                  <div
                    key={observation}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/25 p-4"
                  >
                    <IconCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <p className="text-sm leading-7 text-muted-foreground">
                      {observation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-border/70 bg-background p-6 shadow-sm">
              <p className="text-base font-medium text-foreground">Bước tiếp theo</p>
              <div className="mt-4 space-y-3">
                {result.nextSteps.map((step) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm leading-7 text-muted-foreground"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardHeader>
          <CardTitle className="text-2xl">Kế hoạch bài tập gợi ý</CardTitle>
          <CardDescription className="leading-7">
            Các thẻ bài tập này giúp bạn nói về cách sản phẩm chuyển một kết quả
            đánh giá thành hành động tiếp theo, thay vì chỉ dừng ở việc hiển thị điểm số.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {result.exercises.map((exercise) => (
            <div
              key={exercise.title}
              className="rounded-[32px] border border-border/70 bg-background p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-medium text-foreground">
                    {exercise.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exercise.duration}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {exercise.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/assessment" className={cn(buttonVariants(), "justify-center")}>
          Chạy thêm một phiên nữa
        </Link>
        <Link
          href="/progress"
          className={cn(buttonVariants({ variant: "secondary" }), "justify-center")}
        >
          Xem tiến trình
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
        >
          Về trang chủ
          <IconArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
