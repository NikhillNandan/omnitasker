import { cn } from '../../utils/cn'

/**
 * Button – production-ready reusable button with Vercel/TinyPNG minimalist aesthetics.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  id,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]'

  const variants = {
    primary: 'bg-white text-slate-950 hover:bg-slate-200 shadow-sm font-semibold focus:ring-white',
    secondary: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 focus:ring-white/20',
    accent: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-md shadow-emerald-500/20 focus:ring-emerald-400',
    brand: 'bg-brand-500 hover:bg-brand-400 text-white font-semibold shadow-md shadow-brand-500/20 focus:ring-brand-400',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 focus:ring-rose-400',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 focus:ring-white/10',
    outline: 'border border-white/15 text-slate-200 hover:border-white/30 hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  }

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
