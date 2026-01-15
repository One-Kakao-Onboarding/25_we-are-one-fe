"use client"

import { useState, useEffect } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import {
  GreenPathCard,
  GreenPathCardContent,
  GreenPathCardHeader,
  GreenPathCardTitle,
  GreenPathCardDescription,
} from "@/components/ui/greenpath-card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TrendingDown, Sparkles, Home, Check, Zap, Fuel, Battery, Footprints, Train, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

// 목업 데이터
import { toast } from "sonner"
import { commuteService, type CommuteRecord, type CommuteStats } from "@/lib/services/commute.service"

// 목업 데이터 제거 (API 연동)

function CarIcon({ className, isActive }: { className?: string; isActive?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className, isActive ? "text-[#3BB60D]" : "text-muted-foreground")}
    >
      <path
        d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function AnimatedEcoIcon({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {isActive && (
        <>
          <span className="absolute top-0 right-1 w-2 h-2 text-yellow-400 animate-[sparkle_1s_ease-in-out_infinite]">
            ✦
          </span>
          <span className="absolute top-2 left-0 w-1.5 h-1.5 text-[#3BB60D] animate-[sparkle_1s_ease-in-out_infinite_0.3s]">
            ✦
          </span>
          <span className="absolute bottom-1 right-0 w-1 h-1 text-emerald-300 animate-[sparkle_1s_ease-in-out_infinite_0.6s]">
            ✦
          </span>
        </>
      )}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          "w-8 h-8 transition-all duration-300",
          isActive ? "text-[#3BB60D] animate-[leafSway_2s_ease-in-out_infinite]" : "text-muted-foreground",
        )}
      >
        <path
          d="M12 3C7 3 4 7 4 12c0 3 1.5 5.5 4 7 0-3 1-6 4-8 3 2 4 5 4 8 2.5-1.5 4-4 4-7 0-5-3-9-8-9z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? "rgba(59, 182, 13, 0.2)" : "none"}
        />
        <path d="M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M12 8c-2 1-3 3-3 5M12 8c2 1 3 3 3 5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3C7 3 4 7 4 12c0 3 1.5 5.5 4 7 0-3 1-6 4-8 3 2 4 5 4 8 2.5-1.5 4-4 4-7 0-5-3-9-8-9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const vehicleTypes = [
  { id: "hybrid", label: "하이브리드", icon: Battery, emission: 2.1, color: "text-[#FFE300]" },
  { id: "ice", label: "내연기관", icon: Fuel, emission: 3.1, color: "text-[#FF9A00]" },
]

const ecoTypes = [
  { id: "walk", label: "도보", icon: Footprints },
  { id: "public", label: "대중교통", icon: Train },
  { id: "ev", label: "전기차", icon: Zap },
]

export default function EmployeeCommutePage() {
  const [date, setDate] = useState<Date>(new Date())
  const [commuteMethod, setCommuteMethod] = useState<"car" | "eco" | null>(null)
  const [ecoType, setEcoType] = useState<"walk" | "public" | "ev" | null>(null)
  const [vehicleType, setVehicleType] = useState<"hybrid" | "ice" | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<CommuteRecord[]>([])
  const [stats, setStats] = useState<CommuteStats | null>(null)

  const distance = 15.2 // 기본 거리값 (주소 불러오기로 변경 가능)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        commuteService.getHistory(undefined, undefined, 10),
        commuteService.getStats('month')
      ])

      if (historyRes && historyRes.data) {
        setHistory(historyRes.data)
      }
      setStats(statsRes)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckIn = async () => {
    if (!canSubmit()) return

    try {
      setLoading(true)

      let record: CommuteRecord

      if (commuteMethod === "eco") {
        // Eco Logic
        if (ecoType === "ev") {
          record = {
            date: format(date, "yyyy-MM-dd"),
            usedCar: false, // Treated as Eco
            vehicleType: "EV",
            distance: distance, // EV travels distance
            emissions: 0
          }
        } else {
          // Walk / Public
          record = {
            date: format(date, "yyyy-MM-dd"),
            usedCar: false,
            vehicleType: null,
            distance: 0,
            emissions: 0
          }
        }
      } else {
        // Car Logic
        record = {
          date: format(date, "yyyy-MM-dd"),
          usedCar: true,
          vehicleType: vehicleType === "hybrid" ? "HYBRID" : "ICE",
          distance: distance,
          emissions: Number(calculateEmission())
        }
      }

      await commuteService.checkIn(record)
      toast.success("출근 기록이 등록되었습니다!")
      fetchData() // Refresh

      // Reset form
      setCommuteMethod(null)
      setEcoType(null)
      setVehicleType(null)
    } catch (error) {
      toast.error("등록 실패. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  const calculateEmission = () => {
    if (commuteMethod === "eco") return 0
    if (commuteMethod === "car" && vehicleType) {
      const vehicle = vehicleTypes.find((v) => v.id === vehicleType)
      return vehicle ? ((vehicle.emission * distance) / 10).toFixed(1) : 0
    }
    return 0
  }

  const canSubmit = () => {
    if (commuteMethod === "eco" && ecoType) return true
    if (commuteMethod === "car" && vehicleType) return true
    return false
  }

  return (
    <div className="min-h-screen bg-background">
      <style jsx global>{`
        @keyframes leafSway {
          0%, 100% { transform: rotate(-5deg) scale(1); }
          50% { transform: rotate(5deg) scale(1.05); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <GreenPathHeader role="employee" currentPath="/employee/commute" />

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Hero Section - 인사말 및 요약 통계 */}
        <div className="rounded-2xl bg-[#3BB60D]/10 border border-[#3BB60D]/20 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3BB60D]">안녕하세요, 김철수님!</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                오늘도 좋은 하루 되세요 <Sparkles className="h-4 w-4 text-[#FFE300]" />
              </p>
            </div>
            <div className="text-right text-muted-foreground">
              <p className="text-sm">오늘</p>
              <p className="text-xl font-semibold text-foreground">
                {format(new Date(), "M월 d일 (E)", { locale: ko })}
              </p>
            </div>
          </div>

          {/* 요약 카드 3개 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-card/60 backdrop-blur-sm p-4 border border-[#3BB60D]/10">
              <p className="text-xs text-muted-foreground mb-1">이번 달 자가용 출근</p>
              <p className="text-2xl font-bold text-[#FF9A00]">
                {stats?.carDays ?? 0}/{stats?.totalDays ?? 0}일
              </p>
              <p className="text-sm text-muted-foreground">{stats ? Math.round(stats.carPercentage) : 0}%</p>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-sm p-4 border border-[#3BB60D]/10">
              <p className="text-xs text-muted-foreground mb-1">이번 달 탄소 배출</p>
              <p className="text-2xl font-bold text-[#FF9A00]">{stats?.totalEmissions.toFixed(1) ?? "0.0"}</p>
              <p className="text-sm text-muted-foreground">kg/CO₂</p>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-sm p-4 border border-[#3BB60D]/10">
              <p className="text-xs text-muted-foreground mb-1">절감 기여도</p>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-5 w-5 text-[#3BB60D]" />
                <span className="text-2xl font-bold text-[#3BB60D]">12%</span>
              </div>
              <p className="text-sm text-muted-foreground">팀 평균 대비</p>
            </div>
          </div>
        </div>

        {/* 출근 정보 등록 섹션 */}
        <GreenPathCard>
          <GreenPathCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3BB60D]/10">
                <CarIcon className="h-5 w-5 text-[#3BB60D]" />
              </div>
              <div>
                <GreenPathCardTitle>오늘 출근 정보 등록</GreenPathCardTitle>
                <GreenPathCardDescription>어떻게 출근하셨나요?</GreenPathCardDescription>
              </div>
            </div>
          </GreenPathCardHeader>
          <GreenPathCardContent className="space-y-6">
            {/* 날짜 선택 */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">날짜</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-secondary/50 border-border/50 hover:bg-secondary"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(date, "yyyy. MM. dd.", { locale: ko })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} locale={ko} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">출근 방법</label>
              <div className="grid grid-cols-2 gap-4">
                {/* 친환경 선택 */}
                <button
                  onClick={() => {
                    setCommuteMethod("eco")
                    setVehicleType(null)
                  }}
                  className={cn(
                    "relative flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-300",
                    commuteMethod === "eco"
                      ? "border-[#3BB60D] bg-[#3BB60D]/10"
                      : "border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-[#3BB60D]/50",
                  )}
                >
                  {/* 체크 아이콘 */}
                  {commuteMethod === "eco" && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-[#3BB60D] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#3BB60D]" />
                    </div>
                  )}

                  <AnimatedEcoIcon isActive={commuteMethod === "eco"} />
                  <div>
                    <p className="font-semibold text-foreground">친환경</p>
                  </div>

                  {commuteMethod === "eco" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ecoTypes.map((eco) => (
                        <button
                          key={eco.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setEcoType(eco.id as "walk" | "public" | "ev")
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                            ecoType === eco.id
                              ? "bg-[#3BB60D] text-white"
                              : "bg-[#3BB60D]/20 text-[#3BB60D] hover:bg-[#3BB60D]/30",
                          )}
                        >
                          {eco.icon && <eco.icon className="w-3.5 h-3.5" />}
                          {eco.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 포인트 적립 배지 */}
                  {commuteMethod === "eco" && (
                    <div className="w-full mt-2 px-3 py-2 rounded-lg bg-[#b8860b]/20 flex items-center gap-2">
                      <span className="text-lg">🪙</span>
                      <span className="text-sm text-[#d4a84b] font-medium">300포인트 적립</span>
                    </div>
                  )}
                </button>

                {/* 자가용 선택 */}
                <button
                  onClick={() => {
                    setCommuteMethod("car")
                    setEcoType(null)
                  }}
                  className={cn(
                    "relative flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-300",
                    commuteMethod === "car"
                      ? "border-[#FF9A00] bg-[#FF9A00]/10"
                      : "border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-[#FF9A00]/50",
                  )}
                >
                  {/* 체크 아이콘 */}
                  {commuteMethod === "car" && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-[#FF9A00] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#FF9A00]" />
                    </div>
                  )}

                  <div className="w-12 h-12 flex items-center justify-center">
                    <CarIcon className="w-8 h-8" isActive={commuteMethod === "car"} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">자가용</p>
                    <p className="text-sm text-muted-foreground">탄소 배출량이 계산됩니다</p>
                  </div>
                </button>
              </div>
            </div>

            {commuteMethod === "car" && (
              <GreenPathCard className="border-border/50">
                <GreenPathCardContent className="space-y-4 pt-6">
                  {/* 차량 종류 선택 */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">차량 종류</label>
                    <div className="grid grid-cols-2 gap-3">
                      {vehicleTypes.map((vehicle) => {
                        const Icon = vehicle.icon
                        return (
                          <button
                            key={vehicle.id}
                            onClick={() => setVehicleType(vehicle.id as "hybrid" | "ice")}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                              vehicleType === vehicle.id
                                ? vehicle.id === "ice"
                                  ? "border-[#FF9A00] bg-[#FF9A00]/10"
                                  : "border-[#FFE300] bg-[#FFE300]/10"
                                : "border-border/50 bg-secondary/30 hover:bg-secondary/50",
                            )}
                          >
                            <div className="flex items-center gap-1.5">
                              <Icon className={cn("w-4 h-4", vehicle.color)} />
                              <span className="font-medium text-foreground">{vehicle.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">~{vehicle.emission} kg/CO₂</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 집 - 회사 거리 */}
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4">
                    <Home className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">집 ↔ 회사 거리</p>
                      <p className="text-xl font-bold text-foreground">
                        {distance} km <span className="text-sm font-normal text-muted-foreground">(편도)</span>
                      </p>
                    </div>
                  </div>
                </GreenPathCardContent>
              </GreenPathCard>
            )}

            {commuteMethod && (
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={cn("text-sm font-medium", commuteMethod === "eco" ? "text-[#3BB60D]" : "text-[#FF9A00]")}
                    >
                      {commuteMethod === "eco"
                        ? `친환경 (${ecoType === "walk" ? "도보" : ecoType === "public" ? "대중교통" : "전기차"})`
                        : `자가용 (${vehicleTypes.find((v) => v.id === vehicleType)?.label})`}
                    </p>
                    <p
                      className={cn("text-3xl font-bold", commuteMethod === "eco" ? "text-[#3BB60D]" : "text-[#FF9A00]")}
                    >
                      {calculateEmission()} kg/CO<sub>2</sub>
                    </p>
                    {commuteMethod === "eco" && (
                      <p className="text-sm text-[#3BB60D] flex items-center gap-1 mt-1">
                        <span>🪙</span> 300 카카오페이 포인트 적립 예정
                      </p>
                    )}
                  </div>
                  <Button
                    className={cn("font-semibold px-6 py-5", "bg-[#3BB60D] hover:bg-[#3BB60D]/90 text-white")}
                    disabled={!canSubmit() || loading}
                    onClick={handleCheckIn}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 mr-2" />}
                    {commuteMethod === "eco" ? "등록하고 포인트 받기" : "등록하기"}
                  </Button>
                </div>
              </div>
            )}
          </GreenPathCardContent>
        </GreenPathCard>

        {/* 최근 출근 기록 */}
        <GreenPathCard>
          <GreenPathCardHeader>
            <GreenPathCardTitle>최근 출근 기록</GreenPathCardTitle>
          </GreenPathCardHeader>
          <GreenPathCardContent>
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  아직 출근 기록이 없습니다.
                </div>
              ) : history.map((record, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        !record.usedCar ? "bg-[#3BB60D]/10" : "bg-[#FF9A00]/10",
                      )}
                    >
                      {!record.usedCar ? (
                        <LeafIcon className="h-5 w-5 text-[#3BB60D]" />
                      ) : (
                        <CarIcon className="h-5 w-5 text-[#FF9A00]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{record.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {!record.usedCar ? "친환경 출근" : `자가용 (${record.vehicleType})`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-semibold", !record.usedCar ? "text-[#3BB60D]" : "text-[#FF9A00]")}>
                      {Number(record.emissions).toFixed(1)} kg/CO₂
                    </p>
                    {record.usedCar && <p className="text-sm text-muted-foreground">{Number(record.distance).toFixed(1)} km</p>}
                  </div>
                </div>
              ))}
            </div>
          </GreenPathCardContent>
        </GreenPathCard>
      </main>
    </div>
  )
}
