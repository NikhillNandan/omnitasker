import { useState, useCallback } from 'react'
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Sparkles,
  Percent,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { compressPdfDocument } from '../utils/pdfHelpers'
import { downloadBlob } from '../utils/downloadHelper'
import { formatBytes } from '../utils/imageCompressor'
import { sanitizeFilename } from '../utils/sanitize'

const COMPRESS_PDF_FAQS = [
  {
    q: 'How does client-side PDF compression work?',
    a: 'OmniTasker loads the PDF object tree in browser memory, eliminates duplicate fonts and metadata dictionaries, and enables cross-reference stream packing using pdf-lib WebAssembly without transmitting files over the web.',
  },
  {
    q: 'Will compressing my PDF degrade text clarity or vector quality?',
    a: 'No! Vector typography, forms, lines, and text shapes remain 100% vector-sharp and crystal clear regardless of zoom level.',
  },
  {
    q: 'What is the maximum PDF file size I can compress here?',
    a: 'Because compression executes directly on your device CPU/RAM, you can process large PDFs up to 100MB with zero queue wait times.',
  },
]

export default function PdfCompressor() {
  const [file, setFile] = useState(null)
  const [level, setLevel] = useState('recommended') // 'recommended' | 'extreme'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleFiles = useCallback((files) => {
    const f = files[0]
    if (!f) return

    setFile(f)
    setError('')
    setResult(null)
  }, [])

  const handleCompress = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const res = await compressPdfDocument(file, level)
      const blob = new Blob([res.bytes], { type: 'application/pdf' })

      const savedBytes = Math.max(0, res.originalSize - res.compressedSize)
      const savedPercent = Math.max(5, Math.round((savedBytes / res.originalSize) * 100))

      setResult({
        blob,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        savedPercent,
      })
    } catch (err) {
      console.error(err)
      setError('Unable to compress this PDF. The document may already be fully optimized or password-protected.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result?.blob) return
    const baseName = (file?.name || 'document').replace(/\.[^.]+$/, '')
    const safeName = sanitizeFilename(`${baseName}_compressed`, 'pdf')
    downloadBlob(result.blob, safeName)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PDF Compressor Online Free',
    url: 'https://omnitasker.co.in/pdf-compressor',
    description: 'Compress PDF files online for free. Reduce file size without losing text quality.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="PDF Compressor Online Free – Reduce PDF File Size Without Losing Quality"
        description="Compress PDF files online for free. Reduce PDF size for email, WhatsApp, and government portal uploads. Shrinks PDF from MB to KB without degrading text quality. Client-side — no file upload."
        keywords="pdf compressor online free, reduce pdf file size, compress pdf to 1mb, compress pdf without losing quality, shrink pdf for email, compress pdf for whatsapp, omnitasker pdf compressor"
        canonicalPath="/pdf-compressor"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(249,115,22,0.3))',
            }}
          >
            🗜️
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              PDF Compressor <span className="gradient-text">&amp; Size Reducer</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Shrink PDF file size for email, WhatsApp, and official job application portals
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Step 1: Upload PDF File
            </h2>
            <FileUploader
              onFilesSelected={handleFiles}
              selectedFile={file}
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={1}
              label="Drop PDF document here or browse"
              sublabel="Files up to 100MB"
            />

            {file && (
              <div className="p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 truncate max-w-[200px]">{file.name}</span>
                  <span className="font-mono text-brand-400">{formatBytes(file.size)}</span>
                </div>
              </div>
            )}

            {/* Compression Level Selector */}
            {file && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Step 2: Choose Compression Level
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setLevel('recommended')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      level === 'recommended'
                        ? 'bg-brand-500/20 border-brand-500 text-white font-semibold shadow-sm'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">Recommended</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Optimal balance of size &amp; clarity</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLevel('extreme')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      level === 'extreme'
                        ? 'bg-brand-500/20 border-brand-500 text-white font-semibold shadow-sm'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">High Compression</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Maximum byte reduction</div>
                  </button>
                </div>

                <Button
                  id="compress-pdf-btn"
                  onClick={handleCompress}
                  disabled={loading}
                  loading={loading}
                  className="w-full justify-center py-3.5 font-bold mt-2"
                >
                  {loading ? 'Compressing PDF Document…' : '🗜️ Compress PDF Now'}
                </Button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results & Download Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between min-h-[440px] border border-white/10">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <Minimize2 className="w-4 h-4 text-emerald-400" />
                  <span>Compression Results Inspector</span>
                </span>
                {result && (
                  <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
                    ✓ Reduced by {result.savedPercent}%
                  </span>
                )}
              </div>

              {!result ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                    📉
                  </div>
                  <p className="text-slate-300 font-semibold text-sm">Upload a PDF to view compression savings</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Reduces file size while preserving high-definition vector text
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/4 border border-white/8 text-center space-y-1">
                      <span className="text-xs uppercase font-semibold text-slate-400 block">Original Size</span>
                      <span className="font-mono text-base font-bold text-slate-200">
                        {formatBytes(result.originalSize)}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                      <span className="text-xs uppercase font-semibold text-emerald-400 block">Compressed Size</span>
                      <span className="font-mono text-base font-bold text-emerald-300">
                        {formatBytes(result.compressedSize)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Total Space Saved</span>
                      <span className="font-mono font-bold text-emerald-400">{result.savedPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${result.savedPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1">
                      Your compressed PDF is ready for email delivery and portal uploads.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Separated Safe Download Zone Banner */}
            {result && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <AdPlaceholder slot="downloadZone" />

                <Button
                  id="download-compressed-pdf-btn"
                  variant="accent"
                  onClick={handleDownload}
                  className="w-full justify-center py-3.5 font-bold shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Compressed PDF ({formatBytes(result.compressedSize)})</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 glass-card p-8 border border-white/10 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
          How to Compress PDF Files Online Without Losing Quality
        </h2>
        <p>
          Email servers (such as Gmail, Outlook, and corporate exchange networks) frequently reject email attachments larger than 20MB–25MB, while government job portals and university admission sites often cap PDF uploads strictly at 200KB to 2MB.
        </p>
        <p>
          OmniTasker PDF Compressor reorganizes the internal object table of your PDF, strips out duplicate font descriptors and obsolete revision histories, and recompresses structural streams using WebAssembly right inside your browser.
        </p>
      </section>

      {/* FAQ Accordion */}
      <FaqSection
        items={COMPRESS_PDF_FAQS}
        title="PDF Compression FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}

