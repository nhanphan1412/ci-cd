"use client"

import { type FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import {
  IconAlertCircle,
  IconArrowRight,
  IconChecklist,
  IconLoader2,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mobilityGoalLabel, type ConfidenceLevel, type MobilityGoal } from "@/lib/mock-assessment-store"

const inputClassName =
  "mt-2 w-full rounded-3xl border border-border/80 bg-background/90 px-4 py-3 text-base outline-none transition focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"

const safetyItems = [
  { key: "clearArea", label: "Khu vực đứng đủ gọn gàng và không có vật cản dưới sàn." },
  { key: "stableChair", label: "Có ghế chắc chắn hoặc điểm tựa ổn định ở gần." },
  { key: "goodLighting", label: "Không gian đủ sáng để camera nhìn rõ cơ thể." },
] as const

const mobilityGoals: { value: MobilityGoal; label: string }[] = [
  { value: "confidence", label: "Muốn cảm thấy vững hơn trong sinh hoạt hằng ngày" },
  { value: "walking", label: "Muốn đi lại ổn định hơn" },
  { value: "stairs", label: "Muốn tự tin hơn khi lên xuống cầu thang" },
  { value: "recovery", label: "Muốn lấy lại sự tự tin sau một giai đoạn suy giảm" },
]

const confidenceLevels: { value: ConfidenceLevel; label: string }[] = [
  { value: "low", label: "Tôi thường cảm thấy thiếu tự tin khi giữ thăng bằng." },
  { value: "medium", label: "Tôi tạm ổn nhưng muốn yên tâm hơn." },
  { value: "high", label: "Tôi thường thấy khá vững và chỉ muốn kiểm tra thêm." },
]

export function AssessmentSetupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("58")
  const [mobilityGoal, setMobilityGoal] = useState<MobilityGoal>("confidence")
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>("medium")
  const [usesAssistiveDevice, setUsesAssistiveDevice] = useState(false)
  const [safetyChecks, setSafetyChecks] = useState({
    clearArea: false,
    stableChair: false,
    goodLighting: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allSafetyChecksComplete = useMemo(
    () => Object.values(safetyChecks).every(Boolean),
    [safetyChecks]
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (fullName.trim().length < 2) {
      setError("Vui lòng nhập tên người tham gia.")
      return
    }

    if (!allSafetyChecksComplete) {
      setError("Vui lòng xác nhận đầy đủ các điều kiện an toàn trước khi tiếp tục.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          age: Number(age),
          mobilityGoal,
          confidenceLevel,
          usesAssistiveDevice,
          safetyChecks,
        }),
      })

      const data = (await response.json()) as {
        error?: string
        sessionId?: string
      }

      if (!response.ok || !data.sessionId) {
        setError(data.error ?? "Không thể khởi tạo phiên đánh giá.")
        return
      }

      router.push(`/assessment/session?sessionId=${encodeURIComponent(data.sessionId)}`)
    } catch {
      setError("Lỗi mạng. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="rounded-[32px] border-border/80 bg-background/90 shadow-sm shadow-emerald-100/60">
        <CardHeader className="gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IconChecklist className="size-5" aria-hidden />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Trước khi bắt đầu</CardTitle>
            <CardDescription className="leading-7">
              Màn hình này thể hiện tư duy onboarding dành cho người lớn tuổi:
              input đơn giản, xác nhận an toàn rõ ràng và mô tả dễ hiểu về bước
              tiếp theo.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 text-sm leading-7 text-muted-foreground">
          <div className="rounded-3xl border border-border/70 bg-muted/35 p-5">
            <p className="font-medium text-foreground">Demo này đánh giá điều gì</p>
            <ul className="mt-2 space-y-2">
              <li>Phiên kiểm tra thăng bằng ngắn có hướng dẫn và flow xin quyền camera.</li>
              <li>Hướng dẫn thân thiện với người lớn tuổi cùng hành vi fallback khi có sự cố.</li>
              <li>Kết quả mock và kế hoạch bài tập cá nhân hóa sau khi hoàn tất.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-5">
            <p className="font-medium text-foreground">Ý nên nói khi phỏng vấn</p>
            <ul className="mt-2 space-y-2">
              <li>Vì sao flow được tách thành setup, session và results.</li>
              <li>Vì sao API contract này có thể thay bằng AI analysis service thật về sau.</li>
              <li>Vì sao người dùng lớn tuổi cần control lớn hơn và hướng dẫn ít gây áp lực hơn.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100">
            <p className="font-medium">Mục tiêu vận động đã chọn</p>
            <p className="mt-1">{mobilityGoalLabel[mobilityGoal]}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-border/80 bg-background/95 shadow-sm shadow-emerald-100/60">
        <CardHeader>
          <CardTitle className="text-2xl">Tạo phiên demo</CardTitle>
          <CardDescription className="leading-7">
            Hãy dùng thông tin người tham gia đủ thực tế để kết quả tạo ra có
            cảm giác đáng tin hơn khi bạn trình bày.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-foreground">
                Tên người tham gia
                <input
                  className={inputClassName}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Ví dụ: Lan Nguyen"
                  autoComplete="name"
                />
              </label>

              <label className="block text-sm font-medium text-foreground">
                Tuổi
                <input
                  className={inputClassName}
                  type="number"
                  min={50}
                  max={99}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  inputMode="numeric"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-foreground">
                Mục tiêu chính
                <select
                  className={inputClassName}
                  value={mobilityGoal}
                  onChange={(event) =>
                    setMobilityGoal(event.target.value as MobilityGoal)
                  }
                >
                  {mobilityGoals.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-foreground">
                Mức tự tin khi giữ thăng bằng
                <select
                  className={inputClassName}
                  value={confidenceLevel}
                  onChange={(event) =>
                    setConfidenceLevel(event.target.value as ConfidenceLevel)
                  }
                >
                  {confidenceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-3xl border border-border/70 bg-muted/25 p-4">
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-border"
                checked={usesAssistiveDevice}
                onChange={(event) => setUsesAssistiveDevice(event.target.checked)}
              />
              <span className="space-y-1">
                <span className="block text-sm font-medium text-foreground">
                  Người tham gia có dùng gậy, khung tập đi hoặc thiết bị hỗ trợ tương tự.
                </span>
                <span className="block text-sm leading-6 text-muted-foreground">
                  Khi bật tùy chọn này, kế hoạch khuyến nghị mock sẽ thận trọng hơn.
                </span>
              </span>
            </label>

            <div className="space-y-3 rounded-3xl border border-border/70 bg-background p-4">
              <p className="text-sm font-medium text-foreground">
                Checklist an toàn
              </p>
              <div className="space-y-3">
                {safetyItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 rounded-3xl border border-border/70 bg-muted/25 p-4"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 size-4 rounded border-border"
                      checked={safetyChecks[item.key]}
                      onChange={(event) =>
                        setSafetyChecks((current) => ({
                          ...current,
                          [item.key]: event.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm leading-6 text-foreground">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <IconAlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p>{error}</p>
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full justify-center rounded-3xl py-6 text-base shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" aria-hidden />
                  Đang chuẩn bị phiên kiểm tra...
                </>
              ) : (
                <>
                  Tiếp tục đến bước camera
                  <IconArrowRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
