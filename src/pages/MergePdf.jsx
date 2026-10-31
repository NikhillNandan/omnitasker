import { useState, useCallback } from 'react'
import {
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  CheckCircle,
  Layers,
  AlertCircle,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { mergePdfs, downloadBytes } from '../utils/pdfMerger'
import { formatBytes } from '../utils/imageCompressor'
import { downloadBlob } from '../utils/downloadHelper'

const MERGE_PDF_FAQS = [
  {
    q: 'How do I combine multiple PDF files into one in my browser?',
    a: 'Simply drag and drop your PDF files into the upload box or browse to select them. You can reorder the documents using the up and down arrow buttons, then click "Merge PDFs Now" to trigger an instant download of your single combined file.',
  },
  {
    q: 'Can I reorder or rearrange the sequence of PDF documents before merging?',
    a: 'Yes! Our visual reordering list displays each file with its order badge (#1, #2, etc.) and file size. Use the up and down arrows on each card to arrange the exact page sequence you want in your final document.',
  },
  {
    q: 'Is merging PDFs on OmniTasker confidential and safe for sensitive legal documents?',
    a: '100% yes. Unlike traditional conversion websites that upload files to their servers, OmniTasker uses pdf-lib to merge pages directly in your browser memory. Your documents are never uploaded, stored, or viewed by anyone.',
  },
]

function PdfItem({ file, index, total, onRemove, onMoveUp, onMoveDown }) {
  return (
    <div className="glass-card flex items-center gap-3 px-4 py-3.5 border border-white/10 animate-slide-up hover:border-white/20 transition-all">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
          title="Move Up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
          title="Move Down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-10 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xs font-bold flex-shrink-0">
        <FileText className="w-5 h-5 text-rose-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-slate-100 text-sm font-medium truncate">{file.name}</p>
        <p className="text-slate-500 text-xs mt-0.5 font-mono">{formatBytes(file.size)}</p>
      </div>

      <span className="text-slate-500 text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/8">
        #{index + 1}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        title="Remove PDF"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function MergePdf() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [mergedBlob, setMergedBlob] = useState(null)
  const [error, setError] = useState('')

  const handleFiles = useCallback((newFiles) => {
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...newFiles.filter((f) => !names.has(f.name))]
    })
    setMergedBlob(null)
    setError('')
  }, [])

  const remove = (i) => {
    setFiles((p) => p.filter((_, idx) => idx !== i))
    setMergedBlob(null)
  }

  const moveUp = (i) => {
    if (i === 0) return
    setFiles((p) => {
      const a = [...p]
      ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
      return a
    })
  }

  const moveDown = (i) => {
    setFiles((p) => {
      if (i >= p.length - 1) return p
      const a = [...p]
      ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
      return a
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setLoading(true)
    setError('')
    setMergedBlob(null)

    try {
      const bytes = await mergePdfs(files)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setMergedBlob(blob)
      downloadBlob(blob, 'merged_document.pdf')
    } catch (e) {
      console.error(e)
      setError(e.message ?? 'Merge failed. Please ensure PDFs are not password-encrypted.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAgain = () => {
    if (mergedBlob) {
      downloadBlob(mergedBlob, 'merged_document.pdf')
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Merge PDF Online Free',
    url: 'https://omnitasker.co.in/merge-pdf',
    description: 'Merge multiple PDF files into one online for free. Reorder pages and combine instantly with zero upload.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Merge PDF Online Free – Combine Multiple PDF Files into One (No Upload)"
        description="Merge multiple PDF files into one document online for free. Drag and drop, reorder pages with arrows, and download a combined PDF instantly. 100% client-side — your files never leave your browser."
        keywords="merge pdf online free, combine pdf files, join pdf pages, merge multiple pdfs, pdf merger free, combine pdf documents without upload, omnitasker merge pdf"
        canonicalPath="/merge-pdf"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.3), rgba(236,72,153,0.3))',
            }}
          >
            📄
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Merge PDF <span className="gradient-text">&amp; Combine Documents</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Combine multiple PDF files into one clean document with visual reordering — 100% private in your browser
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Multi-file drag-and-drop uploader */}
        <FileUploader
          onFiles={handleFiles}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple
          label="Drop PDF files here or click to browse"
          subLabel="Select multiple PDFs to combine"
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-200 font-semibold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <span>
                  {files.length} PDF File{files.length !== 1 ? 's' : ''} · Use arrows to reorder pages
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setFiles([])
                  setMergedBlob(null)
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Visual Reordering List */}
            <div className="space-y-2">
              {files.map((f, i) => (
                <PdfItem
                  key={f.name + i}
                  file={f}
                  index={i}
                  total={files.length}
                  onRemove={() => remove(i)}
                  onMoveUp={() => moveUp(i)}
                  onMoveDown={() => moveDown(i)}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mergedBlob && (
          <div className="space-y-4 animate-slide-up">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>PDFs combined successfully! Download has started automatically.</span>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={handleDownloadAgain}
                className="px-3 py-1.5 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download Again</span>
              </Button>
            </div>
            <AdPlaceholder slot="downloadZone" />
          </div>
        )}

        {/* Action Button */}
        <div>
          <Button
            id="merge-pdf-btn"
            onClick={handleMerge}
            disabled={files.length < 2 || loading}
            loading={loading}
            className="w-full justify-center py-3.5 font-bold shadow-lg text-sm"
          >
            {loading ? 'Merging PDFs…' : `📄 Merge ${files.length} PDF${files.length !== 1 ? 's' : ''} Now`}
          </Button>
          {files.length < 2 && (
            <p className="text-center text-slate-500 text-xs mt-2">
              Please add at least 2 PDF files to enable merging
            </p>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          <div className="glass-card p-4 text-center border border-white/10">
            <div className="text-2xl mb-1">🔒</div>
            <h4 className="text-slate-200 font-semibold text-xs mb-1">100% Client-Side</h4>
            <p className="text-slate-500 text-[11px]">PDF bytes are joined locally in memory</p>
          </div>
          <div className="glass-card p-4 text-center border border-white/10">
            <div className="text-2xl mb-1">⚡</div>
            <h4 className="text-slate-200 font-semibold text-xs mb-1">Zero Latency</h4>
            <p className="text-slate-500 text-[11px]">Powered by pdf-lib WebAssembly</p>
          </div>
          <div className="glass-card p-4 text-center border border-white/10">
            <div className="text-2xl mb-1">♾️</div>
            <h4 className="text-slate-200 font-semibold text-xs mb-1">Unlimited Pages</h4>
            <p className="text-slate-500 text-[11px]">No page caps, completely free</p>
          </div>
        </div>
      </div>

      {/* 3-Question SEO FAQ Accordion */}
      <FaqSection
        items={MERGE_PDF_FAQS}
        title="PDF Merging FAQs"
        className="mt-12"
      />

      {/* AdSense Placement at Bottom */}
      <AdPlaceholder slot="leaderboard" className="mt-10" />
    </div>
  )
}
