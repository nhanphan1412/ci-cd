import { Suspense } from "react"

import { ResultSummaryPanel } from "@/components/organisms/result-summary-panel"
import { SiteFooter } from "@/components/organisms/site-footer"
import { SiteHeader } from "@/components/organisms/site-header"
import { Badge } from "@/components/ui/badge"

export function AssessmentResultTemplate() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-background via-muted/15 to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Kết quả đánh giá
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
              Biến điểm số thành hành động cụ thể.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Màn hình kết quả là nơi sản phẩm tạo được niềm tin: diễn giải ngắn
              gọn, bước tiếp theo hợp lý và khuyến nghị đủ cá nhân hóa thay vì
              quá chung chung.
            </p>
          </div>
          <Suspense fallback={<ResultSummaryFallback />}>
            <ResultSummaryPanel />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function ResultSummaryFallback() {
  return (
    <div className="rounded-[32px] border border-border/80 bg-background/95 p-6 text-sm text-muted-foreground shadow-sm shadow-emerald-100/60">
      Đang tải kết quả đánh giá...
    </div>
  )
}
