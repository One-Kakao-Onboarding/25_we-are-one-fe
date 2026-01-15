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
  url: string
}

const newsData: NewsItem[] = [
  {
    id: 1,
    category: "regulation",
    tags: [
      { label: "규제", variant: "regulation" },
      { label: "필독", variant: "error" },
    ],
    title: "[열린송현] ESG 공시, 책임의 시대가 온다",
    description:
      "ESG 공시 의무화 로드맵이 가시화하면서 기업의 시계가 빨라지고 있다. 단순 정보공개를 넘어 입증의 영역으로 전환되며, 현실성 없는 목표는 평판 훼손과 재무 부담이 될 수 있다.",
    source: "서울경제",
    date: "2024-10-16",
    icon: "landmark",
    url: "https://www.sedaily.com/NewsView/2K7AS40WU4",
  },
  {
    id: 2,
    category: "insight",
    tags: [
      { label: "인사이트", variant: "insight" },
      { label: "Scope3", variant: "error" },
    ],
    title: "[칼럼] 탄소회계 기준의 변화, Scope 3 감축이 핵심",
    description:
      "기후공시 체계 전환과 함께 Scope 3가 핵심 공시 영역으로 부상했다. 협력사 활동부터 제품 유통·폐기까지 포함하는 광범위한 영역에 대한 감축 계획 요구가 커지고 있다.",
    source: "파이낸스투데이",
    date: "2025-12-23",
    icon: "chart",
    url: "https://www.fntoday.co.kr/news/articleView.html?idxno=372254",
  },
  {
    id: 3,
    category: "regulation",
    tags: [
      { label: "규제", variant: "regulation" },
      { label: "무역", variant: "error" },
    ],
    title: "‘탄소 무역규제’ 글로벌 공급망 전반으로 확산",
    description:
      "EU의 탄소국경조정제도(CBAM)를 기점으로 영국, 미국 등 주요국이 유사 제도를 도입하며 탄소 무역규제가 글로벌 공급망 전반으로 확산되고 있다.",
    source: "에너지플랫폼뉴스",
    date: "2025-10-15",
    icon: "building",
    url: "https://www.e-platform.net/news/articleView.html?idxno=97033",
  },
  {
    id: 4,
    category: "case",
    tags: [
      { label: "사례", variant: "case" },
      { label: "AI", variant: "success" },
    ],
    title: "구글 AI 모빌리티 솔루션, 연료·탄소 감축 입증",
    description:
      "디지털 전환의 상징인 AI가 친환경 혁신의 주역으로 떠오르고 있다. 구글의 AI 모빌리티 솔루션은 브라질에서 한 달간 탄소 4000톤을 감축하는 성과를 냈다.",
    source: "ESG경제",
    date: "2025-11-21",
    icon: "leaf",
    url: "https://www.esgeconomy.com/news/articleView.html?idxno=13517",
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
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <GreenPathCard hover className="flex flex-col h-full transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
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
                      <h3 className="mb-2 font-semibold text-foreground leading-snug group-hover:text-indigo-400 transition-colors">
                        {news.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {news.description}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{news.date}</span>
                      </div>
                    </div>
                  </div>
                </GreenPathCard>
              </a>
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
