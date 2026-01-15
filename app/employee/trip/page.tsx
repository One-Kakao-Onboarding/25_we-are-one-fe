"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { cn } from "@/lib/utils"
import { Train, Plane, Bus, Calendar as CalendarIcon, MapPin, Upload, Sparkles, Check, Loader2, Info } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { tripService, type TripRecord, type TripStats } from "@/lib/services/trip.service"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

type TransportType = "TRAIN" | "FLIGHT" | "BUS"

const transportOptions = [
  {
    id: "TRAIN" as TransportType,
    label: "기차",
    icon: Train,
    emission: 0.03, // kg/CO2/km
    desc: "~0.03 kg/km"
  },
  {
    id: "FLIGHT" as TransportType,
    label: "항공",
    icon: Plane,
    emission: 0.21,
    desc: "~0.21 kg/km"
  },
  {
    id: "BUS" as TransportType,
    label: "버스",
    icon: Bus,
    emission: 0.06,
    desc: "~0.06 kg/km"
  },
]

export default function TripPage() {
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [history, setHistory] = useState<TripRecord[]>([])
  const [stats, setStats] = useState<TripStats | null>(null)

  // Form State
  const [selectedTransport, setSelectedTransport] = useState<TransportType>("TRAIN")
  const [date, setDate] = useState<Date>(new Date())
  const [departure, setDeparture] = useState("")
  const [arrival, setArrival] = useState("")
  const [distance, setDistance] = useState("0")
  const [isDragging, setIsDragging] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  // Analysis State
  const [aiConfidence, setAiConfidence] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        tripService.getHistory(5),
        tripService.getStats('month')
      ])
      setHistory(historyRes || [])
      setStats(statsRes || null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRegister = async () => {
    if (!departure || !arrival) {
      toast.error("출발지와 도착지를 입력해주세요.")
      return
    }

    try {
      setLoading(true)

      const distVal = parseFloat(distance) || 0
      const selectedOption = transportOptions.find(o => o.id === selectedTransport)
      const emission = distVal * (selectedOption?.emission || 0)

      // If we have a receipt, we use the confirm flow (mock), effectively same as register but with correct type
      // For this demo, we can just use the register endopint OR confirm. 
      // The user wanted "receipt confirmation" logic.
      // Let's use confirmReceipt if receipt exists

      if (receiptFile) {
        const confirmPayload = {
          receiptType: "BUSINESS_TRIP",
          tripType: selectedTransport,
          date: format(date, "yyyy-MM-dd"),
          departure,
          arrival,
          distance: distVal,
          emissions: parseFloat(emission.toFixed(1)),
          tempFilePath: "mock_path_from_analysis" // In real app, this comes from analysis step
        }
        await tripService.confirmReceipt(confirmPayload)
      } else {
        const payload: TripRecord = {
          type: selectedTransport,
          date: format(date, "yyyy-MM-dd"),
          departure,
          arrival,
          distance: distVal,
          emission: parseFloat(emission.toFixed(1)),
          hasReceipt: false
        }
        await tripService.register(payload)
      }

      toast.success("출장 기록이 등록되었습니다!")

      // Reset
      setDeparture("")
      setArrival("")
      setDistance("0")
      setReceiptFile(null)
      setAiConfidence(null)
      fetchData()
    } catch (e) {
      console.error(e)
      toast.error("등록 실패")
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setReceiptFile(file)
    setAnalyzing(true)

    try {
      const res = await tripService.analyzeReceipt(file)
      if (res.status === 'success' && res.data && res.data.extractedData) {
        const data = res.data.extractedData

        // Auto-fill form
        if (data.transportationType) setSelectedTransport(data.transportationType)
        if (data.date) setDate(new Date(data.date))
        if (data.departure) setDeparture(data.departure)
        if (data.arrival) setArrival(data.arrival)
        if (data.distance) setDistance(String(data.distance))

        setAiConfidence(res.data.confidence)
        toast.success("AI가 영수증 정보를 분석하여 입력했습니다.")
      }
    } catch (e) {
      console.error("Analysis failed", e)
      toast.error("영수증 분석에 실패했습니다. 직접 입력해주세요.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <GreenPathHeader role="employee" currentPath="/employee/trip" />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl bg-[#FFB200]/10 border border-[#FFB200]/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-[#FFB200]">출장 정보 등록</h1>
              <p className="text-muted-foreground">기차, 항공, 버스 출장 후 영수증을 업로드하세요 <Sparkles className="inline h-4 w-4 text-[#FFB200]" /></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">이번 달</p>
              <p className="text-3xl font-bold text-foreground">{stats?.tripCount ?? 0}건</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-card/60 backdrop-blur-sm p-4 border border-[#FFB200]/10">
              <p className="text-xs text-muted-foreground mb-1">총 이동 거리</p>
              <p className="text-2xl font-bold text-[#FFB200]">{Math.round(stats?.totalDistance ?? 0).toLocaleString()} km</p>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-sm p-4 border border-[#FFB200]/10">
              <p className="text-xs text-muted-foreground mb-1">총 탄소 배출</p>
              <p className="text-2xl font-bold text-[#FFB200]">{stats?.totalEmissions.toFixed(1) ?? 0} kg</p>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-sm p-4 border border-[#FFB200]/10">
              <p className="text-xs text-muted-foreground mb-1">처리 상태</p>
              <p className="text-2xl font-bold text-[#FFB200]">100%</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <GreenPathCard className="mb-8">
          <GreenPathCardContent>
            <h2 className="mb-6 text-lg font-semibold text-foreground flex items-center justify-between">
              <span>새 출장 등록</span>
              {aiConfidence && (
                <span className="text-xs font-normal px-2 py-1 rounded bg-[#FFB200]/20 text-[#FFB200] border border-[#FFB200]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI 자동 입력됨 (신뢰도: {Math.round(aiConfidence * 100)}%)
                </span>
              )}
            </h2>

            {/* Receipt Upload Area - Moved to Top based on UX flow (Upload first -> Autofill) */}
            <div className="mb-8">
              <label className="mb-3 block text-sm text-muted-foreground">영수증 업로드 (AI 자동 분석)</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition-all cursor-pointer relative overflow-hidden",
                  isDragging ? "border-[#FFB200] bg-[#FFB200]/10" : "border-border/50 hover:border-[#FFB200]/50 hover:bg-secondary/30",
                  receiptFile ? "border-[#FFB200] bg-[#FFB200]/5" : ""
                )}
              >
                {analyzing ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <Sparkles className="mb-3 h-10 w-10 text-[#FFB200] animate-spin" />
                    <p className="text-[#FFB200] font-medium">Gemini AI가 영수증을 분석중입니다...</p>
                  </div>
                ) : receiptFile ? (
                  <>
                    <Check className="mb-3 h-10 w-10 text-[#FFB200]" />
                    <p className="text-foreground font-medium">{receiptFile.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">업로드 및 분석 완료</p>
                  </>
                ) : (
                  <>
                    <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-foreground">영수증 이미지를 드래그하여 업로드하세요</p>
                    <p className="mt-1 text-sm text-muted-foreground">PDF, JPG, PNG (최대 10MB)</p>
                  </>
                )}
                {/* Hidden input for clicking */}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  accept="image/*,.pdf"
                />
              </div>
            </div>

            {/* Transport Type Selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm text-muted-foreground">교통수단</label>
              <div className="grid grid-cols-3 gap-4">
                {transportOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedTransport === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTransport(option.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-6 transition-all relative",
                        isSelected
                          ? "border-[#FFB200] bg-[#FFB200]/10"
                          : "border-border/50 bg-secondary/30 hover:border-[#FFB200]/50 hover:bg-secondary/50",
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full border border-[#FFB200] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#FFB200]" />
                        </div>
                      )}
                      <Icon className={cn("h-8 w-8", isSelected ? "text-[#FFB200]" : "text-muted-foreground")} />
                      <span className={cn("font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{option.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm text-muted-foreground">출장 날짜</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-secondary/30 border-border/50 hover:bg-secondary/50 h-12"
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

            {/* Location Inputs */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-3 block text-sm text-muted-foreground">출발지</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="예: 서울역"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-secondary/30 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-[#FFB200] focus:outline-none focus:ring-1 focus:ring-[#FFB200]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-3 block text-sm text-muted-foreground">도착지</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FFB200]" />
                  <input
                    type="text"
                    placeholder="예: 부산역"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-secondary/30 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-[#FFB200] focus:outline-none focus:ring-1 focus:ring-[#FFB200]"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading || analyzing}
              className="w-full bg-[#FFB200] hover:bg-[#FFB200]/90 text-black font-bold h-12 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "출장 등록하기"}
            </Button>
          </GreenPathCardContent>
        </GreenPathCard>

        {/* Recent Trips */}
        <GreenPathCard>
          <GreenPathCardContent>
            <h2 className="mb-6 text-lg font-semibold text-foreground">최근 출장 기록</h2>

            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">최근 출장 기록이 없습니다.</div>
              ) : history.map((trip, idx) => {
                const option = transportOptions.find(o => o.id === trip.type)
                const Icon = option?.icon || Train
                return (
                  <div key={trip.id || idx} className="flex items-center justify-between rounded-xl bg-secondary/30 p-4 border border-border/30">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          trip.type === "FLIGHT" ? "bg-[#8ADB42]/20" : "bg-[#FFB200]/20",
                        )}
                      >
                        <Icon
                          className={cn("h-6 w-6", trip.type === "FLIGHT" ? "text-[#8ADB42]" : "text-[#FFB200]")}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{trip.departure} → {trip.arrival}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{trip.date}</span>
                          <span>·</span>
                          <span>{Math.round(trip.distance)} km</span>
                          {trip.hasReceipt && (
                            <>
                              <span>·</span>
                              <span className="text-[#3BB60D]">영수증 인증됨</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{trip.emission.toFixed(1)} kg</p>
                      <p className="text-sm text-muted-foreground">/CO₂</p>
                    </div>
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

