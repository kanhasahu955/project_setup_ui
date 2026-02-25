import { getTailwindHex, hexFromProp, type TailwindColorName, type TailwindShade } from "@/utils/tailwindColors.util"

// --- Fonts (Tailwind default font families) ---
const FONT_FAMILY = {
  sans: "ui-sans-serif, system-ui, sans-serif, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif",
  serif: "ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
} as const

export type TailwindFontFamily = keyof typeof FONT_FAMILY

/** Get CSS font-family string for Tailwind font key. */
export function getTailwindFont(family: TailwindFontFamily): string {
  return FONT_FAMILY[family]
}

// --- Text (font size, weight) ---
const FONT_SIZE: Record<string, { size: string; lineHeight: string }> = {
  xs: { size: "0.75rem", lineHeight: "1rem" },
  sm: { size: "0.875rem", lineHeight: "1.25rem" },
  base: { size: "1rem", lineHeight: "1.5rem" },
  lg: { size: "1.125rem", lineHeight: "1.75rem" },
  xl: { size: "1.25rem", lineHeight: "1.75rem" },
  "2xl": { size: "1.5rem", lineHeight: "2rem" },
  "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
  "4xl": { size: "2.25rem", lineHeight: "2.5rem" },
  "5xl": { size: "3rem", lineHeight: "1" },
  "6xl": { size: "3.75rem", lineHeight: "1" },
  "7xl": { size: "4.5rem", lineHeight: "1" },
  "8xl": { size: "6rem", lineHeight: "1" },
  "9xl": { size: "8rem", lineHeight: "1" },
}

export type TailwindFontSize = keyof typeof FONT_SIZE

/** Get font size and line-height for Tailwind text size (e.g. 'sm', 'lg'). */
export function getTailwindTextSize(size: TailwindFontSize): { fontSize: string; lineHeight: string } {
  const v = FONT_SIZE[size]
  if (!v) throw new Error(`Unknown Tailwind font size: ${size}`)
  return { fontSize: v.size, lineHeight: v.lineHeight }
}

const FONT_WEIGHT = { thin: 100, extralight: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 } as const
export type TailwindFontWeight = keyof typeof FONT_WEIGHT

/** Get numeric font weight for Tailwind font key. */
export function getTailwindFontWeight(weight: TailwindFontWeight): number {
  return FONT_WEIGHT[weight]
}

/** Get hex for text color from Tailwind prop (e.g. 'slate-700'). */
export function getTailwindTextColor(prop: string): string {
  return hexFromProp(prop)
}

// --- Button (semantic variants using palette) ---
export interface ButtonColors {
  bg: string
  hover: string
  text: string
  border?: string
}

export function getTailwindButtonColors(variant: "primary" | "secondary" | "danger" | "success" | "ghost"): ButtonColors {
  switch (variant) {
    case "primary":
      return { bg: getTailwindHex("blue", 500), hover: getTailwindHex("blue", 600), text: "#ffffff" }
    case "secondary":
      return { bg: getTailwindHex("slate", 200), hover: getTailwindHex("slate", 300), text: getTailwindHex("slate", 800) }
    case "danger":
      return { bg: getTailwindHex("red", 500), hover: getTailwindHex("red", 600), text: "#ffffff" }
    case "success":
      return { bg: getTailwindHex("green", 500), hover: getTailwindHex("green", 600), text: "#ffffff" }
    case "ghost":
      return { bg: "transparent", hover: getTailwindHex("slate", 100), text: getTailwindHex("slate", 700) }
    default:
      return getTailwindButtonColors("primary")
  }
}

// --- Background ---
/** Get hex for background from Tailwind prop (e.g. 'slate-50'). */
export function getTailwindBackground(prop: string): string {
  return hexFromProp(prop)
}

/** Get hex for background from color + shade. */
export function getTailwindBg(color: TailwindColorName, shade: TailwindShade): string {
  return getTailwindHex(color, shade)
}

// --- Table ---
export interface TableTheme {
  border: string
  headerBg: string
  headerText: string
  rowBg: string
  rowText: string
  stripeBg: string
}

/** Get table colors from Tailwind palette (slate-based default). */
export function getTailwindTableTheme(overrides?: Partial<TableTheme>): TableTheme {
  const base: TableTheme = {
    border: getTailwindHex("slate", 200),
    headerBg: getTailwindHex("slate", 100),
    headerText: getTailwindHex("slate", 800),
    rowBg: "#ffffff",
    rowText: getTailwindHex("slate", 700),
    stripeBg: getTailwindHex("slate", 50),
  }
  return overrides ? { ...base, ...overrides } : base
}
