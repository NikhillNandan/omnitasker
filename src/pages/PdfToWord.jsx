import { useState, useCallback } from 'react'
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  FileCode,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { extractTextFromPdf } from '../utils/pdfTextExtractor'
import { createDocxFromText } from '../utils/docxBuilder'
import { downloadBlob } from '../utils/downloadHelper'
import { formatBytes } from '../utils/imageCompressor'
import { sanitizeFilename } from '../utils/sanitize'

const PDF_TO_WORD_FAQS = [
  {
    q: 'How does the PDF to Word converter work without sending files to an external server?',
    a: 'OmniTasker parses and decodes the internal text and formatting streams of your PDF document directly inside your browser memory using Mozilla PDF.js. It extracts paragraphs, structural headings, and line wraps, then packages them into an official OpenXML (.docx) Word file ready for Microsoft Word and Google Docs.',
  },
  {
    q: 'Can I edit the extracted text before downloading the Word document?',
    a: 'Yes! Our interactive dual-pane interface presents the extracted document text in an editable preview box where you can review, modify, or append notes before triggering your .docx download.',
  },
  {
    q: 'Is converting sensitive legal or financial PDFs on OmniTasker safe?',
    a: '100% safe. Because processing runs entirely client-side on your device hardware, zero bytes are uploaded to remote databases or third-party cloud servers.',
  },
]

export default function PdfToWord() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [docxBlob, setDocxBlob] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleFiles = useCallback(async (files) => {
    const f = files[0]
    if (!f) return

    setFile(f)
    setError('')
    setExtractedText('')
    setDocxBlob(null)
    setDownloadSuccess(false)
    setLoading(true)

    try {
      const text = await extractTextFromPdf(f)
      setExtractedText(text)

      // Auto-generate docx
      const docx = await createDocxFromText(text)
      setDocxBlob(docx)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to parse text from this PDF. Please ensure the document is not password-protected.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleTextChange = async (e) => {
    const val = e.target.value
    setExtractedText(val)
    if (file) {
      try {
        const docx = await createDocxFromText(val)
        setDocxBlob(docx)
      } catch (err) {
        console.error('Docx regeneration error:', err)
      }
    }
  }

  const handleCopy = async () => {
    if (!extractedText) return
    try {
      await navigator.clipboard.writeText(extractedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleDownload = async () => {
    const baseName = (file?.name || 'document').replace(/\.[^.]+$/, '')
    const safeName = sanitizeFilename(`${baseName}_converted`, 'docx')

    let targetBlob = docxBlob
    if (!targetBlob && extractedText) {
      try {
        targetBlob = await createDocxFromText(extractedText)
        setDocxBlob(targetBlob)
      } catch (e) {
        console.error(e)
      }
    }

    if (!targetBlob) return
    const success = downloadBlob(targetBlob, safeName)
    if (success) {
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PDF to Word Converter',
    url: 'https://omnitasker.co.in/pdf-to-word',
    description: 'Convert PDF to Word (.docx) online free. Extract text, headings, and formatting into an editable Microsoft Word document. 100% client-side, zero upload.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="PDF to Word Converter Online Free – Convert PDF to Editable .docx (No Upload)"
        description="Convert PDF to Word (.docx) online for free. Extract text and headings from any PDF into an editable Microsoft Word document. 100% client-side — your file never leaves your browser. Works with UPSC, SSC, and legal PDFs."
        keywords="pdf to word converter, convert pdf to docx online free, pdf to word free, pdf to editable word, extract text from pdf, omnitasker pdf to word, best pdf to word converter"
        canonicalPath="/pdf-to-word"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))',
            }}
          >
            📄
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              PDF to Word <span className="gradient-text">Converter</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Extract clean text and generate editable Microsoft Word (.docx) documents in seconds
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload & Options Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Upload PDF File
            </h2>
            <FileUploader
              onFilesSelected={handleFiles}
              selectedFile={file}
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={1}
              label="Drop PDF file here or browse"
              sublabel="Standard PDF documents up to 50MB"
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
                  <span>Ready for conversion to Word (.docx)</span>
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

        {/* Text Preview & Download Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between min-h-[480px] border border-white/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2 truncate">
                  <FileCode className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="truncate">
                    {file ? `${file.name.replace(/\.[^.]+$/, '')}.docx Preview` : 'Editable Document Text Preview'}
                  </span>
                </span>
                {extractedText && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                  <p className="text-xs">Extracting readable text and document structure with PDF.js…</p>
                </div>
              ) : !extractedText ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                    📝
                  </div>
                  <p className="text-slate-300 font-semibold text-sm">Upload a PDF to view and edit extracted text</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Your content stays 100% private in browser memory
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={extractedText}
                    onChange={handleTextChange}
                    rows={12}
                    className="w-full p-4 rounded-xl bg-slate-900/90 border border-white/15 text-slate-100 font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-brand-500 resize-none font-mono"
                    placeholder="Extracted document text will appear here..."
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>You can edit or add notes above before exporting</span>
                    <span>{extractedText.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              )}
            </div>

            {/* Separated Safe Download Zone Banner */}
            {docxBlob && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <AdPlaceholder slot="downloadZone" />

                <Button
                  id="download-docx-btn"
                  variant="accent"
                  onClick={handleDownload}
                  className="w-full justify-center py-3.5 font-bold shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>
                    {downloadSuccess ? '✓ DOCX Saved to Downloads!' : 'Download Editable Word Document (.docx)'}
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
          How to Convert PDF to Editable Word (.docx) Online Without Software
        </h2>
        <p>
          Converting read-only PDF files into editable Microsoft Word (.docx) documents traditionally required commercial software installations or uploading confidential files to third-party conversion servers. OmniTasker delivers a faster, safer, and 100% browser-based alternative.
        </p>
        <p>
          Our client-side conversion engine parses PDF text objects with Mozilla PDF.js, decodes font metrics, and structures paragraphs into official OpenXML schemas. Once generated, your .docx file opens natively in Microsoft Word, Google Docs, Apple Pages, and LibreOffice.
        </p>
      </section>

      {/* FAQ Accordion */}
      <FaqSection
        items={PDF_TO_WORD_FAQS}
        title="PDF to Word Conversion FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}
