import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

/**
 * FaqSection – Production FAQ accordion with Schema.org FAQPage rich snippet support.
 *
 * @param {Object} props
 * @param {Array<{q: string, a: string}>} props.items - List of questions & answers
 * @param {string} [props.title="Frequently Asked Questions"] - Section title
 * @param {string} [props.className=""]
 */
export default function FaqSection({
  items = [],
  title = 'Frequently Asked Questions',
  className = '',
}) {
  const [openIndex, setOpenIndex] = useState(0) // First open by default for immediate engagement

  if (!items.length) return null

  // Generate Google Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <section className={`glass-card p-6 sm:p-8 space-y-6 border border-white/10 ${className}`}>
      {/* Inject FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
        <HelpCircle className="w-5 h-5 text-brand-400" />
        <h2 className="font-display font-bold text-lg sm:text-xl text-slate-100 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white/5 border-white/15 shadow-md'
                  : 'bg-white/2 border-white/5 hover:border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm text-slate-200 leading-snug">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
