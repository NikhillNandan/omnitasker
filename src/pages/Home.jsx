import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Image as ImageIcon,
  FileText,
  Code2,
  QrCode,
  ShieldCheck,
  Zap,
  Infinity as InfinityIcon,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Scissors,
  FilePlus,
  Minimize2,
  FileCode,
  FileSpreadsheet,
  Award,
} from 'lucide-react'
import SEO from '../components/layout/SEO'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import FaqSection from '../components/ui/FaqSection'

const ALL_TOOLS = [
  // --- Image & Govt Tools ---
  {
    id: 'govt-exam-photo-resizer',
    name: 'Govt Exam Photo & Signature Resizer',
    category: 'image',
    categoryLabel: 'Govt & Image',
    description: '1-Click auto-compliance for UPSC, SSC CGL/CHSL, GATE, Bank IBPS, and NEET with Name & Date stamping and strict KB bounds.',
    path: '/govt-exam-photo-resizer',
    icon: Award,
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.25)',
    badge: 'Top Choice 🇮🇳',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    keywords: ['govt exam photo resizer', 'ssc signature 10 to 20 kb', 'upsc photo resizer with date', 'gate photo 480x640', 'ibps signature resizer'],
    cta: 'Resize for Govt Exams',
  },
  {
    id: 'image-resizer',
    name: 'Custom Image Resizer & Converter',
    category: 'image',
    categoryLabel: 'Govt & Image',
    description: 'Scale images to custom pixel/cm/inch dimensions with aspect ratio lock and convert between JPG, PNG, and WebP.',
    path: '/image-resizer',
    icon: ImageIcon,
    color: 'from-teal-500 to-cyan-600',
    glow: 'rgba(20,184,166,0.25)',
    badge: 'High Precision',
    badgeColor: 'bg-teal-500/20 text-teal-300',
    keywords: ['image resizer online', 'resize image 1080x1080', 'png to jpg converter', 'convert webp to png'],
    cta: 'Resize Image',
  },
  {
    id: 'background-remover',
    name: 'Background Remover & Cutout',
    category: 'image',
    categoryLabel: 'Govt & Image',
    description: 'Client-side magic wand tool. Remove backgrounds instantly or replace with transparent, white, or passport sky blue.',
    path: '/background-remover',
    icon: Scissors,
    color: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.25)',
    badge: 'Magic Wand ✨',
    badgeColor: 'bg-pink-500/20 text-pink-300',
    keywords: ['background remover online', 'transparent background png', 'remove bg free', 'passport white background'],
    cta: 'Remove Background',
  },
  {
    id: 'compress-image',
    name: 'Image Compressor & KB Reducer',
    category: 'image',
    categoryLabel: 'Govt & Image',
    description: 'Compress PNG, JPG, and WebP files to under 20KB, 50KB, or 100KB with dual sliders for quality and maximum file size.',
    path: '/compress-image',
    icon: Minimize2,
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.25)',
    badge: 'Popular 🔥',
    badgeColor: 'bg-violet-500/20 text-violet-300',
    keywords: ['compress png online free', 'reduce image size in kb', 'compress jpeg without losing quality', 'tinypng alternative'],
    cta: 'Compress Image',
  },

  // --- PDF & Document Tools ---
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter (.docx)',
    category: 'pdf',
    categoryLabel: 'PDF & Document Tools',
    description: 'Extract clean formatted text from any PDF and download an editable Microsoft Word .docx file — opens perfectly in Word & Google Docs.',
    path: '/pdf-to-word',
    icon: FileCode,
    color: 'from-blue-500 to-indigo-600',
    glow: 'rgba(59,130,246,0.25)',
    badge: 'Editable .docx',
    badgeColor: 'bg-blue-500/20 text-blue-300',
    keywords: ['pdf to word', 'convert pdf to docx free', 'pdf to word converter online', 'edit pdf in word', 'omnitasker pdf to word'],
    cta: 'Convert to Word',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    category: 'pdf',
    categoryLabel: 'PDF & Document Tools',
    description: 'Convert Microsoft Word .docx files into clean, print-ready A4 PDF documents. Downloads instantly — opens in any PDF viewer.',
    path: '/word-to-pdf',
    icon: FileText,
    color: 'from-indigo-500 to-purple-600',
    glow: 'rgba(99,102,241,0.25)',
    badge: '1-Click PDF',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
    keywords: ['word to pdf', 'convert docx to pdf online free', 'word to pdf converter', 'docx to pdf'],
    cta: 'Convert to PDF',
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF Converter',
    category: 'pdf',
    categoryLabel: 'PDF & Document Tools',
    description: 'Convert Excel spreadsheets (.xlsx, .xls) and CSV files to clean, table-formatted PDF files. All sheets included. No upload needed.',
    path: '/excel-to-pdf',
    icon: FileSpreadsheet,
    color: 'from-emerald-500 to-green-600',
    glow: 'rgba(16,185,129,0.25)',
    badge: 'New ✨',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    keywords: ['excel to pdf', 'xlsx to pdf', 'csv to pdf converter', 'convert spreadsheet to pdf free'],
    cta: 'Convert Excel',
  },
  {
    id: 'pdf-maker',
    name: 'PDF Maker & Image to PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    description: 'Combine multiple photos, scans, and receipts into an organized, paginated PDF with custom A4/Letter margins.',
    path: '/pdf-maker',
    icon: FilePlus,
    color: 'from-purple-500 to-pink-600',
    glow: 'rgba(168,85,247,0.25)',
    badge: 'Multi-Page',
    badgeColor: 'bg-purple-500/20 text-purple-300',
    keywords: ['pdf maker', 'convert images to pdf online', 'photos to pdf free', 'jpg to pdf converter'],
    cta: 'Create PDF',
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor & Size Reducer',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    description: 'Shrink PDF file size for email attachments and portal uploads without degrading vector text quality.',
    path: '/pdf-compressor',
    icon: Minimize2,
    color: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.25)',
    badge: 'Shrink KB',
    badgeColor: 'bg-amber-500/20 text-amber-300',
    keywords: ['pdf compressor', 'reduce pdf size online', 'compress pdf free in kb', 'shrink pdf file size'],
    cta: 'Compress PDF',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF & Combine Documents',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    description: 'Drag and drop multiple PDF files, visually reorder pages with up/down arrows, and combine them into a single clean file.',
    path: '/merge-pdf',
    icon: FileText,
    color: 'from-rose-500 to-red-600',
    glow: 'rgba(244,63,94,0.25)',
    badge: '100% Private',
    badgeColor: 'bg-rose-500/20 text-rose-300',
    keywords: ['merge pdf files in browser', 'combine pdf documents free', 'join pdf pages without upload'],
    cta: 'Merge PDF',
  },
  // --- Developer Tools ---
  {
    id: 'qr-generator',
    name: 'Custom QR Code Generator',
    category: 'dev',
    categoryLabel: 'Developer Tools',
    description: 'Generate custom-colored QR codes for websites, WiFi, and UPI with instant vector SVG and high-res PNG downloads.',
    path: '/qr-generator',
    icon: QrCode,
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.25)',
    badge: 'PNG + SVG',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    keywords: ['qr code generator', 'custom qr code free', 'svg qr code maker', 'upi qr code generator'],
    cta: 'Create QR Code',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'dev',
    categoryLabel: 'Developer Tools',
    description: 'Prettify, minify, sort keys, and validate JSON data with line-accurate syntax error diagnostics.',
    path: '/json-formatter',
    icon: Code2,
    color: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.25)',
    badge: 'Instant AST',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
    keywords: ['json formatter online', 'beautify json', 'minify json', 'validate json syntax'],
    cta: 'Format JSON',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Tools (12)' },
  { id: 'image', label: 'Image & Govt Tools' },
  { id: 'pdf', label: 'PDF & Documents' },
  { id: 'dev', label: 'Developer Tools' },
]

const HOMEPAGE_FAQS = [
  {
    q: 'Are my files, photos, or documents uploaded to any remote server?',
    a: 'No. OmniTasker operates with 100% client-side execution. All file processing (image compression, photo resizing, PDF merging, video trimming, and JSON formatting) happens directly inside your browser memory using WebAssembly, HTML5 Canvas, and modern Web APIs. Your files never leave your computer or phone.',
  },
  {
    q: 'How fast is client-side processing compared to traditional online converters?',
    a: 'Because zero bytes are transmitted across internet servers, processing is virtually instantaneous. There are no upload queues, network bottlenecks, or conversion waiting times. Everything renders immediately on your device CPU/GPU.',
  },
  {
    q: 'Is OmniTasker completely free to use without registration or watermarks?',
    a: 'Yes! OmniTasker is 100% free with unlimited usage. There are no hidden fees, subscriptions, account sign-up requirements, or watermarks attached to your generated files.',
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Real-time tool filtering by search query and category
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchesCat = activeCategory === 'all' || t.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesCat

      const matchesSearch =
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.categoryLabel.toLowerCase().includes(query) ||
        t.keywords.some((k) => k.toLowerCase().includes(query))

      return matchesCat && matchesSearch
    })
  }, [searchQuery, activeCategory])

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OmniTasker',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://omnitasker.co.in',
    description: 'Free Online Web Tools — Fast, Secure & 100% Private. Compress PNG/JPG, resize images, merge PDFs, format JSON, and generate QR codes client-side.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://omnitasker.co.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="animate-fade-in">
      <SEO
        title="OmniTasker – Free Online Tools: PDF to Word, Excel to PDF, Image Resizer & More"
        description="Free online tools: PDF to Word, Word to PDF, Excel to PDF converter, Image Resizer for Govt Exams (UPSC/SSC/GATE), Background Remover, Image Compressor, Merge PDF, QR Code Generator & JSON Formatter. No upload, 100% free."
        keywords="omnitasker, pdf to word converter free, word to pdf online, excel to pdf converter, image resizer for govt exam, background remover online, compress image online, merge pdf free, qr code generator, json formatter online, omnitasker.co.in"
        canonicalPath="/"
        schema={websiteSchema}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          {/* Privacy Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs sm:text-sm text-slate-300 border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Files never leave your device · 100% In-Browser Privacy</span>
          </div>

          {/* High-Converting H1 Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Free Online Web Tools —{' '}
            <span className="gradient-text">Fast, Secure &amp; 100% Private</span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            High-performance client-side utilities. Compress PNG &amp; JPG images, merge PDF files, format JSON, cut Reels &amp; Shorts, and generate custom vector QR codes with zero server uploads.
          </p>

          {/* Real-Time Live Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. compress png, merge pdf, 1080x1080, json, qr)…"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/15 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-2xl transition-all"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === c.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Ad — Below Hero, Above Tool Grid */}
      <div className="max-w-[728px] mx-auto px-4 sm:px-6 mb-10">
        <AdPlaceholder slot="leaderboard" />
      </div>

      {/* Category Grids Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Explore Our Core Tools
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Showing {filteredTools.length} production-grade utilities ready to run in your browser
            </p>
          </div>
          <span className="badge bg-white/5 text-slate-400 text-xs hidden sm:inline-block">
            {activeCategory.toUpperCase()}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 space-y-3">
            <Search className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-slate-300 font-semibold text-sm">No tools found matching &quot;{searchQuery}&quot;</p>
            <p className="text-slate-500 text-xs">Try searching for &quot;compress&quot;, &quot;pdf&quot;, &quot;resize&quot;, &quot;json&quot;, or &quot;qr&quot;</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="text-xs text-brand-400 hover:underline pt-2 inline-block font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon

              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  id={`tool-card-${tool.id}`}
                  className="glass-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${tool.color} shadow-lg transition-transform group-hover:scale-105`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className={`badge ${tool.badgeColor} border border-white/10 text-xs`}>
                        {tool.badge}
                      </span>
                    </div>

                    {/* Tool Title & Description */}
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-white transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action CTA */}
                  <div className="pt-5 mt-4 border-t border-white/8 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-brand-400 transition-colors">
                    <span>{tool.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Mid-Page Ad — Between Tool Grid and "Why Choose" Section */}
      <div className="max-w-[728px] mx-auto px-4 sm:px-6 mb-12">
        <AdPlaceholder slot="leaderboard" />
      </div>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            Privacy &amp; Performance Built-In
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-100">
            Why Choose OmniTasker?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            We built OmniTasker to eliminate the privacy risks, slow upload queues, and file restrictions of traditional converters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="glass-card p-6 sm:p-8 space-y-4 border border-white/10 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">
              Zero Data Collection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your files, photos, PDFs, and API tokens are never uploaded, stored, or viewed on remote servers. All code runs locally in your browser memory for 100% compliance.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="glass-card p-6 sm:p-8 space-y-4 border border-white/10 hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">
              Instant Speed &amp; No Queues
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Say goodbye to &quot;Uploading file (20%)...&quot; delays. With WebAssembly, HTML5 Canvas, and modern Web APIs, conversions happen in milliseconds directly on your hardware.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="glass-card p-6 sm:p-8 space-y-4 border border-white/10 hover:border-pink-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <InfinityIcon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">
              No Limits &amp; 100% Free
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No daily conversion caps, no forced registrations, and no watermarks stamped onto your documents or photos. Clean, high-resolution downloads on demand.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Long-Tail FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <FaqSection
          items={HOMEPAGE_FAQS}
          title="Frequently Asked Questions About OmniTasker"
        />
      </div>

      {/* Bottom Ad — After FAQ, Above Footer */}
      <div className="max-w-[728px] mx-auto px-4 sm:px-6 mb-16">
        <AdPlaceholder slot="leaderboard" />
      </div>
    </div>
  )
}
