import { IconActivityHeartbeat } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <IconActivityHeartbeat className="size-5" aria-hidden />
      </span>
      Kinis Balance Demo
    </span>
  )
}
