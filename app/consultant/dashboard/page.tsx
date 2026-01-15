"use client"

import { useState, useEffect } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { GreenPathBadge } from "@/components/ui/greenpath-badge"
import { Button } from "@/components/ui/button"
import { Car, Plane, Truck, Download, Zap, Target, Loader2, TrendingDown, Users, RefreshCw, FileText, ArrowRight, TrendingUp } from "lucide-react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area, CartesianGrid } from "recharts"
import { dashboardService, type DashboardOverview, type MonthlyTrendItem, type DepartmentStat, type KakaoTRecord, type ReportItem } from "@/lib/services/dashboard.service"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Helper to calculate comparison stats
function calculateComparison(baseYear: string, targetYear: string, trendData: any[]) {
  const baseData = trendData.find(d => d.year === baseYear);
  const targetData = trendData.find(d => d.year === targetYear);

  if (!baseData || !targetData) return null;

  const baseTotal = baseData.commute + baseData.businessType + baseData.logistics;
  const targetTotal = targetData.commute + targetData.businessType + targetData.logistics;

  const saved = baseTotal - targetTotal;
  const reductionRate = ((saved / baseTotal) * 100).toFixed(1);

  return {
    baseYear: `${baseYear}년`,
    targetYear: `${targetYear}년`,
    reductionRate: Number(reductionRate),
    baseEmission: baseTotal,
    targetEmission: targetTotal,
    savedEmission: saved
  };
}

const initialOverview: DashboardOverview = {
  summary: { totalEmissions: 0, previousMonthEmissions: 0, trend: 0, evRatio: 0, participantCount: 0, totalEmployees: 0 },
  vehicleEmissions: { EV: 0, Hybrid: 0, ICE: 0, total: 0 },
  flightEmissions: { domestic: 0, international: 0, total: 0 },
  logisticsEmissions: { taxi: 0, quick: 0, bike: 0, total: 0 },
}

export default function ConsultantDashboardPage() {
  const [data, setData] = useState<DashboardOverview>(initialOverview)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Year Selection State
  const [baseYear, setBaseYear] = useState("2019")
  const [targetYear, setTargetYear] = useState("2026")
  const [comparisonStats, setComparisonStats] = useState<any>(null)

  // Activity Tab State
  const [activityTab, setActivityTab] = useState<'commute' | 'business' | 'kakaoT'>('commute')

  useEffect(() => {
    if (data.yearlyTrend) {
      const stats = calculateComparison(baseYear, targetYear, data.yearlyTrend);
      setComparisonStats(stats);
    }
  }, [data.yearlyTrend, baseYear, targetYear])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const overviewRes = await dashboardService.getOverview("month")
      setData(overviewRes)
    } catch (error) {
      console.error(error)
      toast.error("데이터를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      await dashboardService.syncKakaoT()
      toast.success("동기화 완료")
      fetchData() // Refresh
    } catch (error) {
      toast.error("동기화 실패")
    } finally {
      setSyncing(false)
    }
  }

  if (loading && data.summary.totalEmissions === 0) {
    return (
      <div className="min-h-screen bg-[#1a1625] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  // --- Row 1 Data ---
  const yearlyTrendData = data.yearlyTrend || []

  // --- Row 4 Data (Donuts) ---
  const vehicleChartData = [
    { name: "전기차", value: data.vehicleEmissions.EV, color: "#FFB200" },      // EV
    { name: "하이브리드", value: data.vehicleEmissions.Hybrid, color: "#FFE300" }, // Hybrid
    { name: "내연기관", value: data.vehicleEmissions.ICE, color: "#FF9A00" },    // ICE
  ]
  const flightChartData = [
    { name: "국내선", value: data.flightEmissions.domestic, color: "#3BB60D" },  // Domestic
    { name: "국제선", value: data.flightEmissions.international, color: "#8ADB42" }, // International
  ]
  // User asked for "Taxi/Logistics" -> Domestic/International colors? Assuming typo and mapping to Taxi/Logistics
  const logisticsChartData = [
    { name: "택시", value: data.logisticsEmissions.taxi, color: "#DB4742" },     // Taxi
    { name: "물류/퀵", value: data.logisticsEmissions.quick, color: "#EB8682" },  // Quick (mapped to 'International' request color)
    { name: "바이크", value: data.logisticsEmissions.bike, color: "#EB8682" },    // Bike
  ]

  return (
    <div className="min-h-screen bg-[#1a1625] text-white">
      <GreenPathHeader role="consultant" currentPath="/consultant/dashboard" />

      <main className="mx-auto max-w-[1600px] px-6 py-8 space-y-6">

        {/* Restored Hero Section */}
        <div className="rounded-3xl bg-[#292140] p-8 text-white shadow-xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">ESG 통합 대시보드</h1>
              <p className="text-white/70">전사 탄소 배출 데이터를 실시간으로 모니터링하세요</p>
            </div>
            <Button
              className="bg-white text-[#292140] hover:bg-white/90 font-bold rounded-lg px-6 py-2 h-auto"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <img src="/kakao-t-logo-v2.png" alt="Kakao T" className="mr-2 h-5 w-5 rounded-sm" />
              )}
              {syncing ? "동기화 중..." : "실시간 연동"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 1. Total Emissions */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-sm text-white/60 mb-2">이번 달 총 배출량</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{data.summary.totalEmissions.toLocaleString()}</span>
                <span className="text-sm text-white/60">kg/CO₂</span>
              </div>
            </div>

            {/* 2. Trend */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-sm text-white/60 mb-2">전월 대비</p>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-white/90" />
                <span className="text-4xl font-bold">{Math.abs(data.summary.trend)}%</span>
              </div>
              <p className="text-sm text-white/60 mt-1">개선</p>
            </div>

            {/* 3. EV Ratio */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-sm text-white/60 mb-2">EV 이용률</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{data.summary.evRatio}%</span>
              </div>
              <p className="text-sm text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> 5.2%p 증가
              </p>
            </div>

            {/* 4. Participants */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-sm text-white/60 mb-2">참여 직원 수</p>
              <div className="text-4xl font-bold mb-1">{data.summary.participantCount.toLocaleString()}</div>
              <p className="text-sm text-white/60">/ {data.summary.totalEmployees.toLocaleString()}명</p>
            </div>
          </div>
        </div>

        {/* Row 2: Donut Charts (Moved from Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Vehicle */}
          <div className="bg-[#201c2d] rounded-2xl p-6 border border-white/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-10 w-10 bg-[#2a243a] rounded-full flex items-center justify-center">
                <Car className="text-white/60 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">차량</h4>
                <p className="text-xs text-white/40">개인 출퇴근</p>
              </div>
            </div>

            <div className="h-[200px] w-full flex justify-center items-center relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={vehicleChartData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {vehicleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border-4 border-white/5" />
              </div>
            </div>

            <div className="mt-6 space-y-3 px-2">
              {vehicleChartData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value.toLocaleString()} kg/CO₂</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Flight */}
          <div className="bg-[#201c2d] rounded-2xl p-6 border border-white/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-10 w-10 bg-[#2a243a] rounded-full flex items-center justify-center">
                <Plane className="text-white/60 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">비행기</h4>
                <p className="text-xs text-white/40">출장</p>
              </div>
            </div>

            <div className="h-[200px] w-full flex justify-center items-center relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={flightChartData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {flightChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3 px-2">
              {flightChartData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value.toLocaleString()} kg/CO₂</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Logistics */}
          <div className="bg-[#201c2d] rounded-2xl p-6 border border-white/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-10 w-10 bg-[#2a243a] rounded-full flex items-center justify-center">
                <Truck className="text-white/60 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">택시/물류</h4>
                <p className="text-xs text-white/40">카카오T 연동</p>
                <span className="inline-block mt-1 text-[10px] bg-[#6366f1]/20 text-[#6366f1] px-1.5 py-0.5 rounded border border-[#6366f1]/30">
                  <Zap className="w-2 h-2 inline mr-0.5" />자동
                </span>
              </div>
            </div>

            <div className="h-[200px] w-full flex justify-center items-center relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={logisticsChartData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {logisticsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3 px-2">
              {logisticsChartData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value.toLocaleString()} kg/CO₂</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Yearly Trend & Comparison */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Category Yearly Trend */}
          <div className="col-span-12 lg:col-span-8 bg-[#201c2d] rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">카테고리별 연도별 추이</h3>
                <span className="text-xs text-white/40 border border-white/20 rounded-full px-2 py-0.5">● 목표 대비 현황</span>
              </div>
              <Button variant="ghost" className="text-sm text-indigo-400 hover:text-indigo-300 h-auto p-0 hover:bg-transparent">
                <Download className="w-4 h-4 mr-1" /> 데이터 다운로드
              </Button>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={yearlyTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#322a4d" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1625', borderColor: '#453c5c', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="commute" stackId="1" stroke="none" fill="#FF9A00" name="출퇴근" />
                  <Area type="monotone" dataKey="businessType" stackId="1" stroke="none" fill="#FFB200" name="출장" />
                  <Area type="monotone" dataKey="logistics" stackId="1" stroke="none" fill="#FFC800" name="택시/물류" />
                  <Area type="linear" dataKey="target" stroke="#CFD1D8" strokeWidth={2} strokeDasharray="5 5" fill="none" name="탄소절감 목표" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs font-medium">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF9A00]" />출퇴근</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FFB200]" />출장</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FFC800]" />택시/물류</div>
              <div className="flex items-center gap-2"><div className="w-2 h-0.5 bg-[#CFD1D8]" />탄소절감 목표</div>
            </div>
          </div>

          {/* Right: Yearly Comparison */}
          <div className="col-span-12 lg:col-span-4 bg-[#201c2d] rounded-2xl p-6 border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">연도별 배출량 비교</h3>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs text-white/40 mb-1 block">기준 연도</label>
                <div className="relative">
                  <select
                    value={baseYear}
                    onChange={(e) => setBaseYear(e.target.value)}
                    className="w-full bg-[#2a243a] rounded-lg p-3 text-sm text-white border border-white/10 appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {yearlyTrendData.map((d) => (
                      <option key={d.year} value={d.year}>{d.year}년</option>
                    ))}
                  </select>
                  <TrendingDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">비교 연도</label>
                <div className="relative">
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full bg-[#2a243a] rounded-lg p-3 text-sm text-white border border-white/10 appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {yearlyTrendData.map((d) => (
                      <option key={d.year} value={d.year}>{d.year}년</option>
                    ))}
                  </select>
                  <TrendingDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                </div>
              </div>
            </div>

            {comparisonStats ? (
              <>
                <div className="flex-1 flex flex-col items-center justify-center mb-8">
                  <span className="text-sm text-white/60 mb-2">{baseYear}년 대비 {targetYear}년</span>
                  <div className={cn("text-5xl font-bold flex items-center mb-1",
                    comparisonStats.reductionRate > 0 ? "text-[#22c55e]" : "text-[#ef4444]"
                  )}>
                    {comparisonStats.reductionRate > 0 ? <TrendingDown className="w-10 h-10 mr-2" /> : <TrendingUp className="w-10 h-10 mr-2" />}
                    {Math.abs(comparisonStats.reductionRate)}%
                  </div>
                  <span className={cn("font-medium", comparisonStats.reductionRate > 0 ? "text-[#22c55e]" : "text-[#ef4444]")}>
                    {comparisonStats.reductionRate > 0 ? "절감" : "증가"}
                  </span>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">{baseYear}년 총 배출량</span>
                    <span className="font-bold">{comparisonStats.baseEmission.toLocaleString()} kg/CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">{targetYear}년 총 배출량</span>
                    <span className="font-bold">{comparisonStats.targetEmission.toLocaleString()} kg/CO₂</span>
                  </div>
                  <div className={cn("flex justify-between", comparisonStats.reductionRate > 0 ? "text-[#22c55e]" : "text-[#ef4444]")}>
                    <span>{comparisonStats.reductionRate > 0 ? "절감량" : "증가량"}</span>
                    <span className="font-bold">{comparisonStats.reductionRate > 0 ? '-' : '+'}{Math.abs(comparisonStats.savedEmission).toLocaleString()} kg/CO₂</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/40">
                데이터 없음
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Monthly Cumulative */}
        <div className="bg-[#201c2d] rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">2026년 월별 누적 배출량 vs 목표</h3>
              <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full px-2 py-0.5">현재 목표 대비 87.2%</span>
            </div>
            <Button variant="ghost" className="text-sm text-indigo-400 hover:text-indigo-300 h-auto p-0 hover:bg-transparent">
              <Download className="w-4 h-4 mr-1" /> 데이터 다운로드
            </Button>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.monthlyCumulative || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#322a4d" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1625', borderColor: '#453c5c', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="commute" stackId="1" stroke="none" fill="#3b82f6" name="출퇴근" />
                <Area type="monotone" dataKey="businessType" stackId="1" stroke="none" fill="#f59e0b" name="출장" />
                <Area type="monotone" dataKey="logistics" stackId="1" stroke="none" fill="#ef4444" name="택시/물류" />
                <Area type="linear" dataKey="cumulativeTarget" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" fill="none" name="누적 목표" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 text-center">
            <div>
              <p className="text-xs text-white/50 mb-1">현재 누적 배출량</p>
              <p className="text-2xl font-bold text-white">1,570</p>
              <p className="text-[10px] text-white/40">kg/CO₂</p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">현재 누적 목표</p>
              <p className="text-2xl font-bold text-white">1,800</p>
              <p className="text-[10px] text-white/40">kg/CO₂</p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">목표 대비 배출율</p>
              <p className="text-2xl font-bold text-[#22c55e]">87.2%</p>
              <p className="text-[10px] text-white/40">목표 이내</p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">목표 여유량</p>
              <p className="text-2xl font-bold text-[#22c55e]">230</p>
              <p className="text-[10px] text-white/40">kg/CO₂</p>
            </div>
          </div>
        </div>

        {/* Row 5: Employee Activity Data */}
        <div className="bg-[#201c2d] rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">임직원 활동 데이터</h3>
                  <p className="text-xs text-white/40">출퇴근, 출장, 카카오T 연동 데이터 통합 조회</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className={cn("text-sm font-medium transition-colors",
                    activityTab === 'commute' ? "bg-[#5c46ff] text-white px-4 py-1.5 rounded-full" : "text-white/60 hover:text-white px-2 py-1.5")}
                  onClick={() => setActivityTab('commute')}
                >
                  출퇴근
                </button>
                <button
                  className={cn("text-sm font-medium transition-colors",
                    activityTab === 'business' ? "bg-[#5c46ff] text-white px-4 py-1.5 rounded-full" : "text-white/60 hover:text-white px-2 py-1.5")}
                  onClick={() => setActivityTab('business')}
                >
                  출장
                </button>
                <button
                  className={cn("text-sm font-medium transition-colors flex items-center gap-2",
                    activityTab === 'kakaoT' ? "bg-[#5c46ff] text-white px-4 py-1.5 rounded-full" : "text-white/60 hover:text-white px-2 py-1.5")}
                  onClick={() => setActivityTab('kakaoT')}
                >
                  <img src="/kakao-t-icon.png" className={cn("w-3 h-3 transition-opacity", activityTab === 'kakaoT' ? "opacity-100 invert brightness-0" : "grayscale opacity-60")} style={activityTab === 'kakaoT' ? { filter: 'brightness(0) invert(1)' } : {}} /> 카카오T
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">이번 달 총 지출 포인트</p>
              <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg mt-1">
                <span className="text-2xl font-bold text-[#22c55e]">1,500P</span>
              </div>
              <p className="text-xs text-white/50 mt-1">이번 달 포인트 지급 건수 <b className="text-white">5건</b></p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/40 uppercase bg-[#2a243a]">
                <tr>
                  <th className="px-6 py-3 rounded-l-lg">ID</th>
                  <th className="px-6 py-3">직원</th>
                  <th className="px-6 py-3">날짜</th>
                  <th className="px-6 py-3">출근 방법</th>
                  <th className="px-6 py-3">세부 유형</th>
                  <th className="px-6 py-3">거리</th>
                  <th className="px-6 py-3">배출량</th>
                  <th className="px-6 py-3 rounded-r-lg">지급 포인트</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentActivities?.filter(item => {
                  if (activityTab === 'commute') return item.category === 'commute';
                  if (activityTab === 'business') return item.category === 'business';
                  if (activityTab === 'kakaoT') return item.category === 'kakaoT';
                  return true;
                }).map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white/60">{item.id}</td>
                    <td className="px-6 py-4 font-bold">{item.employee}</td>
                    <td className="px-6 py-4 text-white/60">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs border",
                        item.method === '친환경' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/10 border-white/10 text-white/60")}>
                        {item.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs border",
                        item.type === '대중교통' || item.type === '전기차' ? "bg-green-900/30 border-green-700/50 text-green-400" :
                          item.type === '하이브리드' ? "bg-blue-900/30 border-blue-700/50 text-blue-400" :
                            item.type === '도보' ? "bg-green-900/30 border-green-700/50 text-green-400" :
                              "bg-neutral-800 border-neutral-700 text-neutral-400"
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/80">{item.distance}</td>
                    <td className="px-6 py-4 font-bold">{item.emission} kg/CO₂</td>
                    <td className="px-6 py-4">
                      {item.points > 0 ? (
                        <div className="flex items-center text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full w-fit">
                          <Zap className="w-3 h-3 mr-1 fill-green-400" />
                          {item.points}P
                        </div>
                      ) : (
                        <span className="text-white/20">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
