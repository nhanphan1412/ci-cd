import { Suspense } from "react"

import { SessionAssessmentPanel } from "@/components/organisms/session-assessment-panel"
import { SiteFooter } from "@/components/organisms/site-footer"
import { SiteHeader } from "@/components/organisms/site-header"
import { Badge } from "@/components/ui/badge"

export function AssessmentSessionTemplate() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-background via-muted/15 to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Phiên kiểm tra
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
              Thực hiện bài kiểm tra thăng bằng có hướng dẫn.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Trang session thể hiện cách xử lý quyền truy cập, chế độ fallback,
              tiến độ theo thời gian và mô hình hướng dẫn ít gây căng thẳng cho
              người lớn tuổi.
            </p>
          </div>
          <Suspense fallback={<SessionAssessmentFallback />}>
            <SessionAssessmentPanel />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function SessionAssessmentFallback() {
  return (
    <div className="rounded-[32px] border border-border/80 bg-background/95 p-6 text-sm text-muted-foreground shadow-sm shadow-emerald-100/60">
      Đang chuẩn bị phiên đánh giá...
    </div>
  )
}
