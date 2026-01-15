"use client"

import type React from "react"

import { useState } from "react"
import { GreenPathHeader } from "@/components/ui/greenpath-header"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { cn } from "@/lib/utils"
import { Train, Plane, Bus, Calendar, MapPin, Upload } from "lucide-react"

type TransportType = "train" | "flight" | "bus"

interface TripRecord {
  id: string
  route: string
  date: string
  distance: string
  emission: number
  hasReceipt: boolean
  type: TransportType
}

const transportOptions = [
  {
    id: "train" as TransportType,
    label: "기차",
    icon: Train,
    emission: "0.03 kg/CO₂/km",
  },
  {
    id: "flight" as TransportType,
    label: "항공",
    icon: Plane,
    emission: "0.211 kg/CO₂/km",
  },
  {
    id: "bus" as TransportType,
    label: "버스",
    icon: Bus,
    emission: "0.06 kg/CO₂/km",
  },
]

const recentTrips: TripRecord[] = [
  {
    id: "1",
    route: "김포공항 → 제주공항",
    date: "2026-01-12",
    distance: "452 km",
    emission: 95.4,
    hasReceipt: true,
    type: "flight",
  },
  {
    id: "2",
    route: "서울역 → 부산역",
    date: "2026-01-10",
    distance: "417 km",
    emission: 12.5,
    hasReceipt: true,
    type: "train",
  },
]

export default function TripPage() {
  const [selectedTransport, setSelectedTransport] = useState<TransportType>("train")
  const [isDragging, setIsDragging] = useState(false)

  const stats = [
    { label: "총 이동 거리", value: "1,009 km" },
    { label: "총 탄소 배출", value: "116.3 kg" },
    { label: "처리 완료", value: "100%" },
  ]

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
  }

  const getTransportIcon = (type: TransportType) => {
    const icons = {
      train: Train,
      flight: Plane,
      bus: Bus,
    }
    return icons[type]
  }

  return (
    <div className="min-h-screen bg-background">
      <GreenPathHeader role="employee" currentPath="/employee/trip" />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl bg-indigo-600 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-white">출장 정보 등록</h1>
              <p className="text-white/80">기차, 항공, 버스 출장 후 영수증을 업로드하세요</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">이번 달</p>
              <p className="text-3xl font-bold text-white">3건</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-white/70">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <GreenPathCard className="mb-8">
          <GreenPathCardContent>
            <h2 className="mb-6 text-lg font-semibold text-foreground">새 출장 등록</h2>

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
                        "flex flex-col items-center gap-2 rounded-xl border p-6 transition-all",
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/50",
                      )}
                    >
                      <Icon className={cn("h-8 w-8", isSelected ? "text-indigo-400" : "text-muted-foreground")} />
                      <span className={cn("font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{option.emission}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm text-muted-foreground">출장 날짜</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  defaultValue="2026. 01. 15."
                  className="w-full rounded-xl border border-border/50 bg-secondary/30 py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Calendar className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
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
                    className="w-full rounded-xl border border-border/50 bg-secondary/30 py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-3 block text-sm text-muted-foreground">도착지</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    placeholder="예: 부산역"
                    className="w-full rounded-xl border border-border/50 bg-secondary/30 py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="mb-3 block text-sm text-muted-foreground">영수증 (선택)</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-all",
                  isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-border/50 hover:border-border",
                )}
              >
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-foreground">영수증 이미지를 업로드하세요</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF, JPG, PNG (최대 10MB)</p>
              </div>
            </div>
          </GreenPathCardContent>
        </GreenPathCard>

        {/* Recent Trips */}
        <GreenPathCard>
          <GreenPathCardContent>
            <h2 className="mb-6 text-lg font-semibold text-foreground">최근 출장 기록</h2>

            <div className="space-y-4">
              {recentTrips.map((trip) => {
                const Icon = getTransportIcon(trip.type)
                return (
                  <div key={trip.id} className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          trip.type === "flight" ? "bg-purple-500/20" : "bg-indigo-500/20",
                        )}
                      >
                        <Icon
                          className={cn("h-6 w-6", trip.type === "flight" ? "text-purple-400" : "text-indigo-400")}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{trip.route}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{trip.date}</span>
                          <span>·</span>
                          <span>{trip.distance}</span>
                          <span>·</span>
                          <span className="text-indigo-400">영수증 있음</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{trip.emission} kg</p>
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
