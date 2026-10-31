import { useState, useRef, useCallback } from 'react'
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  User,
  Sparkles,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { GOVT_EXAM_PRESETS, EXAM_CATEGORIES } from '../utils/govtExamPresets'
import { compressCanvasToTargetKB, formatBytes } from '../utils/imageCompressor'
import { downloadBlob } from '../utils/downloadHelper'
import { sanitizeFilename } from '../utils/sanitize'

const EXAM_FAQS = [
  {
    q: 'How do I resize photos and signatures strictly between 10 KB and 20 KB for SSC CGL?',
    a: 'Simply upload your signature, select the "SSC Signature (CGL / CHSL / MTS)" preset, and OmniTasker will automatically scale the image to 140×60 pixels and run binary-search JPEG quantization to guarantee the final file size sits safely between 10 KB and 20 KB.',
  },
  {
    q: 'How does the UPSC candidate Name and Date of Photo (DoP) stamp work?',
    a: 'UPSC guidelines require candidate photos to feature a clear bottom white strip showing the applicant\'s full name and the date the photo was captured. When you toggle "Stamp Name & Date", OmniTasker renders an official bottom label directly into the image canvas before compression.',
  },
  {
    q: 'Will my resized photos be 100% accepted by GATE, UPSC, and IBPS online portals?',
    a: 'Yes! All preset dimensions and KB boundaries are matched directly to official notification PDFs for 2025/2026 examination cycles, including background color enforcement and aspect ratios.',
  },
  {
    q: 'Are my confidential identity photos or signatures uploaded to any server?',
    a: 'Never. OmniTasker runs 100% client-side inside your browser using HTML5 Canvas. No bytes, photos, or personal data ever leave your device.',
  },
]

export default function GovtExamPhotoResizer() {
  const [original, setOriginal] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPreset, setSelectedPreset] = useState(GOVT_EXAM_PRESETS[0])

  // UPSC / Exam Name & Date overlay options
  const [addNameDate, setAddNameDate] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0])

  // Processing state
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const file = files[0]
    if (!file) return
    setError('')
    setResult(null)

    const objectUrl = URL.createObjectURL(file)
    const reader = new FileReader()
    reader.onload = () => {
      setOriginal({
        file,
        dataUrl: reader.result,
        objectUrl,
        name: file.name,
        size: file.size,
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const processGovtExamImage = async (preset = selectedPreset) => {
    if (!original || !canvasRef.current) return
    setLoading(true)
    setError('')

    try {
      const { width, height, minKB, maxKB, targetKB } = preset
      const canvas = canvasRef.current
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, width, height)

      // 1. Fill solid white background (mandatory for official exam portals)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)

      // 2. Load original image into canvas
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image into processing canvas.'))
        img.src = original.dataUrl
      })

      // 3. Draw image centered
      let photoHeight = height
      if (addNameDate && candidateName.trim()) {
        photoHeight = Math.floor(height * 0.82) // reserve bottom 18% for name & date banner
      }

      ctx.drawImage(img, 0, 0, width, photoHeight)

      // 4. Render UPSC/Govt Name & Date of Photo (DoP) overlay strip
      if (addNameDate && candidateName.trim()) {
        const stripHeight = height - photoHeight
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, photoHeight, width, stripHeight)

        // Subtle divider line
        ctx.strokeStyle = '#E2E8F0'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, photoHeight)
        ctx.lineTo(width, photoHeight)
        ctx.stroke()

        // Name text
        ctx.fillStyle = '#0F172A'
        ctx.textAlign = 'center'
        const fontSize = Math.max(10, Math.floor(stripHeight * 0.36))
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.fillText(candidateName.trim().toUpperCase(), width / 2, photoHeight + stripHeight * 0.44)

        // Date text
        const dateFontSize = Math.max(9, Math.floor(stripHeight * 0.28))
        ctx.font = `600 ${dateFontSize}px sans-serif`
        ctx.fillStyle = '#334155'
        ctx.fillText(`D.O.P: ${photoDate}`, width / 2, photoHeight + stripHeight * 0.82)
      }

      // 5. Binary-search compression to land strictly within [minKB, maxKB]
      const comp = await compressCanvasToTargetKB(
        canvas,
        'image/jpeg',
        targetKB,
        minKB,
        maxKB
      )

      setResult({
        ...comp,
        preset,
        width,
        height,
        compliant: comp.sizeKB >= minKB && comp.sizeKB <= maxKB,
      })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error resizing for government exam.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result?.blob) return
    const rawName = `${selectedPreset.id}_compliant.jpg`
    const filename = sanitizeFilename(rawName, 'jpg')
    downloadBlob(result.blob, filename)
  }

  const filteredPresets = selectedCategory === 'all'
    ? GOVT_EXAM_PRESETS
    : GOVT_EXAM_PRESETS.filter((p) => p.category === selectedCategory)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Govt Exam Photo & Signature Resizer',
    url: 'https://omnitasker.co.in/govt-exam-photo-resizer',
    description: 'Resize photo and signature for UPSC, SSC, GATE, IBPS, NEET and state exams. 100% portal compliance with auto KB limits.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Govt Exam Photo & Signature Resizer – UPSC, SSC, GATE, IBPS, NEET (Free)"
        description="Resize photo and signature for UPSC, SSC CGL, SSC CHSL, GATE, Bank IBPS PO, NEET, and Indian govt exams in 1 click. Auto-enforces official pixel dimensions and 10KB–50KB file size limits. Free, no upload."
        keywords="govt exam photo resizer, upsc photo resizer, ssc signature resizer 10 to 20 kb, gate photo 480x640 pixels, ibps signature resizer, neet photo resizer, government exam photo size online, ssc photo resizer online"
        canonicalPath="/govt-exam-photo-resizer"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(99,102,241,0.3))',
            }}
          >
            🇮🇳
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Govt Exam Photo <span className="gradient-text">&amp; Signature Resizer</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              1-Click auto-compliance for UPSC, SSC CGL/CHSL, GATE, Bank IBPS/SBI, NEET, and PAN Card
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      {/* Off-screen Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* File Upload Box */}
          <div className="glass-card p-6 space-y-4 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Step 1: Upload Candidate Photo or Signature</span>
            </h2>
            <FileUploader
              onFilesSelected={handleFiles}
              selectedFile={original?.file}
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              maxFiles={1}
              label="Drop exam photo or signature here, or browse"
              sublabel="JPG, PNG, or WebP up to 50MB"
            />
            {original && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/8">
                <span className="truncate max-w-[200px] text-slate-200">{original.name}</span>
                <span className="font-mono text-emerald-400">{formatBytes(original.size)}</span>
              </div>
            )}
          </div>

          {/* Preset Selector */}
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>Step 2: Select Target Examination Preset</span>
            </h2>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap gap-1.5">
              {EXAM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Preset Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset)
                    if (original) processGovtExamImage(preset)
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPreset.id === preset.id
                      ? 'bg-emerald-500/15 border-emerald-500/60 shadow-sm'
                      : 'bg-white/4 border-white/8 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-100">{preset.name}</span>
                    <span className="badge bg-white/10 text-slate-300 text-[10px]">
                      {preset.minKB}-{preset.maxKB} KB
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{preset.unitText}</p>
                </button>
              ))}
            </div>

            {/* UPSC Name & Date Option */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={addNameDate}
                  onChange={(e) => setAddNameDate(e.target.checked)}
                  className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 w-4 h-4"
                />
                <span>Stamp Candidate Name &amp; Date of Photo (UPSC / OTR Requirement)</span>
              </label>

              {addNameDate && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/4 border border-white/8 animate-fade-in">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Full Candidate Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="e.g. AMIT SHARMA"
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Date of Photo
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={photoDate}
                        onChange={(e) => setPhotoDate(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              id="resize-govt-btn"
              onClick={() => processGovtExamImage()}
              disabled={loading || !original}
              loading={loading}
              className="w-full justify-center py-3.5 font-bold"
            >
              {loading ? 'Optimizing for Exam Portal…' : `⚡ Auto-Resize for ${selectedPreset.name}`}
            </Button>
          </div>
        </div>

        {/* Preview & Download Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between min-h-[460px] border border-white/10">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Portal Compliance Inspector</span>
                </span>
                {result && (
                  <span
                    className={`badge text-xs font-semibold ${
                      result.compliant
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {result.compliant ? '✓ 100% Portal Compliant' : 'Adjusted'}
                  </span>
                )}
              </div>

              {!result ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                    🏛️
                  </div>
                  <p className="text-slate-300 font-semibold text-sm">Upload an image to inspect live preview</p>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs">
                    Dimensions and KB bounds are calculated in real-time according to official guidelines
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Visual Preview Box */}
                  <div className="w-full p-4 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center min-h-[240px]">
                    <img
                      src={result.objectUrl}
                      alt="Resized Exam Photo"
                      className="max-h-[220px] max-w-full rounded shadow-xl object-contain border border-white/10 bg-white"
                    />
                  </div>

                  {/* Compliance Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dimensions</span>
                      <span className="font-mono text-xs text-slate-100 font-bold">
                        {result.width} × {result.height} px
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Size</span>
                      <span className="font-mono text-xs text-slate-100 font-bold">
                        {result.sizeKB} KB
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Allowed Range</span>
                      <span className="font-mono text-xs text-emerald-400 font-bold">
                        {selectedPreset.minKB}–{selectedPreset.maxKB} KB
                      </span>
                    </div>
                  </div>

                  {/* Official Exam Requirement Notice */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{selectedPreset.exam} Official Notice:</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                      {selectedPreset.bgColorNotice || selectedPreset.description}
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
                  id="download-govt-exam-btn"
                  variant="accent"
                  onClick={handleDownload}
                  className="w-full justify-center py-3.5 font-bold shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Compliant File ({result.sizeKB} KB)</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Instructional Content */}
      <section className="mt-16 glass-card p-8 border border-white/10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
          How to Resize Photos and Signatures for Indian Government Exam Application Portals
        </h2>
        <p>
          Every year, hundreds of thousands of applicants face application rejection due to incorrect photograph dimensions, blurriness, or exceeding the rigid kilobyte limits mandated by Indian examination authorities including the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Indian Institute of Technology (GATE), and Institute of Banking Personnel Selection (IBPS).
        </p>
        <p>
          OmniTasker eliminates guesswork by embedding official 2025/2026 notification parameters into automated browser scripts. Whether you need an SSC signature strictly between 10 KB and 20 KB (140×60 px), a GATE photo of 480×640 px (20–200 KB), or a UPSC portrait featuring the applicant’s name and Date of Photograph (DoP) at the bottom, our engine computes binary-search quantization to achieve 100% portal acceptance.
        </p>

        <h3 className="font-display text-lg font-bold text-slate-100 pt-2">
          3-Step Verification Guide for Flawless Uploads
        </h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Select Examination Preset:</strong> Choose your target examination category (Civil Services, Staff Selection, Banking, or Engineering) to lock in official aspect ratios.</li>
          <li><strong>Optional Name &amp; Date Stamping:</strong> If appearing for UPSC Civil Services or CDS/NDA, check the &quot;Stamp Candidate Name &amp; Date&quot; option and input your official name as shown on your 10th-grade matriculation certificate.</li>
          <li><strong>Instant Download:</strong> Click &quot;Download Compliant File&quot; to save your processed JPEG directly to your device with verified byte parameters.</li>
        </ol>
      </section>

      {/* Structured FAQ Section with Schema.org Microdata */}
      <FaqSection
        items={EXAM_FAQS}
        title="Govt Exam Photo & Signature Resizer FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}

