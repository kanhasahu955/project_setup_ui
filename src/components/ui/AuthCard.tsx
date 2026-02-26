import { Card } from "antd"
import type { ReactNode } from "react"

export interface AuthCardProps {
  title: string
  description?: string
  children: ReactNode
  /** Max width of the card (default: 400px). */
  maxWidth?: string | number
  className?: string
}

/**
 * Card container for auth forms. Uses antd Card + Tailwind for consistent styling.
 */
export function AuthCard({
  title,
  description,
  children,
  maxWidth = "400px",
  className = "",
}: AuthCardProps) {
  return (
    <Card
      className={`w-full border-slate-700/80 shadow-xl ${className}`.trim()}
      styles={{
        body: { padding: "1.5rem 1.5rem" },
      }}
      style={{
        maxWidth: typeof maxWidth === "number" ? maxWidth : maxWidth,
        backgroundColor: "rgb(15 23 42 / 0.95)",
        borderColor: "rgb(51 65 85 / 0.8)",
      }}
    >
      <div className="space-y-1 mb-6">
        <h1 className="text-xl font-semibold text-slate-50 m-0">{title}</h1>
        {description != null && (
          <p className="text-sm text-slate-400 m-0">{description}</p>
        )}
      </div>
      {children}
    </Card>
  )
}
