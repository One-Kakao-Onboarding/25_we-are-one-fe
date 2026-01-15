// GreenPath Design Tokens
export const colors = {
  // Base Colors
  background: "#0B0F1A",
  card: "#161B26",
  cardHover: "#1C2333",
  border: "#2D3748",
  borderLight: "#374151",

  // Text Colors
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",

  // Employee Theme (Green)
  employee: {
    primary: "#22C55E",
    primaryHover: "#16A34A",
    primaryLight: "rgba(34, 197, 94, 0.1)",
    primaryBorder: "rgba(34, 197, 94, 0.3)",
  },

  // Consultant Theme (Purple/Blue Gradient)
  consultant: {
    start: "#6366F1",
    end: "#A855F7",
    light: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.3)",
  },

  // Status Colors
  status: {
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  // Chart Colors
  chart: {
    green: "#22C55E",
    blue: "#3B82F6",
    purple: "#A855F7",
    orange: "#F59E0B",
    red: "#EF4444",
    cyan: "#06B6D4",
    pink: "#EC4899",
  },
} as const

export const spacing = {
  card: "p-6",
  cardLg: "p-8",
  section: "py-8",
  gap: "gap-4",
  gapLg: "gap-6",
} as const

export const borderRadius = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
} as const
