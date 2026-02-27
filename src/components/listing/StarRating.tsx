import { useState } from 'react'

const MAX_STARS = 5

export interface StarRatingDisplayProps {
  /** Average rating 1–5 (can be float). */
  rating: number | null | undefined
  /** Total number of ratings. */
  totalRatings?: number | null
  /** Optional size: sm | md. */
  size?: 'sm' | 'md'
  className?: string
}

/** Display-only: shows filled/empty stars and optional count. */
export function StarRatingDisplay({
  rating,
  totalRatings,
  size = 'md',
  className = '',
}: StarRatingDisplayProps) {
  const value = rating != null ? Math.min(MAX_STARS, Math.max(0, rating)) : 0
  const full = Math.floor(value)
  const hasHalf = value - full >= 0.5
  const empty = MAX_STARS - full - (hasHalf ? 1 : 0)
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-400 ${sizeClass} ${className}`}>
      {Array.from({ length: full }, (_, i) => (
        <span key={`f-${i}`} aria-hidden>★</span>
      ))}
      {hasHalf && <span aria-hidden>★</span>}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e-${i}`} className="text-slate-500" aria-hidden>☆</span>
      ))}
      {totalRatings != null && totalRatings > 0 && (
        <span className="text-slate-400 text-xs ml-1">({totalRatings})</span>
      )}
    </span>
  )
}

export interface StarRatingInputProps {
  /** Current value 1–5 (0 = none). */
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
  className?: string
}

/** Interactive: click to set rating 1–5. */
export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  className = '',
}: StarRatingInputProps) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-amber-400 ${className}`}
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: MAX_STARS }, (_, i) => {
        const star = i + 1
        const filled = star <= display
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={`p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110'}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {filled ? '★' : '☆'}
          </button>
        )
      })}
    </span>
  )
}
