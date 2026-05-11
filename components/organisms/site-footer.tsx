import { Separator } from "@/components/ui/separator"
import { BrandLogo } from "@/components/molecules/brand-logo"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-muted/30">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kinis Balance Demo. Prototype frontend
            cho bài toán đánh giá vận động dành cho người lớn tuổi.
          </p>
        </div>
        <Separator />
        <p className="text-xs leading-6 text-muted-foreground">
          Demo này mô phỏng luồng đánh giá thăng bằng tại nhà bằng camera, tập
          trung vào khả năng tiếp cận, kiến trúc component và ranh giới tích hợp
          AI rõ ràng để sẵn sàng nối backend hoặc model thật.
        </p>
      </div>
    </footer>
  )
}
