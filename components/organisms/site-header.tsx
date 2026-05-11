import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { BrandLogo } from "@/components/molecules/brand-logo"
import { NavLinks } from "@/components/molecules/nav-links"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <BrandLogo />
        </Link>
        <div className="hidden sm:block">
          <NavLinks />
        </div>
        <Link
          href="/assessment"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Kiểm tra ngay
        </Link>
      </div>
    </header>
  )
}
