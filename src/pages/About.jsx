import SEO from '../components/layout/SEO'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import { Sparkles, Shield, Zap, Globe, CheckCircle2, Lock, FileSpreadsheet, FileText, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About OmniTasker',
    url: 'https://omnitasker.co.in/about',
    description: 'Learn about OmniTasker - A Free Online Utility & File Converter Tool Hub offering 100% private in-browser tools.',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-300">
      <SEO
        title="About OmniTasker – Free Online Utility & File Converter Tool Hub"
        description="OmniTasker is a 100% free online utility and file converter hub. Convert PDF to Word, Word to PDF, Excel to PDF, resize exam photos, and format JSON with zero server uploads."
        canonicalPath="/about"
        schema={schema}
      />

      {/* Header */}
      <div className="space-y-4 mb-10 text-center sm:text-left">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          About <span className="gradient-text">OmniTasker</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Your free, private, all-in-one online utility and document conversion platform.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 space-y-8 border border-white/10 text-xs sm:text-sm leading-relaxed">
        {/* Mission Statement */}
        <section className="space-y-3">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
            What is OmniTasker?
          </h2>
          <p>
            <strong>OmniTasker</strong> (omnitasker.co.in) is a free web-based utility hub built to simplify everyday digital tasks. Whether you need to convert an Excel spreadsheet into a presentation-ready PDF, transform a PDF into an editable Word document, resize photos for government exam portals, remove image backgrounds, or validate developer JSON code, OmniTasker delivers fast, professional results in seconds.
          </p>
          <p>
            Unlike other conversion websites that force users to register, pay expensive monthly subscriptions, or wait in slow upload queues, every tool on OmniTasker is <strong>100% free and requires no sign-up or registration</strong>.
          </p>
        </section>

        {/* 3 Core Value Pillars */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">100% In-Browser Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Files never upload to external servers. Conversions run inside your device&apos;s browser memory, ensuring your confidential documents remain strictly yours.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Instant Local Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No internet upload or download wait times. Processing is powered locally by modern browser APIs, delivering near-instant file outputs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Free Forever, No Watermarks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enjoy unlimited file conversions with no hidden charges, trial periods, daily limits, or intrusive watermarks on your generated files.
            </p>
          </div>
        </div>

        {/* Tool Categories Overview */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
            Our Core Tool Suites
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-brand-400 font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>PDF &amp; Document Converters</span>
              </div>
              <p className="text-xs text-slate-400">
                High-fidelity converters including <strong>PDF to Word (.docx)</strong>, <strong>Word to PDF</strong>, <strong>Excel to PDF (.xlsx / .csv)</strong>, PDF Merger, and PDF Compressor.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ImageIcon className="w-4 h-4" />
                <span>Exam Photo &amp; Image Tools</span>
              </div>
              <p className="text-xs text-slate-400">
                Official 1-click photo and signature resizer for Indian government exams (UPSC, SSC, GATE, IBPS, NEET), AI background remover, and KB image compressor.
              </p>
            </div>
          </div>
        </section>

        {/* Support & Contact */}
        <section className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="font-display text-xl font-bold text-slate-100">
            Have Questions or Need Help?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            We are dedicated to maintaining a reliable, clean, and helpful suite of utilities. If you experience an issue or have a tool suggestion, reach out directly at{' '}
            <a href="mailto:omnitasker98@gmail.com" className="text-brand-400 hover:underline font-mono">
              omnitasker98@gmail.com
            </a>{' '}
            or visit our <Link to="/contact" className="text-emerald-400 hover:underline">Contact Us</Link> page.
          </p>
        </section>
      </div>

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}
