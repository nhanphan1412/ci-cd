import Link from "next/link"

const links = [
  { href: "/#tinh-nang", label: "Tính năng" },
  { href: "/#quy-trinh", label: "Quy trình" },
  { href: "/progress", label: "Tiến trình" },
  { href: "/assessment", label: "Bắt đầu" },
] as const

export function NavLinks() {
  return (
    <nav className="flex items-center gap-6 text-sm text-muted-foreground">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="transition-colors hover:text-foreground"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
