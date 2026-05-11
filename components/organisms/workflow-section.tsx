import {
  IconChecklist,
  IconDeviceIpad,
  IconSparkles,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const steps = [
  {
    title: "1. Chuẩn bị an toàn",
    description:
      "Người dùng xác nhận đủ ánh sáng, mặt sàn thông thoáng và có sẵn ghế hoặc điểm tựa chắc chắn trước khi bắt đầu.",
    icon: IconChecklist,
  },
  {
    title: "2. Thực hiện phiên có hướng dẫn",
    description:
      "Quyền camera, trạng thái preview và chuỗi hướng dẫn ngắn theo thời gian giúp giảm cảm giác bối rối trong lúc kiểm tra.",
    icon: IconDeviceIpad,
  },
  {
    title: "3. Xem kết quả có thể hành động",
    description:
      "Ứng dụng trả về điểm thăng bằng, nhãn mức độ rủi ro và kế hoạch bài tập tại nhà có cảm giác được cá nhân hóa.",
    icon: IconSparkles,
  },
] as const

export function WorkflowSection() {
  return (
    <section
      id="quy-trinh"
      className="border-y border-border/70 bg-muted/25 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Quy trình để trình bày khi phỏng vấn
          </h2>
          <p className="text-muted-foreground">
            Đây là câu chuyện chính của demo: một flow kiểu healthcare được
            thiết kế cẩn thận, có trạng thái người dùng rõ ràng, pattern tương
            tác dễ tiếp cận và điểm nối sạch giữa UI với lớp AI analysis.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="rounded-[28px] border-border/80 bg-background/90 shadow-sm">
              <CardHeader className="gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription className="leading-7">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
