import { useState, useCallback } from 'react'
import {
  FilePlus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Settings,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { createPdfFromImages } from '../utils/pdfHelpers'
import { downloadBlob } from '../utils/downloadHelper'
import { formatBytes } from '../utils/imageCompressor'
import { sanitizeFilename } from '../utils/sanitize'

const PDF_MAKER_FAQS = [
  {
    q: 'How do I combine multiple photos or scanned receipts into a single PDF document?',
    a: 'Upload your JPG, PNG, or WebP images into OmniTasker PDF Maker. Use the up and down arrow buttons on each photo card to arrange the exact page sequence you want, pick your desired paper size (A4, Letter, or Fit to Image), and click "Create & Download PDF".',
  },
  {
    q: 'Can I choose between Portrait and Landscape page orientations?',
    a: 'Yes! You can toggle between Portrait (vertical) and Landscape (horizontal) orientation, or select "Fit to Image" so each page adapts perfectly to the original image dimensions without empty margins.',
  },
  {
    q: 'Are my confidential bills, IDs, or receipts saved on any server?',
    a: 'Never. OmniTasker builds your PDF 100% locally in browser memory using WebAssembly. No photos are ever uploaded or stored.',
  },
]

export default function PdfMaker() {
  const [items, setItems] = useState([])
  const [pageSize, setPageSize] = useState('a4') // 'a4' | 'letter' | 'auto'
  const [orientation, setOrientation] = useState('portrait') // 'portrait' | 'landscape'
  const [margin, setMargin] = useState(20) // 0, 10, 20
  const [pdfTitle, setPdfTitle] = useState('combined_document')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdBlob, setCreatedBlob] = useState(null)

  const handleFiles = useCallback((files) => {
    if (!files || files.length === 0) return
    setError('')
    setCreatedBlob(null)

    const newItems = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: f.size,
      dataUrl: URL.createObjectURL(f),
    }))

    setItems((prev) => [...prev, ...newItems])
  }, [])

  const moveUp = (index) => {
    if (index === 0) return
    setItems((prev) => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[index - 1]
      copy[index - 1] = temp
      return copy
    })
    setCreatedBlob(null)
  }

  const moveDown = (index) => {
    if (index >= items.length - 1) return
    setItems((prev) => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[index + 1]
      copy[index + 1] = temp
      return copy
    })
    setCreatedBlob(null)
  }

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setCreatedBlob(null)
  }

  const handleGeneratePdf = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      const bytes = await createPdfFromImages(items, {
        pageSize,
        orientation,
        margin,
      })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setCreatedBlob(blob)
    } catch (err) {
      console.error(err)
      setError('Failed to generate PDF. Please verify all images are valid.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!createdBlob) return
    const safeName = sanitizeFilename(pdfTitle || 'document', 'pdf')
    downloadBlob(createdBlob, safeName)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PDF Maker & Images to PDF Converter',
    url: 'https://omnitasker.co.in/pdf-maker',
    description: 'Convert JPG, PNG, and WebP images into a single organized PDF online for free. Custom margins and page sizes.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="PDF Maker Online Free – Convert Images to PDF (JPG PNG to PDF, A4)"
        description="Create PDF from images online free. Combine multiple JPG, PNG, or WebP photos into a single organized PDF with A4 or Letter page size. Drag, reorder pages, and download instantly. No upload required."
        keywords="pdf maker online free, jpg to pdf converter, images to pdf, png to pdf, create pdf from photos free, combine images into pdf, omnitasker pdf maker"
        canonicalPath="/pdf-maker"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
            }}
          >
            📑
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              PDF Maker <span className="gradient-text">&amp; Image to PDF</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Combine multiple photos, scans, and documents into an organized, printable PDF
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload & Reordering Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Step 1: Upload Images (Photos, Scans, Receipts)
            </h2>
            <FileUploader
              onFilesSelected={handleFiles}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              maxFiles={50}
              label="Drop images here or click to browse"
              sublabel="Add single or multiple JPG, PNG, or WebP files"
            />

            {items.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Pages to Include ({items.length} Page{items.length !== 1 ? 's' : ''})
                  </span>
                  <button
                    type="button"
                    onClick={() => setItems([])}
                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/10 text-slate-300 text-xs font-bold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <img
                          src={item.dataUrl}
                          alt="Thumbnail"
                          className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10"
                        />
                        <div className="truncate max-w-[180px] sm:max-w-xs">
                          <p className="text-xs font-semibold text-slate-200 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{formatBytes(item.size)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Page Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(idx)}
                          disabled={idx === items.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Page Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 ml-1"
                          title="Remove Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* Layout Settings & Generate Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-400" />
              <span>Step 2: Document Layout &amp; Settings</span>
            </h2>

            {/* Document Title Input */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Document Name
              </label>
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="combined_document"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Page Size Option */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Page Size
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPageSize('a4')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    pageSize === 'a4'
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  Standard A4
                </button>
                <button
                  type="button"
                  onClick={() => setPageSize('letter')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    pageSize === 'letter'
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  US Letter
                </button>
                <button
                  type="button"
                  onClick={() => setPageSize('auto')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    pageSize === 'auto'
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  Fit to Image
                </button>
              </div>
            </div>

            {/* Page Orientation */}
            {pageSize !== 'auto' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Orientation
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      orientation === 'portrait'
                        ? 'bg-brand-500 text-white font-semibold shadow-sm'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                    }`}
                  >
                    📄 Portrait (Vertical)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      orientation === 'landscape'
                        ? 'bg-brand-500 text-white font-semibold shadow-sm'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                    }`}
                  >
                    📑 Landscape (Horizontal)
                  </button>
                </div>
              </div>
            )}

            {/* Margin Preset */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Margins
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMargin(0)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    margin === 0
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  No Margin
                </button>
                <button
                  type="button"
                  onClick={() => setMargin(15)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    margin === 15
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  Small (15pt)
                </button>
                <button
                  type="button"
                  onClick={() => setMargin(30)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    margin === 30
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  Standard (30pt)
                </button>
              </div>
            </div>

            {/* Action Button */}
            <Button
              id="generate-pdf-btn"
              onClick={handleGeneratePdf}
              disabled={loading || items.length === 0}
              loading={loading}
              className="w-full justify-center py-3.5 font-bold"
            >
              {loading ? 'Building PDF Document…' : `⚡ Generate PDF (${items.length} Pages)`}
            </Button>

            {/* Separated Safe Download Zone Banner */}
            {createdBlob && (
              <div className="pt-4 border-t border-white/10 space-y-4 animate-slide-up">
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                  <span>✓ PDF Document Ready!</span>
                  <span className="font-mono">{formatBytes(createdBlob.size)}</span>
                </div>

                <AdPlaceholder slot="downloadZone" />

                <Button
                  id="download-maker-pdf-btn"
                  variant="accent"
                  onClick={handleDownload}
                  className="w-full justify-center py-3.5 font-bold shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Assembled PDF</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 glass-card p-8 border border-white/10 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
          How to Merge Multiple Photos into a Clean PDF Document Online
        </h2>
        <p>
          Whether filing medical insurance reimbursement claims, submitting university assignments, or compiling invoices for tax auditing, submitting loose image files (JPG or PNG) often leads to missing documents or disarranged sequences. Converting your images into a single paginated PDF document guarantees that all pages stay in exact order.
        </p>
        <p>
          OmniTasker PDF Maker processes all file conversions client-side. Your sensitive photos, banking receipts, and identification cards are encoded locally without being sent across the web.
        </p>
      </section>

      {/* FAQ Accordion */}
      <FaqSection
        items={PDF_MAKER_FAQS}
        title="PDF Maker FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}

