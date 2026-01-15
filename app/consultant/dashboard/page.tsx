"use client"

import { useState } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { GreenPathBadge } from "@/components/ui/greenpath-badge"
import { Car, Plane, Truck, Download, Zap, Target } from "lucide-react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line, ComposedChart, Area } from "recharts"

const yearlyData = [
  { year: "2019", 출퇴근: 12000, 출장: 8000, "택시/물류": 5000, 목표: 25000 },
  { year: "2020", 출퇴근: 10500, 출장: 4000, "택시/물류": 4200, 목표: 23000 },
  { year: "2021", 출퇴근: 9800, 출장: 5500, "택시/물류": 3800, 목표: 21000 },
  { year: "2022", 출퇴근: 8500, 출장: 6200, "택시/물류": 3500, 목표: 19000 },
  { year: "2023", 출퇴근: 7200, 출장: 5800, "택시/물류": 3200, 목표: 17000 },
  { year: "2024", 출퇴근: 6000, 출장: 4500, "택시/물류": 2800, 목표: 15000 },
  { year: "2025", 출퇴근: 4800, 출장: 3200, "택시/물류": 2400, 목표: 13000 },
  { year: "2026", 출퇴근: 2000, 출장: 1200, "택시/물류": 900, 목표: 11000 },
]

const monthlyData2026 = [
  {
    month: "1월",
    출퇴근: 800,
    출장: 450,
    "택시/물류": 320,
    누적출퇴근: 800,
    누적출장: 450,
    "누적택시/물류": 320,
    월목표: 1800,
    누적목표: 1800,
  },
  {
    month: "2월",
    출퇴근: 750,
    출장: 380,
    "택시/물류": 280,
    누적출퇴근: 1550,
    누적출장: 830,
    "누적택시/물류": 600,
    월목표: 1700,
    누적목표: 3500,
  },
  {
    month: "3월",
    출퇴근: 720,
    출장: 420,
    "택시/물류": 300,
    누적출퇴근: 2270,
    누적출장: 1250,
    "누적택시/물류": 900,
    월목표: 1600,
    누적목표: 5100,
  },
  {
    month: "4월",
    출퇴근: 680,
    출장: 350,
    "택시/물류": 270,
    누적출퇴근: 2950,
    누적출장: 1600,
    "누적택시/물류": 1170,
    월목표: 1500,
    누적목표: 6600,
  },
  {
    month: "5월",
    출퇴근: 650,
    출장: 320,
    "택시/물류": 250,
    누적출퇴근: 3600,
    누적출장: 1920,
    "누적택시/물류": 1420,
    월목표: 1450,
    누적목표: 8050,
  },
  {
    month: "6월",
    출퇴근: 620,
    출장: 300,
    "택시/물류": 230,
    누적출퇴근: 4220,
    누적출장: 2220,
    "누적택시/물류": 1650,
    월목표: 1400,
    누적목표: 9450,
  },
  {
    month: "7월",
    출퇴근: 600,
    출장: 280,
    "택시/물류": 220,
    누적출퇴근: 4820,
    누적출장: 2500,
    "누적택시/물류": 1870,
    월목표: 1350,
    누적목표: 10800,
  },
  {
    month: "8월",
    출퇴근: 580,
    출장: 260,
    "택시/물류": 200,
    누적출퇴근: 5400,
    누적출장: 2760,
    "누적택시/물류": 2070,
    월목표: 1300,
    누적목표: 12100,
  },
  {
    month: "9월",
    출퇴근: 550,
    출장: 240,
    "택시/물류": 180,
    누적출퇴근: 5950,
    누적출장: 3000,
    "누적택시/물류": 2250,
    월목표: 1250,
    누적목표: 13350,
  },
  {
    month: "10월",
    출퇴근: 520,
    출장: 220,
    "택시/물류": 160,
    누적출퇴근: 6470,
    누적출장: 3220,
    "누적택시/물류": 2410,
    월목표: 1200,
    누적목표: 14550,
  },
  {
    month: "11월",
    출퇴근: 500,
    출장: 200,
    "택시/물류": 150,
    누적출퇴근: 6970,
    누적출장: 3420,
    "누적택시/물류": 2560,
    월목표: 1150,
    누적목표: 15700,
  },
  {
    month: "12월",
    출퇴근: 480,
    출장: 180,
    "택시/물류": 140,
    누적출퇴근: 7450,
    누적출장: 3600,
    "누적택시/물류": 2700,
    월목표: 1100,
    누적목표: 16800,
  },
]

const vehicleData = [
  { name: "전기차", value: 1250, color: "#22C55E" },
  { name: "하이브리드", value: 890, color: "#3B82F6" },
  { name: "내연기관", value: 2340, color: "#EF4444" },
]

const tripData = [
  { name: "국내선", value: 2150, color: "#EC4899" },
  { name: "국제선", value: 1890, color: "#A855F7" },
]

const taxiData = [
  { name: "택시", value: 450, color: "#22C55E" },
  { name: "배/물류", value: 230, color: "#6366F1" },
  { name: "바이크", value: 0, color: "#F59E0B" },
]

const kakaoTData = [
  {
    id: "KT-001",
    date: "2026-01-14 09:23",
    type: "택시",
    route: "강남역 → 판교테크노밸리",
    vehicle: "전기차",
    distance: "12.4 km",
    emission: "0 kg/CO₂",
    points: 300,
  },
  {
    id: "KT-002",
    date: "2026-01-14 10:15",
    type: "퀵",
    route: "여의도 → 홍대입구",
    vehicle: "하이브리드",
    distance: "8.7 km",
    emission: "1.2 kg/CO₂",
    points: null,
  },
  {
    id: "KT-003",
    date: "2026-01-14 11:42",
    type: "퀵",
    route: "강남역 → 삼성역",
    vehicle: "오토바이",
    distance: "5.3 km",
    emission: "0.8 kg/CO₂",
    points: null,
  },
  {
    id: "KT-004",
    date: "2026-01-13 14:20",
    type: "바이크",
    route: "서울역 → 시청",
    vehicle: "전기차",
    distance: "3.2 km",
    emission: "0 kg/CO₂",
    points: 300,
  },
  {
    id: "KT-005",
    date: "2026-01-13 16:45",
    type: "퀵",
    route: "인천 → 서울",
    vehicle: "내연기관",
    distance: "18.5 km",
    emission: "3.7 kg/CO₂",
    points: null,
  },
]

const commuteData = [
  {
    id: "CM-001",
    employee: "김철수",
    date: "2026-01-14",
    method: "친환경",
    subType: "대중교통",
    distance: "-",
    emission: "0 kg/CO₂",
    points: 300,
  },
  {
    id: "CM-002",
    employee: "이영희",
    date: "2026-01-14",
    method: "자가용",
    subType: "하이브리드",
    distance: "15.2 km",
    emission: "2.1 kg/CO₂",
    points: null,
  },
  {
    id: "CM-003",
    employee: "박민수",
    date: "2026-01-13",
    method: "친환경",
    subType: "전기차",
    distance: "12.0 km",
    emission: "0 kg/CO₂",
    points: 300,
  },
  {
    id: "CM-004",
    employee: "최지은",
    date: "2026-01-13",
    method: "자가용",
    subType: "내연기관",
    distance: "18.5 km",
    emission: "3.1 kg/CO₂",
    points: null,
  },
  {
    id: "CM-005",
    employee: "정수현",
    date: "2026-01-12",
    method: "친환경",
    subType: "도보",
    distance: "-",
    emission: "0 kg/CO₂",
    points: 300,
  },
]

const tripDataList = [
  {
    id: "TR-001",
    employee: "김철수",
    date: "2026-01-12",
    transport: "항공",
    route: "김포공항 → 제주공항",
    distance: "452 km",
    emission: "95.4 kg/CO₂",
    receipt: true,
  },
  {
    id: "TR-002",
    employee: "이영희",
    date: "2026-01-10",
    transport: "기차",
    route: "서울역 → 부산역",
    distance: "417 km",
    emission: "12.5 kg/CO₂",
    receipt: true,
  },
  {
    id: "TR-003",
    employee: "박민수",
    date: "2026-01-08",
    transport: "버스",
    route: "서울 → 대전",
    distance: "164 km",
    emission: "9.8 kg/CO₂",
    receipt: false,
  },
]

const getVehicleBadgeVariant = (vehicle: string) => {
  switch (vehicle) {
    case "전기차":
      return "success"
    case "하이브리드":
      return "info"
    case "오토바이":
      return "warning"
    case "내연기관":
      return "danger"
    default:
      return "default"
  }
}

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "택시":
      return "info"
    case "퀵":
      return "default"
    case "바이크":
      return "consultant"
    default:
      return "default"
  }
}

const getCommuteMethodVariant = (method: string) => {
  return method === "친환경" ? "success" : "danger"
}

const getCommuteSubTypeVariant = (subType: string) => {
  switch (subType) {
    case "대중교통":
    case "도보":
    case "T바이크":
    case "전기차":
      return "success"
    case "하이브리드":
      return "info"
    case "내연기관":
      return "danger"
    default:
      return "default"
  }
}

const getTripTransportVariant = (transport: string) => {
  switch (transport) {
    case "기차":
      return "success"
    case "버스":
      return "info"
    case "항공":
      return "warning"
    default:
      return "default"
  }
}

const getTotalPoints = () => {
  const kakaoPoints = kakaoTData.reduce((sum, row) => sum + (row.points || 0), 0)
  const commutePoints = commuteData.reduce((sum, row) => sum + (row.points || 0), 0)
  return kakaoPoints + commutePoints
}

const getPointsCount = () => {
  const kakaoCount = kakaoTData.filter((row) => row.points !== null).length
  const commuteCount = commuteData.filter((row) => row.points !== null).length
  return kakaoCount + commuteCount
}

const getCurrentMonthData = () => {
  const currentMonth = monthlyData2026[0] // 1월 데이터
  const totalEmission = currentMonth.누적출퇴근 + currentMonth.누적출장 + currentMonth["누적택시/물류"]
  const target = currentMonth.누적목표
  const percentage = ((totalEmission / target) * 100).toFixed(1)
  const remaining = target - totalEmission
  const isUnderTarget = totalEmission <= target

  return {
    totalEmission,
    target,
    percentage,
    remaining,
    isUnderTarget,
  }
}

export default function ConsultantDashboardPage() {
  const monthData = getCurrentMonthData()
  const [compareYear1, setCompareYear1] = useState("2019")
  const [compareYear2, setCompareYear2] = useState("2026")
  const [activityTab, setActivityTab] = useState<"commute" | "trip" | "kakao">("commute")

  const getYearTotal = (year: string) => {
    const data = yearlyData.find((d) => d.year === year)
    if (!data) return 0
    return data.출퇴근 + data.출장 + data["택시/물류"]
  }

  const year1Total = getYearTotal(compareYear1)
  const year2Total = getYearTotal(compareYear2)
  const reductionAmount = year1Total - year2Total
  const reductionPercent = year1Total > 0 ? ((reductionAmount / year1Total) * 100).toFixed(1) : "0"
  const isReduced = reductionAmount > 0

  return (
    <div className="min-h-screen bg-background">
      <GreenPathHeader role="consultant" currentPath="/consultant/dashboard" />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-indigo-600 p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">ESG 통합 대시보드</h1>
              <p className="text-white/80">전사 탄소 배출 데이터를 실시간으로 모니터링하세요</p>
            </div>

            {/* 카카오T 동기화 버튼 - 상단 오른쪽 고정 */}
            <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#1E1E1E] hover:bg-gray-100 transition-all shadow-lg shrink-0">
              <img src="/images/kakaotalk-photo-2026-01-15-11-01-04.png" alt="카카오T" className="h-5 w-5 rounded" />
              실시간 연동
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <p className="text-xs text-white/70 mb-1">이번 달 총 배출량</p>
              <p className="text-3xl font-bold text-white">{monthData.totalEmission}</p>
              <p className="text-xs text-white/60">kg/CO₂</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <p className="text-xs text-white/70 mb-1">전월 대비</p>
              <p className="text-3xl font-bold text-white flex items-center gap-1">
                <span className="text-lg">↘</span> 8.5%
              </p>
              <p className="text-xs text-white/60">개선</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <p className="text-xs text-white/70 mb-1">EV 이용률</p>
              <p className="text-3xl font-bold text-white">27.9%</p>
              <p className="text-xs text-employee-primary">↑ 5.2%p</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <p className="text-xs text-white/70 mb-1">참여 직원 수</p>
              <p className="text-3xl font-bold text-white">1,247</p>
              <p className="text-xs text-white/60">/ 1,500명</p>
            </div>
          </div>
        </div>

        {/* Pie Charts Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* 차량 - 개인 출퇴근 */}
          <GreenPathCard variant="consultant">
            <GreenPathCardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Car className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">차량</h3>
                  <p className="text-xs text-muted-foreground">개인 출퇴근</p>
                </div>
              </div>

              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {vehicleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {vehicleData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium">{item.value.toLocaleString()} kg/CO₂</span>
                  </div>
                ))}
              </div>
            </GreenPathCardContent>
          </GreenPathCard>

          {/* 비행기 - 출장 */}
          <GreenPathCard variant="consultant">
            <GreenPathCardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Plane className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">비행기</h3>
                  <p className="text-xs text-muted-foreground">출장</p>
                </div>
              </div>

              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tripData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {tripData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {tripData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium">{item.value.toLocaleString()} kg/CO₂</span>
                  </div>
                ))}
              </div>
            </GreenPathCardContent>
          </GreenPathCard>

          {/* 택시/물류 */}
          <GreenPathCard variant="consultant">
            <GreenPathCardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">택시/물류</h3>
                    <p className="text-xs text-muted-foreground">카카오T 연동</p>
                  </div>
                </div>
                <GreenPathBadge variant="consultant" size="sm">
                  <Zap className="h-3 w-3 mr-1" />
                  자동
                </GreenPathBadge>
              </div>

              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taxiData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {taxiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {taxiData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium">{item.value.toLocaleString()} kg/CO₂</span>
                  </div>
                ))}
              </div>
            </GreenPathCardContent>
          </GreenPathCard>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* 그래프 - 2/3 너비 */}
          <GreenPathCard variant="consultant" className="col-span-2">
            <GreenPathCardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">카테고리별 연도별 추이</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span>목표 대비 현황</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm text-indigo-400 hover:underline">
                  <Download className="h-4 w-4" />
                  데이터 다운로드
                </button>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={yearlyData}>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#161B26",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString()} kg/CO₂`,
                        name === "목표" ? "🎯 " + name : name,
                      ]}
                    />
                    {/* Stacked Area - 카테고리별 */}
                    <Area
                      type="monotone"
                      dataKey="택시/물류"
                      stackId="1"
                      fill="#EF4444"
                      fillOpacity={0.8}
                      stroke="#EF4444"
                      strokeWidth={1}
                    />
                    <Area
                      type="monotone"
                      dataKey="출장"
                      stackId="1"
                      fill="#F59E0B"
                      fillOpacity={0.8}
                      stroke="#F59E0B"
                      strokeWidth={1}
                    />
                    <Area
                      type="monotone"
                      dataKey="출퇴근"
                      stackId="1"
                      fill="#3B82F6"
                      fillOpacity={0.8}
                      stroke="#3B82F6"
                      strokeWidth={1}
                    />
                    {/* 목표 점선 */}
                    <Line
                      type="monotone"
                      dataKey="목표"
                      stroke="#22C55E"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ fill: "#22C55E", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* 범례 설명 */}
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#3B82F6]" />
                  <span>출퇴근</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#F59E0B]" />
                  <span>출장</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#EF4444]" />
                  <span>택시/물류</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-6 border-t-2 border-dashed border-[#22C55E]" />
                  <span>탄소절감 목표</span>
                </div>
              </div>
            </GreenPathCardContent>
          </GreenPathCard>

          {/* 연도 비교 패널 - 1/3 너비 */}
          <GreenPathCard variant="consultant">
            <GreenPathCardContent className="p-6 h-full flex flex-col">
              <h3 className="font-semibold text-foreground mb-4">연도별 배출량 비교</h3>

              {/* 연도 선택 */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">기준 연도</label>
                  <select
                    value={compareYear1}
                    onChange={(e) => setCompareYear1(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {yearlyData.map((d) => (
                      <option key={d.year} value={d.year}>
                        {d.year}년
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">비교 연도</label>
                  <select
                    value={compareYear2}
                    onChange={(e) => setCompareYear2(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {yearlyData.map((d) => (
                      <option key={d.year} value={d.year}>
                        {d.year}년
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 비교 결과 */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    {compareYear1}년 대비 {compareYear2}년
                  </p>
                  <p className={`text-4xl font-bold ${isReduced ? "text-employee-primary" : "text-red-500"}`}>
                    {isReduced ? "↓" : "↑"} {Math.abs(Number(reductionPercent))}%
                  </p>
                  <p className={`text-sm mt-1 ${isReduced ? "text-employee-primary" : "text-red-500"}`}>
                    {isReduced ? "절감" : "증가"}
                  </p>
                </div>

                {/* 상세 수치 */}
                <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{compareYear1}년 총 배출량</span>
                    <span className="text-foreground font-medium">{year1Total.toLocaleString()} kg/CO₂</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{compareYear2}년 총 배출량</span>
                    <span className="text-foreground font-medium">{year2Total.toLocaleString()} kg/CO₂</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">{isReduced ? "절감량" : "증가량"}</span>
                    <span className={`font-medium ${isReduced ? "text-employee-primary" : "text-red-500"}`}>
                      {isReduced ? "-" : "+"}
                      {Math.abs(reductionAmount).toLocaleString()} kg/CO₂
                    </span>
                  </div>
                </div>
              </div>
            </GreenPathCardContent>
          </GreenPathCard>
        </div>

        <GreenPathCard variant="consultant" className="mb-8">
          <GreenPathCardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">2026년 월별 누적 배출량 vs 목표</h3>
                <GreenPathBadge variant={monthData.isUnderTarget ? "success" : "danger"} size="sm">
                  현재 목표 대비 {monthData.percentage}%
                </GreenPathBadge>
              </div>
              <button className="flex items-center gap-2 text-sm text-indigo-400 hover:underline">
                <Download className="h-4 w-4" />
                데이터 다운로드
              </button>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData2026}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161B26",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} kg/CO₂`,
                      name === "누적목표" ? "🎯 목표" : name.replace("누적", ""),
                    ]}
                  />
                  {/* Stacked Area - 월별 누적 카테고리별 */}
                  <Area
                    type="monotone"
                    dataKey="누적택시/물류"
                    stackId="1"
                    fill="#EF4444"
                    fillOpacity={0.7}
                    stroke="#EF4444"
                    strokeWidth={1}
                    name="누적택시/물류"
                  />
                  <Area
                    type="monotone"
                    dataKey="누적출장"
                    stackId="1"
                    fill="#F59E0B"
                    fillOpacity={0.7}
                    stroke="#F59E0B"
                    strokeWidth={1}
                    name="누적출장"
                  />
                  <Area
                    type="monotone"
                    dataKey="누적출퇴근"
                    stackId="1"
                    fill="#3B82F6"
                    fillOpacity={0.7}
                    stroke="#3B82F6"
                    strokeWidth={1}
                    name="누적출퇴근"
                  />
                  {/* 누적 목표 점선 */}
                  <Line
                    type="monotone"
                    dataKey="누적목표"
                    stroke="#22C55E"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={{ fill: "#22C55E", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* 범례 설명 */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#3B82F6]" />
                <span>출퇴근</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#F59E0B]" />
                <span>출장</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#EF4444]" />
                <span>택시/물류</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-6 border-t-2 border-dashed border-[#22C55E]" />
                <span>누적 목표</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">현재 누적 배출량</p>
                <p className="text-xl font-bold text-foreground">{monthData.totalEmission.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">kg/CO₂</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">현재 누적 목표</p>
                <p className="text-xl font-bold text-foreground">{monthData.target.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">kg/CO₂</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">목표 대비 배출률</p>
                <p
                  className={`text-xl font-bold ${monthData.isUnderTarget ? "text-employee-primary" : "text-red-500"}`}
                >
                  {monthData.percentage}%
                </p>
                <p className="text-xs text-muted-foreground">{monthData.isUnderTarget ? "목표 이내" : "목표 초과"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {monthData.isUnderTarget ? "목표 여유량" : "목표 초과량"}
                </p>
                <p
                  className={`text-xl font-bold ${monthData.isUnderTarget ? "text-employee-primary" : "text-red-500"}`}
                >
                  {monthData.isUnderTarget
                    ? monthData.remaining.toLocaleString()
                    : Math.abs(monthData.remaining).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">kg/CO₂</p>
              </div>
            </div>
          </GreenPathCardContent>
        </GreenPathCard>

        {/* 임직원 활동 데이터 통합 섹션 */}
        <GreenPathCard variant="consultant">
          <GreenPathCardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">임직원 활동 데이터</h3>
                  <p className="text-xs text-muted-foreground">출퇴근, 출장, 카카오T 연동 데이터 통합 조회</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">이번 달 포인트 지급 건수</p>
                  <p className="text-lg font-bold text-foreground">{getPointsCount()}건</p>
                </div>
                <div className="h-10 w-px bg-border/50" />
                <div className="rounded-xl bg-employee-primary/10 border border-employee-primary/30 px-4 py-2">
                  <p className="text-xs text-employee-primary mb-1">이번 달 총 지출 포인트</p>
                  <p className="text-xl font-bold text-employee-primary">{getTotalPoints().toLocaleString()}P</p>
                </div>
              </div>
            </div>

            {/* 탭 헤더 */}
            <div className="flex gap-2 mb-4 border-b border-border/50 pb-2">
              <button
                onClick={() => setActivityTab("commute")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activityTab === "commute"
                    ? "text-white bg-indigo-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                출퇴근
              </button>
              <button
                onClick={() => setActivityTab("trip")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activityTab === "trip"
                    ? "text-white bg-indigo-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                출장
              </button>
              <button
                onClick={() => setActivityTab("kakao")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                  activityTab === "kakao"
                    ? "text-white bg-indigo-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <img src="/images/kakaotalk-photo-2026-01-15-11-01-04.png" alt="카카오T" className="h-4 w-4 rounded" />
                카카오T
              </button>
            </div>

            {/* 탭 내용 */}
            {activityTab === "commute" && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4 text-indigo-400" />
                  출퇴근 기록
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">ID</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">직원</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">날짜</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">출근 방법</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">세부 유형</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">거리</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">배출량</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">지급 포인트</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commuteData.map((row) => (
                        <tr key={row.id} className="border-b border-border/30">
                          <td className="py-3 text-sm text-muted-foreground">{row.id}</td>
                          <td className="py-3 text-sm text-foreground">{row.employee}</td>
                          <td className="py-3 text-sm text-foreground">{row.date}</td>
                          <td className="py-3">
                            <GreenPathBadge variant={getCommuteMethodVariant(row.method)} size="sm">
                              {row.method}
                            </GreenPathBadge>
                          </td>
                          <td className="py-3">
                            <GreenPathBadge variant={getCommuteSubTypeVariant(row.subType)} size="sm">
                              {row.subType}
                            </GreenPathBadge>
                          </td>
                          <td className="py-3 text-sm text-foreground">{row.distance}</td>
                          <td className="py-3 text-sm text-foreground">{row.emission}</td>
                          <td className="py-3">
                            {row.points ? (
                              <GreenPathBadge variant="success" size="sm">
                                <Zap className="h-3 w-3 mr-1" />
                                {row.points}P
                              </GreenPathBadge>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activityTab === "trip" && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-indigo-400" />
                  출장 기록
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">ID</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">직원</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">날짜</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">교통수단</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">경로</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">거리</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">배출량</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">영수증</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripDataList.map((row) => (
                        <tr key={row.id} className="border-b border-border/30">
                          <td className="py-3 text-sm text-muted-foreground">{row.id}</td>
                          <td className="py-3 text-sm text-foreground">{row.employee}</td>
                          <td className="py-3 text-sm text-foreground">{row.date}</td>
                          <td className="py-3">
                            <GreenPathBadge variant={getTripTransportVariant(row.transport)} size="sm">
                              {row.transport}
                            </GreenPathBadge>
                          </td>
                          <td className="py-3 text-sm text-foreground">{row.route}</td>
                          <td className="py-3 text-sm text-foreground">{row.distance}</td>
                          <td className="py-3 text-sm text-foreground">{row.emission}</td>
                          <td className="py-3">
                            {row.receipt ? (
                              <GreenPathBadge variant="success" size="sm">
                                영수증 있음
                              </GreenPathBadge>
                            ) : (
                              <GreenPathBadge variant="default" size="sm">
                                미제출
                              </GreenPathBadge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activityTab === "kakao" && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <img
                    src="/images/kakaotalk-photo-2026-01-15-11-01-04.png"
                    alt="카카오T"
                    className="h-4 w-4 rounded"
                  />
                  카카오T 자동 연동
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">ID</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">일시</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">유형</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">경로</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">차종</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">거리</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">배출량</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">지급 포인트</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kakaoTData.map((row) => (
                        <tr key={row.id} className="border-b border-border/30">
                          <td className="py-3 text-sm text-muted-foreground">{row.id}</td>
                          <td className="py-3 text-sm text-foreground">{row.date}</td>
                          <td className="py-3">
                            <GreenPathBadge variant={getTypeBadgeVariant(row.type)} size="sm">
                              {row.type}
                            </GreenPathBadge>
                          </td>
                          <td className="py-3 text-sm text-foreground">{row.route}</td>
                          <td className="py-3">
                            <GreenPathBadge variant={getVehicleBadgeVariant(row.vehicle)} size="sm">
                              {row.vehicle}
                            </GreenPathBadge>
                          </td>
                          <td className="py-3 text-sm text-foreground">{row.distance}</td>
                          <td className="py-3 text-sm text-foreground">{row.emission}</td>
                          <td className="py-3">
                            {row.points ? (
                              <GreenPathBadge variant="success" size="sm">
                                <Zap className="h-3 w-3 mr-1" />
                                {row.points}P
                              </GreenPathBadge>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </GreenPathCardContent>
        </GreenPathCard>
      </main>
    </div>
  )
}
