"use client"
import { cn } from "@/lib/utils"
import { Home, Briefcase, LayoutDashboard, FileText, Newspaper, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HeaderProps {
  role: "employee" | "consultant"
  currentPath?: string
}

export function GreenPathHeader({ role, currentPath = "/" }: HeaderProps) {
  const router = useRouter()

  const employeeNav = [
    { label: "출퇴근", href: "/employee/commute", icon: Home },
    { label: "출장", href: "/employee/trip", icon: Briefcase },
  ]

  const consultantNav = [
    { label: "대시보드", href: "/consultant/dashboard", icon: LayoutDashboard },
    { label: "보고서", href: "/consultant/reports", icon: FileText },
    { label: "뉴스", href: "/consultant/news", icon: Newspaper },
  ]

  const navItems = role === "employee" ? employeeNav : consultantNav
  const roleLabel = role === "employee" ? "임직원" : "ESG 관리자"

  const homePath = role === "employee" ? "/employee/commute" : "/consultant/dashboard"

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo - 역할별 메인 대시보드로 이동 */}
        <Link href={homePath} className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-light tracking-tight text-white">Next</span>
            <span className="text-2xl font-bold tracking-tight text-white">ZERO</span>
            <span className="text-xs align-super text-white/70">™</span>
          </div>
          <div className="flex flex-col">
            {/* Role Label can be kept or removed depending on strict design, keeping for UX context */}
            <span className="text-xs text-muted-foreground ml-2 px-2 py-0.5 rounded-full bg-white/10">{roleLabel}</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? role === "employee"
                      ? "bg-employee-primary/10 text-employee-primary"
                      : "bg-consultant-start/10 text-consultant-start"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="ml-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  )
}
