import SEO from '../components/layout/SEO'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import { FileCheck, Shield, AlertCircle, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service - OmniTasker',
    url: 'https://omnitasker.co.in/terms-of-service',
    description: 'Terms of Service governing the use of free online utility and file converter tools on OmniTasker.',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-300">
      <SEO
        title="Terms of Service – OmniTasker"
        description="Review the terms and conditions for using OmniTasker's free online document converters and utilities. Clear guidelines on usage and disclaimers."
        canonicalPath="/terms-of-service"
        schema={schema}
      />

      <div className="space-y-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 text-2xl shadow-lg">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Last Updated: October 31, 2026 | Governing access to <strong>omnitasker.co.in</strong>
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-6 border border-white/10 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using OmniTasker (referred to as &quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot; at <strong>omnitasker.co.in</strong>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any part of these terms, you may not use our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            2. License to Use Free Utilities
          </h2>
          <p>
            OmniTasker grants you a free, non-exclusive, revocable license to use our web tools (including PDF to Word, Word to PDF, Excel to PDF, Exam Photo Resizer, Background Remover, and JSON tools) for personal, academic, and business purposes. No payment or account registration is required.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            3. Acceptable Use Policy
          </h2>
          <p>
            You agree to use our website only for lawful purposes. You agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>Engage in automated scraping, bot attacks, or programmatic requests intended to degrade site availability for other users.</li>
            <li>Attempt to probe, reverse-engineer, or breach security measures or HTTP response headers.</li>
            <li>Use the tools to process unlawful, defamatory, infringing, or malicious content.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            4. User Responsibility &amp; Exam Guidelines Disclaimer
          </h2>
          <p>
            OmniTasker provides presets and resizing guidelines for examination portals (such as UPSC, SSC, GATE, IBPS, and NEET) based on publicly released recruitment guidelines. However, recruitment authorities may change specifications (such as pixel limits, file sizes, or photo date stamping) from time to time.
          </p>
          <p className="text-slate-400">
            Candidates remain solely responsible for reviewing the official notification brochure and previewing their files before final submission on government application portals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            5. Disclaimer of Warranties
          </h2>
          <p>
            The services and utilities on OmniTasker are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that file conversions will be completely error-free for non-standard or corrupted document formats.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            6. Limitation of Liability
          </h2>
          <p>
            Under no circumstances shall OmniTasker, its developers, or operators be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our tools, including loss of data or application disqualifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            7. Changes to Terms
          </h2>
          <p>
            We reserve the right to revise or modify these Terms at any time. Continued use of OmniTasker after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            8. Contact Information
          </h2>
          <p>
            If you have questions regarding these Terms of Service, please contact us at:{' '}
            <a href="mailto:omnitasker98@gmail.com" className="text-brand-400 font-mono font-semibold hover:underline">
              omnitasker98@gmail.com
            </a>{' '}
            or visit our <Link to="/contact" className="text-emerald-400 hover:underline">Contact Page</Link>.
          </p>
        </section>
      </div>

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}
