import { AssessmentSetupForm } from "@/components/organisms/assessment-setup-form"
import { SiteFooter } from "@/components/organisms/site-footer"
import { SiteHeader } from "@/components/organisms/site-header"
import { Badge } from "@/components/ui/badge"

export function AssessmentSetupTemplate() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-background via-muted/15 to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Bước chuẩn bị
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
              Chuẩn bị cho một trải nghiệm đánh giá an toàn và dễ theo dõi hơn.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Màn hình này tập trung vào chất lượng onboarding: thu thập ngữ
              cảnh, xác nhận yếu tố an toàn và chuẩn bị người dùng cho một phiên
              kiểm tra bằng camera ngắn, dễ hiểu.
            </p>
          </div>
          <AssessmentSetupForm />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
