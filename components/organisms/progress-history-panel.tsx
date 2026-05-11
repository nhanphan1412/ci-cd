"use client"

import { type ReactNode, useEffect, useMemo, useState } from "react"
import Link from "next/link"

import {
  IconAlertCircle,
  IconArrowRight,
  IconChartLine,
  IconChecklist,
  IconLoader2,
  IconShieldCheck,
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
  mobilityGoalLabel,
  type AssessmentHistoryItem,
  type AssessmentProgressSummary,
} from "@/lib/mock-assessment-store"

type HistoryResponse = AssessmentProgressSummary

const riskLabel: Record<AssessmentHistoryItem["riskLevel"], string> = {
  low: "Rủi ro thấp",
  moderate: "Rủi ro trung bình",
  elevated: "Cần theo dõi thêm",
}

const riskTone: Record<AssessmentHistoryItem["riskLevel"], string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200",
  moderate:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200",
  elevated:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200",
}

export function ProgressHistoryPanel() {
  const [data, setData] = useState<HistoryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchHistory() {
      setIsLoading(true)

      try {
        const response = await fetch("/api/assessments/history")
        const json = (await response.json()) as HistoryResponse

        if (!response.ok) {
          if (!ignore) {
            setError("Không thể tải dữ liệu tiến trình.")
          }
          return
        }

        if (!ignore) {
          setData(json)
          setError(null)
        }
      } catch {
        if (!ignore) {
          setError("Không thể tải dữ liệu tiến trình.")
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void fetchHistory()

    return () => {
      ignore = true
    }
  }, [])

  const trendLabel = useMemo(() => {
    const delta = data?.overview.latestDelta ?? null
    if (delta === null) {
      return "Cần ít nhất 2 phiên để so sánh xu hướng."
    }
    if (delta > 0) {
      return `Tăng ${delta} điểm so với phiên gần trước.`
    }
    if (delta < 0) {
      return `Giảm ${Math.abs(delta)} điểm so với phiên gần trước.`
    }
    return "Điểm số giữ nguyên so với phiên gần trước."
  }, [data?.overview.latestDelta])

  if (isLoading) {
    return (
      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
          <IconLoader2 className="size-4 animate-spin" aria-hidden />
          Đang tải dữ liệu tiến trình...
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardContent className="py-10">
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="space-y-3">
              <p>{error ?? "Không thể tải dữ liệu tiến trình."}</p>
              <Link
                href="/assessment"
                className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
              >
                Tạo phiên mới
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard
          title="Tổng số phiên hoàn tất"
          value={String(data.overview.totalCompletedSessions)}
          description="Số session đã hoàn thành trong bộ nhớ demo hiện tại."
          icon={<IconChecklist className="size-5" aria-hidden />}
        />
        <MetricCard
          title="Điểm trung bình"
          value={String(data.overview.averageScore)}
          description="Mức điểm trung bình từ các phiên đã được hoàn tất."
          icon={<IconChartLine className="size-5" aria-hidden />}
        />
        <MetricCard
          title="Tỷ lệ rủi ro thấp"
          value={`${data.overview.lowRiskRate}%`}
          description="Tỷ lệ session được hệ thống mock xếp vào nhóm rủi ro thấp."
          icon={<IconShieldCheck className="size-5" aria-hidden />}
        />
        <MetricCard
          title="Xu hướng gần đây"
          value={
            data.overview.latestDelta === null
              ? "Chưa đủ dữ liệu"
              : `${data.overview.latestDelta > 0 ? "+" : ""}${data.overview.latestDelta}`
          }
          description={trendLabel}
          icon={<IconArrowRight className="size-5" aria-hidden />}
        />
      </div>

      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardHeader className="gap-3">
          <CardTitle className="text-2xl">Lịch sử các phiên gần đây</CardTitle>
          <CardDescription className="leading-7">
            Màn hình này giúp demo trông đầy đặn hơn và cho phép bạn nói thêm về
            khả năng mở rộng sản phẩm sang hướng theo dõi tiến triển theo thời gian.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.recentSessions.length === 0 ? (
            <div className="rounded-3xl border border-border/70 bg-muted/25 p-5 text-sm leading-7 text-muted-foreground">
              Chưa có phiên hoàn tất nào. Hãy chạy ít nhất một assessment để
              màn hình tiến trình bắt đầu có dữ liệu.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.recentSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="rounded-[28px] border border-border/70 bg-background p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-medium text-foreground">
                        {session.fullName}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {mobilityGoalLabel[session.mobilityGoal]}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        riskTone[session.riskLevel]
                      )}
                    >
                      {riskLabel[session.riskLevel]}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Điểm số
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                        {session.score}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Hoàn tất lúc
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {new Date(session.completedAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardHeader>
          <CardTitle className="text-2xl">Điểm nên nói với interviewer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <div className="rounded-2xl border border-border/70 bg-background p-4">
            Màn hình này cho thấy sản phẩm không dừng ở một lần đánh giá, mà có
            định hướng mở rộng sang theo dõi tiến triển theo thời gian.
          </div>
          <div className="rounded-2xl border border-border/70 bg-background p-4">
            Dữ liệu hiện vẫn là mock và lưu trong RAM, nhưng API contract đã đủ
            rõ để về sau nối với database hoặc dashboard clinician.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: ReactNode
}) {
  return (
    <Card className="rounded-[28px] border-border/80 bg-background/95 shadow-sm">
      <CardHeader className="gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold tracking-tight text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}
