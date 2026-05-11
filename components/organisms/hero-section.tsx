import Link from "next/link"

import {
  IconActivityHeartbeat,
  IconArrowRight,
  IconChecklist,
  IconShieldCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-emerald-100/70 via-background to-background px-4 py-16 sm:px-6 sm:py-24 dark:from-emerald-950/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary),transparent_82%),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary),white_88%),transparent)] opacity-60" />
      <div className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1 text-sm">
            <IconActivityHeartbeat className="size-3.5" aria-hidden />
            Demo phỏng vấn Front-End cho Kinis.ai
          </Badge>
          <div className="max-w-2xl space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Bài kiểm tra thăng bằng có hướng dẫn bằng camera, tối ưu cho trải nghiệm tại nhà.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Đây là một prototype định hướng sản phẩm, mô phỏng trải nghiệm
              đánh giá vận động tại nhà cho người lớn tuổi: onboarding an toàn,
              camera readiness, phiên hướng dẫn ngắn và khuyến nghị cá nhân hóa
              sau khi hoàn tất.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/assessment" className={cn(buttonVariants({ size: "lg" }))}>
              Bắt đầu kiểm tra
              <IconArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/#quy-trinh"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Xem quy trình
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-3xl border border-border/70 bg-background/90 px-4 py-4 shadow-sm">
              <p className="font-medium text-foreground">UX ưu tiên người lớn tuổi</p>
              <p className="mt-1 leading-6">Vùng bấm lớn, ngôn ngữ đơn giản và bước tiếp theo luôn rõ ràng.</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 px-4 py-4 shadow-sm">
              <p className="font-medium text-foreground">Luồng camera rõ ràng</p>
              <p className="mt-1 leading-6">Xử lý quyền truy cập, preview trực tiếp và fallback an toàn khi có sự cố.</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 px-4 py-4 shadow-sm">
              <p className="font-medium text-foreground">Sẵn sàng tích hợp AI</p>
              <p className="mt-1 leading-6">Hôm nay dùng kết quả mock, sau này thay bằng lớp phân tích thật mà không đổi UX.</p>
            </div>
          </div>
        </div>
        <Card className="border-border/80 bg-background/95 shadow-xl shadow-emerald-100/70 dark:shadow-none">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit gap-1.5">
              <IconShieldCheck className="size-3.5" aria-hidden />
              Góc nhìn sản phẩm
            </Badge>
            <CardTitle className="text-2xl">Một prototype gọn, nhưng đủ chiều sâu để thảo luận trong phỏng vấn.</CardTitle>
            <CardDescription className="leading-7">
              Mục tiêu không phải tái hiện độ chính xác lâm sàng. Mục tiêu là
              chứng minh năng lực thiết kế và triển khai một hệ thống Front-End
              đủ chắc cho một workflow healthcare, nơi sự rõ ràng, độ tin cậy và
              khả năng xử lý trạng thái là yếu tố cốt lõi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-muted/40 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <IconChecklist className="size-5" aria-hidden />
                </span>
                <div className="space-y-1">
                  <p className="font-medium">Flow chính của sản phẩm</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Bước chuẩn bị, checklist an toàn, quyền camera, bài kiểm tra
                    thăng bằng 20 giây có hướng dẫn và màn hình kết quả.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Khả năng tiếp cận", "Bố cục tương phản tốt, chữ dễ đọc và phù hợp với người dùng từ 50 tuổi trở lên."],
                ["Kỹ thuật", "Component tái sử dụng được, API contract rõ ràng và dữ liệu mock đủ nhất quán để trình bày."],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border/70 bg-background p-4 shadow-sm"
                >
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
