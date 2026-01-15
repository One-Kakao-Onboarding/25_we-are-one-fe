import Link from "next/link"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { Users, Briefcase, Zap, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Logo & Title Section */}
      <div className="text-center space-y-4 mb-12">

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-7xl font-light tracking-tight text-white">Next</span>
          <span className="text-7xl font-bold tracking-tight text-white">ZERO</span>
          <span className="text-xl align-super text-white/70">™</span>
        </div>
        <p className="text-muted-foreground text-lg">지속가능한 미래를 위한 탄소 중립 플랫폼</p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        {/* Employee Card */}
        <Link href="/login" className="block">
          <GreenPathCard variant="employee" hover className="group h-full cursor-pointer">
            <GreenPathCardContent className="p-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary border border-border/50 mb-8">
                <Users className="h-7 w-7 text-employee-primary" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">임직원으로 로그인</h3>
              <p className="text-muted-foreground text-sm mb-8">출퇴근 및 출장 정보를 간편하게 등록하세요</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-employee-primary flex-shrink-0" />
                  자가용 출근 체크인
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-employee-primary flex-shrink-0" />
                  출장 영수증 등록
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-employee-primary flex-shrink-0" />내 탄소 발자국 확인
                </li>
              </ul>

              <span className="inline-flex items-center gap-1 text-employee-primary font-medium group-hover:gap-2 transition-all">
                시작하기 <ChevronRight className="h-4 w-4" />
              </span>
            </GreenPathCardContent>
          </GreenPathCard>
        </Link>

        {/* Consultant Card */}
        <Link href="/login" className="block">
          <GreenPathCard variant="consultant" hover className="group h-full cursor-pointer">
            <GreenPathCardContent className="p-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary border border-border/50 mb-8">
                <Briefcase className="h-7 w-7 text-consultant-primary" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">ESG 관리자로 로그인</h3>
              <p className="text-muted-foreground text-sm mb-8">전사 탄소 배출 데이터를 통합 관리하세요</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-consultant-primary flex-shrink-0" />
                  통합 대시보드
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-consultant-primary flex-shrink-0" />
                  보고서 다운로드
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-consultant-primary flex-shrink-0" />
                  카카오T 자동 연동
                </li>
              </ul>

              <span className="inline-flex items-center gap-1 text-consultant-primary font-medium group-hover:gap-2 transition-all">
                시작하기 <ChevronRight className="h-4 w-4" />
              </span>
            </GreenPathCardContent>
          </GreenPathCard>
        </Link>
      </div>

      {/* Footer Text */}
      <p className="text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="#" className="text-employee-primary hover:underline font-medium">
          회사 관리자에게 문의하세요
        </Link>
      </p>
    </main>
  )
}
