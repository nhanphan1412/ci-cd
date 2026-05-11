import {
  IconAccessible,
  IconActivity,
  IconBrain,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const items = [
  {
    title: "Tương tác thân thiện với người lớn tuổi",
    description:
      "Vùng bấm lớn, bề mặt tương phản cao và hướng dẫn từng bước giúp demo dễ theo dõi hơn với người dùng trên 50 tuổi.",
    icon: IconAccessible,
  },
  {
    title: "Luồng đánh giá bằng camera",
    description:
      "Ứng dụng xử lý xin quyền camera, chế độ fallback, trạng thái theo thời gian và phản hồi tiến độ rõ ràng từ setup đến kết quả.",
    icon: IconActivity,
  },
  {
    title: "Ranh giới tích hợp AI rõ ràng",
    description:
      "Kết quả được mock thông qua API contract có cấu trúc rõ ràng, để frontend có thể thay bằng model phân tích chuyển động thật mà không phải thiết kế lại UX.",
    icon: IconBrain,
  },
] as const

export function FeaturesSection() {
  return (
    <section
      id="tinh-nang"
      className="mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="max-w-xl space-y-2">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Vì sao demo này phù hợp với vị trí
        </h2>
        <p className="text-muted-foreground">
          Demo tập trung đúng phần mà một Front-End Engineer có thể thể hiện rõ:
          cấu trúc trải nghiệm sản phẩm, mô hình hóa các trạng thái khó và xây
          UI đủ an toàn, đủ dễ hiểu cho người dùng cuối.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="rounded-[28px] border-border/80 bg-background/90 shadow-sm">
            <CardHeader className="gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="size-5" aria-hidden />
              </span>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
