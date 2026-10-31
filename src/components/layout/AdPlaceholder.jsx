/**
 * AdPlaceholder — Google AdSense-Ready Container
 *
 * Renders a clean, fixed-height, dashed utility wrapper
 * (min-h-[90px] for banners/leaderboards, min-h-[250px] for rectangles)
 * so the website looks pristine, professionally spaced, and avoids
 * Cumulative Layout Shift (CLS) before and after AdSense ads load.
 */

const SLOT_STYLES = {
  leaderboard: {
    className: 'w-full max-w-full sm:max-w-[728px] mx-auto min-h-[90px]',
  },
  rectangle: {
    className: 'w-full max-w-[300px] mx-auto min-h-[250px]',
  },
  banner: {
    className: 'w-full max-w-[468px] mx-auto min-h-[90px]',
  },
  sidebar: {
    className: 'w-full max-w-[300px] mx-auto min-h-[600px]',
  },
  downloadZone: {
    className: 'w-full max-w-xl mx-auto min-h-[90px]',
  },
  inFeed: {
    className: 'w-full min-h-[250px]',
  },
}

export default function AdPlaceholder({ slot = 'leaderboard', className = '', children = null }) {
  const style = SLOT_STYLES[slot] || SLOT_STYLES.leaderboard

  return (
    <div
      className={`rounded-2xl border border-dashed border-white/10 bg-white/[0.015] flex items-center justify-center overflow-hidden max-w-full transition-colors ${style.className} ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}
