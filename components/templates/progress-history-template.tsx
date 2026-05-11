import { ProgressHistoryPanel } from "@/components/organisms/progress-history-panel"
import { SiteFooter } from "@/components/organisms/site-footer"
import { SiteHeader } from "@/components/organisms/site-header"
import { Badge } from "@/components/ui/badge"

export function ProgressHistoryTemplate() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-background via-muted/15 to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Tiến trình
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
              Từ một lần đo sang câu chuyện tiến triển theo thời gian.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Màn hình này bổ sung góc nhìn sản phẩm ở cấp cao hơn: không chỉ
              đánh giá một phiên đơn lẻ, mà còn chuẩn bị sẵn cho việc theo dõi
              lịch sử, xu hướng và mức độ cải thiện của người dùng.
            </p>
          </div>
          <ProgressHistoryPanel />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
