"use client"

import { useState } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { GreenPathBadge } from "@/components/ui/greenpath-badge"
import { cn } from "@/lib/utils"
import { FileText, Download, Calendar, Check, BarChart3, FileCheck, Rocket } from "lucide-react"

type ReportType = "monthly" | "quarterly" | "yearly"

interface Report {
  id: string
  name: string
  type: ReportType
  period: string
  size: string
  createdAt: string
  status: "ready" | "processing"
}

const reportTypes = [
  {
    id: "monthly" as ReportType,
    label: "월간 보고서",
    description: "매월 탄소 배출 현황 및 추이 분석",
    icon: FileText,
  },
  {
    id: "quarterly" as ReportType,
    label: "분기 보고서",
    description: "ESG 통합 리포트 및 목표 달성률",
    icon: FileText,
  },
  {
    id: "yearly" as ReportType,
    label: "연간 보고서",
    description: "2028 공시 대응용 종합 보고서",
    icon: FileText,
  },
]

const reports: Report[] = [
  {
    id: "1",
    name: "2026년 1월 탄소 배출 종합 보고서",
    type: "monthly",
    period: "2026.01.01 - 2026.01.31",
    size: "2.4 MB",
    createdAt: "2026-01-14",
    status: "ready",
  },
  {
    id: "2",
    name: "2025년 4분기 ESG 리포트",
    type: "quarterly",
    period: "2025.10.01 - 2025.12.31",
    size: "8.7 MB",
    createdAt: "2026-01-02",
    status: "ready",
  },
  {
    id: "3",
    name: "2025년 연간 탄소 배출 보고서",
    type: "yearly",
    period: "2025.01.01 - 2025.12.31",
    size: "15.3 MB",
    createdAt: "2026-01-05",
    status: "ready",
  },
]

const reportContents = [
  {
    title: "데이터 분석",
    icon: BarChart3,
    items: [
      "Transport Mode별 배출량 상세 분석",
      "차종별 (전기차/하이브리드/내연기관) 구성비",
      "월별/분기별 추이 및 전년 대비 분석",
    ],
  },
  {
    title: "증빙 자료",
    icon: FileCheck,
    items: ["모든 이동 내역의 원천 데이터 및 영수증", "GPS 기반 주행 거리 증빙", "배출량 계산 근거 및 방법론"],
  },
  {
    title: "규제 준수",
    icon: Check,
    items: ["GHG Protocol Scope 3 준수", "KSSB (한국지속가능성기준) 대응", "2028년 공시 의무화 요건 대비"],
  },
  {
    title: "실행 계획",
    icon: Rocket,
    items: ["배출량 감축 목표 및 로드맵", "EV 전환 시뮬레이션 및 투자 계획", "비용 절감 효과 분석"],
  },
]

const getTypeBadgeVariant = (type: ReportType) => {
  const variants: Record<ReportType, string> = {
    monthly: "월간",
    quarterly: "분기",
    yearly: "연간",
  }
  return variants[type]
}

const getTypeBadgeColor = (type: ReportType) => {
  const colors: Record<ReportType, string> = {
    monthly: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    quarterly: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    yearly: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  }
  return colors[type]
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <GreenPathHeader role="consultant" currentPath="/consultant/reports" />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-indigo-600 p-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-white">보고서</h1>
            <p className="text-white/80">감사 대응 및 공시를 위한 상세 보고서를 다운로드하세요</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20">
            <FileText className="h-5 w-5" />새 보고서 생성
          </button>
        </div>

        {/* Report Type Selection */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            return (
              <GreenPathCard
                key={type.id}
                hover
                onClick={() => setSelectedType(isSelected ? null : type.id)}
                className={cn("cursor-pointer transition-all", isSelected && "border-indigo-500/50 bg-indigo-500/5")}
              >
                <GreenPathCardContent className="text-center">
                  <div
                    className={cn(
                      "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                      isSelected ? "bg-indigo-500" : "bg-secondary/50",
                    )}
                  >
                    <Icon className={cn("h-6 w-6", isSelected ? "text-white" : "text-muted-foreground")} />
                  </div>
                  <h3 className={cn("mb-1 font-semibold", isSelected ? "text-foreground" : "text-foreground")}>
                    {type.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </GreenPathCardContent>
              </GreenPathCard>
            )
          })}
        </div>

        {/* Reports List */}
        <GreenPathCard className="mb-8">
          <GreenPathCardContent>
            <h2 className="mb-6 text-lg font-semibold text-foreground">생성된 보고서</h2>

            <div className="space-y-4">
              {reports
                .filter((r) => !selectedType || r.type === selectedType)
                .map((report) => (
                  <div key={report.id} className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-medium text-foreground">{report.name}</p>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                              getTypeBadgeColor(report.type),
                            )}
                          >
                            {getTypeBadgeVariant(report.type)}
                          </span>
                          <GreenPathBadge variant="success" className="gap-1">
                            <Check className="h-3 w-3" />
                            준비완료
                          </GreenPathBadge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{report.period}</span>
                          <span>·</span>
                          <span>{report.size}</span>
                          <span>·</span>
                          <span>생성일: {report.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-600">
                      <Download className="h-5 w-5" />
                      다운로드
                    </button>
                  </div>
                ))}
            </div>
          </GreenPathCardContent>
        </GreenPathCard>

        {/* Report Contents */}
        <GreenPathCard>
          <GreenPathCardContent>
            <h2 className="mb-6 text-lg font-semibold text-foreground">보고서 포함 내용</h2>

            <div className="grid grid-cols-2 gap-6">
              {reportContents.map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.title} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium text-foreground">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-employee-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </GreenPathCardContent>
        </GreenPathCard>
      </main>
    </div>
  )
}
