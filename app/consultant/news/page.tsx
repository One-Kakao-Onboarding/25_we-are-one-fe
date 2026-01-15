"use client"

import { useState } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import { GreenPathCard } from "@/components/ui/greenpath-card"
import { GreenPathBadge } from "@/components/ui/greenpath-badge"
import { Mail, Landmark, TrendingUp, Lightbulb, Building2, DollarSign, Leaf, Target, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "all" | "regulation" | "trend" | "insight" | "case"

interface NewsItem {
  id: number
  category: Category
  tags: { label: string; variant: "regulation" | "trend" | "insight" | "case" | "error" | "success" }[]
  title: string
  description: string
  source: string
  date: string
  icon: "landmark" | "trending" | "lightbulb" | "building" | "dollar" | "leaf" | "target" | "chart"
}

const newsData: NewsItem[] = [
  {
    id: 1,
    category: "regulation",
    tags: [
      { label: "규제", variant: "regulation" },
      { label: "필독", variant: "error" },
    ],
    title: "2028년 탄소 공시 의무화, 중견기업도 대상 확대",
    description:
      "금융위원회가 기존 자산 2조원 이상 상장사에서 5천억원 이상 중견기업까지 탄소 배출 공시 의무를 확대한다고 발표했습니다.",
    source: "ESG Economy",
    date: "2026-01-13",
    icon: "landmark",
  },
  {
    id: 2,
    category: "trend",
    tags: [
      { label: "트렌드", variant: "trend" },
      { label: "인기", variant: "success" },
    ],
    title: "전기차 법인 택시 비중 40% 돌파... 탄소 감축 효과 입증",
    description:
      "서울시 법인 택시 중 전기차 비중이 40%를 넘어서며 연간 15만 톤의 탄소 배출 감축 효과를 보이고 있습니다.",
    source: "Green Transport",
    date: "2026-01-12",
    icon: "trending",
  },
  {
    id: 3,
    category: "insight",
    tags: [
      { label: "인사이트", variant: "insight" },
      { label: "추천", variant: "success" },
    ],
    title: "Scope 3 산정의 핵심은 '데이터 자동화'",
    description:
      "글로벌 ESG 컨설팅사 분석에 따르면, Scope 3 배출량 산정에 성공한 기업의 85%가 데이터 자동 수집 시스템을 구축했습니다.",
    source: "ESG Insight",
    date: "2026-01-11",
    icon: "lightbulb",
  },
  {
    id: 4,
    category: "case",
    tags: [
      { label: "사례", variant: "case" },
      { label: "사례", variant: "case" },
    ],
    title: "A사, 카카오T 연동으로 탄소 회계 처리 시간 90% 단축",
    description:
      "중견 제조업체 A사가 카카오 T 비즈니스 연동을 통해 출장 및 물류 탄소 데이터 처리 시간을 월 80시간에서 8시간으로 줄였습니다.",
    source: "Business Case Study",
    date: "2026-01-10",
    icon: "building",
  },
  {
    id: 5,
    category: "regulation",
    tags: [
      { label: "규제", variant: "regulation" },
      { label: "필독", variant: "error" },
    ],
    title: "EU CBAM 적용 본격화... 수출 기업 탄소 증명 필수",
    description:
      "유럽연합의 탄소국경조정제도(CBAM)가 본격 시행되며, EU 수출 기업들의 탄소 배출 증명이 필수가 되었습니다.",
    source: "Global Trade",
    date: "2026-01-09",
    icon: "landmark",
  },
  {
    id: 6,
    category: "trend",
    tags: [
      { label: "트렌드", variant: "trend" },
      { label: "인기", variant: "success" },
    ],
    title: "ESG 평가 항목에 '임직원 출퇴근 탄소 관리' 추가",
    description: "주요 ESG 평가기관들이 기업의 임직원 출퇴근 탄소 관리 여부를 평가 항목에 포함하기 시작했습니다.",
    source: "ESG Rating",
    date: "2026-01-08",
    icon: "target",
  },
  {
    id: 7,
    category: "insight",
    tags: [
      { label: "인사이트", variant: "insight" },
      { label: "추천", variant: "success" },
    ],
    title: "탄소 배출권 가격 톤당 5만원 돌파 전망",
    description:
      "국내 탄소배출권 시장에서 톤당 가격이 5만원을 돌파할 것으로 예상되며, 기업들의 감축 노력이 더욱 중요해졌습니다.",
    source: "Carbon Market",
    date: "2026-01-07",
    icon: "dollar",
  },
  {
    id: 8,
    category: "case",
    tags: [
      { label: "사례", variant: "case" },
      { label: "사례", variant: "case" },
    ],
    title: "B사, EV 전환으로 연간 5억원 유류비 절감 성공",
    description:
      "물류 기업 B사가 법인 차량의 70%를 전기차로 전환하여 연간 5억원의 유류비를 절감하고 탄소 배출을 60% 감축했습니다.",
    source: "Success Story",
    date: "2026-01-06",
    icon: "leaf",
  },
]

const categories = [
  { id: "all" as Category, label: "전체" },
  { id: "regulation" as Category, label: "규제" },
  { id: "trend" as Category, label: "트렌드" },
  { id: "insight" as Category, label: "인사이트" },
  { id: "case" as Category, label: "사례" },
]

const iconMap = {
  landmark: Landmark,
  trending: TrendingUp,
  lightbulb: Lightbulb,
  building: Building2,
  dollar: DollarSign,
  leaf: Leaf,
  target: Target,
  chart: BarChart3,
}

const iconColorMap = {
  landmark: "bg-purple-500/20 text-purple-400",
  trending: "bg-indigo-500/20 text-indigo-400",
  lightbulb: "bg-amber-500/20 text-amber-400",
  building: "bg-blue-500/20 text-blue-400",
  dollar: "bg-amber-500/20 text-amber-400",
  leaf: "bg-green-500/20 text-green-400",
  target: "bg-indigo-500/20 text-indigo-400",
  chart: "bg-blue-500/20 text-blue-400",
}

export default function ConsultantNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")

  const filteredNews =
    selectedCategory === "all" ? newsData : newsData.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <GreenPathHeader role="consultant" currentPath="/consultant/news" />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl bg-indigo-600 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">ESG 뉴스</h1>
              <p className="mt-2 text-white/80">최신 탄소 규제 동향과 업계 트렌드를 확인하세요</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20">
              <Mail className="h-4 w-4" />
              매일 업데이트
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === category.id
                  ? "bg-indigo-500 text-white"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNews.map((news) => {
            const Icon = iconMap[news.icon]
            return (
              <GreenPathCard key={news.id} hover className="flex flex-col">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      iconColorMap[news.icon],
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    {/* Tags */}
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {news.tags.map((tag, idx) => (
                        <GreenPathBadge key={idx} variant={tag.variant}>
                          {tag.label}
                        </GreenPathBadge>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 font-semibold text-foreground leading-snug">{news.title}</h3>

                    {/* Description */}
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{news.description}</p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <span>{news.source}</span>
                      <span>{news.date}</span>
                    </div>
                  </div>
                </div>
              </GreenPathCard>
            )
          })}
        </div>

        {/* Load More Button */}
        <div className="mt-8 flex justify-center">
          <button className="rounded-lg border border-border/50 bg-card px-8 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:text-foreground">
            더 많은 뉴스 보기
          </button>
        </div>
      </main>
    </div>
  )
}
