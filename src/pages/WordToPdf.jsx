import { useState, useCallback } from 'react'
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  Layers,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { extractTextFromDocx } from '../utils/docxReader'
import { createPdfFromText } from '../utils/pdfHelpers'
import { downloadBlob } from '../utils/downloadHelper'
import { formatBytes } from '../utils/imageCompressor'
import { sanitizeFilename } from '../utils/sanitize'

const WORD_TO_PDF_FAQS = [
  {
    q: 'How does OmniTasker convert DOCX files into PDF in the browser?',
    a: 'OmniTasker unzips the OpenXML document structures of your .docx file client-side, extracts paragraphs and typographic hierarchy with Mammoth.js, and lays out clean A4 pages using pdf-lib with standard margins and professional vector fonts.',
  },
  {
    q: 'Does this converter preserve formatting and paragraph breaks?',
    a: 'Yes! Paragraph breaks, headings, and line wraps are preserved and cleanly formatted into standard printable A4 dimensions.',
  },
  {
    q: 'Will my converted PDF look crisp when printed on paper?',
    a: 'Absolutely. The output PDF uses vector font embeddings and standard PostScript coordinates, ensuring sharp typography on both screens and commercial printers.',
  },
]

export default function WordToPdf() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pdfBlob, setPdfBlob] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleFiles = useCallback(async (files) => {
    const f = files[0]
    if (!f) return

    setFile(f)
    setError('')
    setExtractedText('')
    setPdfBlob(null)
    setDownloadSuccess(false)
    setLoading(true)

    try {
      const text = await extractTextFromDocx(f)
      setExtractedText(text)

      const bytes = await createPdfFromText(text)

      const blob = new Blob([bytes], { type: 'application/pdf' })
      setPdfBlob(blob)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to parse this Word document. Please ensure it is a valid .docx file.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDownload = () => {
    if (!pdfBlob) return
    const baseName = (file?.name || 'document').replace(/\.[^.]+$/, '')
    const safeName = sanitizeFilename(`${baseName}`, 'pdf')
    const success = downloadBlob(pdfBlob, safeName)
    if (success) {
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Word to PDF Converter',
    url: 'https://omnitasker.co.in/word-to-pdf',
    description: 'Convert Word (.docx) files to PDF online free. 100% private in-browser conversion with instant download.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Word to PDF Converter Free Online – Convert DOCX to PDF (No Upload, Instant)"
        description="Convert Word (.docx) files to PDF online free. Get a clean, print-ready A4 PDF from your Word document in seconds. No file upload, no registration, 100% private client-side processing."
        keywords="word to pdf converter, docx to pdf online free, convert word to pdf, word document to pdf, omnitasker word to pdf, docx to pdf without upload"
        canonicalPath="/word-to-pdf"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3))',
            }}
          >
            📑
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Word to PDF <span className="gradient-text">Converter</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Transform Microsoft Word (.docx) documents into clean, printable A4 PDF files
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Upload Word (.docx) File
            </h2>
            <FileUploader
              onFilesSelected={handleFiles}
              selectedFile={file}
              accept={{
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/msword': ['.doc'],
              }}
              maxFiles={1}
              label="Drop Word document here or browse"
              sublabel=".docx files up to 50MB"
            />

            {file && (
              <div className="p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 truncate max-w-[220px]">
                    📄 {file.name}
                  </span>
                  <span className="font-mono text-brand-400">{formatBytes(file.size)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Ready for instant PDF conversion</span>
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

        {/* Preview & Download Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between min-h-[480px] border border-white/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">
                    {file ? `${file.name.replace(/\.[^.]+$/, '')}.pdf Preview` : 'Generated PDF Document Preview'}
                  </span>
                </span>
                {pdfBlob && (
                  <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex-shrink-0">
                    {formatBytes(pdfBlob.size)}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <p className="text-xs">Converting Word document structures to PDF coordinates with Mammoth…</p>
                </div>
              ) : !pdfBlob ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                    📄
                  </div>
                  <p className="text-slate-300 font-semibold text-sm">Upload a Word document to generate PDF</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Outputs high-resolution vector PDF with crisp A4 typography
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 max-h-[320px] overflow-y-auto">
                    <h3 className="font-display font-bold text-slate-100 text-base">
                      {file?.name.replace(/\.[^.]+$/, '')}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {extractedText.slice(0, 1200)}
                      {extractedText.length > 1200 && '… [Full content formatted in final PDF]'}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ✓ Document rendered with standard 50pt margins, Helvetica typography, and word wrapping.
                  </p>
                </div>
              )}
            </div>

            {/* Separated Safe Download Zone Banner */}
            {pdfBlob && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <AdPlaceholder slot="downloadZone" />

                <Button
                  id="download-word-pdf-btn"
                  variant="accent"
                  onClick={handleDownload}
                  className="w-full justify-center py-3.5 font-bold shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>
                    {downloadSuccess ? '✓ PDF Saved to Downloads!' : 'Download Converted PDF File'}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Instructional Content */}
      <section className="mt-16 glass-card p-8 border border-white/10 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
          How to Convert Word to PDF Online for Free
        </h2>
        <p>
          Sharing documents in Microsoft Word (.docx) format often results in altered formatting, missing fonts, or unintended modifications when opened across different devices. Converting your files to the universal Portable Document Format (PDF) locks in visual layout across Windows, macOS, Android, and iOS.
        </p>
        <p>
          OmniTasker executes the conversion directly on your client machine, ensuring complete privacy for business contracts, resumes, academic essays, and invoices without software licenses or data logging.
        </p>
      </section>

      {/* FAQ Accordion */}
      <FaqSection
        items={WORD_TO_PDF_FAQS}
        title="Word to PDF Conversion FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}
