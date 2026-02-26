/** Single auth image used for both mobile (top) and desktop (right panel). */
const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"

/**
 * Right-side visual panel for auth: same image as mobile, overlay slogan.
 * Fills the entire right panel on desktop (no gap); hidden on mobile.
 */
export function AuthVisualPanel() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Image fills panel, object-cover for proper aspect ratio */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-indigo-900/50" />
      <div className="absolute inset-0 flex flex-col justify-center items-end pr-8 lg:pr-12 pl-12 lg:pl-24">
        <p className="text-white text-lg md:text-xl lg:text-2xl font-medium text-right max-w-sm md:max-w-md leading-relaxed">
          Browse thousands of properties to buy, sell, or rent with trusted agents.
        </p>
      </div>
    </div>
  )
}

/** Auth image at top of screen on mobile (same image as desktop panel). */
export function AuthMobileIllustration() {
  return (
    <div className="md:hidden w-full flex-shrink-0 px-1 pt-1">
      <div
        className="w-full aspect-[4/3] min-h-[120px] max-h-[200px] bg-slate-100 bg-contain bg-center rounded-xl border border-slate-200"
        style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
        aria-hidden
      />
    </div>
  )
}
