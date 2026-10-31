import { useState, useCallback } from 'react'
import { Sliders, Download, CheckCircle, RefreshCw, Image as ImageIcon } from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { compressImage, formatBytes } from '../utils/imageCompressor'
import { downloadBlob } from '../utils/downloadHelper'

const COMPRESS_FAQS = [
  {
    q: 'How do I compress PNG and JPG images online without losing quality?',
    a: 'OmniTasker uses advanced lossy and lossless quantization via browser-image-compression. Setting the quality slider between 70% and 80% typically reduces file size by 60% to 80% with zero visible degradation on retina screens and mobile displays.',
  },
  {
    q: 'What is the maximum file size limit for image compression?',
    a: 'Because compression is processed entirely in your browser using your local device memory, you can compress photos and graphics up to 50MB with no queue, no speed throttling, and no upload delays.',
  },
  {
    q: 'Are my uploaded photos or graphics saved on any server?',
    a: 'Never. All processing happens 100% client-side in your browser. Your images are never transmitted over the internet or saved to remote databases, making OmniTasker fully compliant for sensitive documents and personal photos.',
  },
]

const QUICK_KB_PRESETS = [
  { label: 'Under 20 KB (SSC / Sign)', quality: 0.2, maxSizeMB: 0.02 },
  { label: 'Under 50 KB (IBPS / Photo)', quality: 0.4, maxSizeMB: 0.05 },
  { label: 'Under 100 KB (Exam Target)', quality: 0.6, maxSizeMB: 0.1 },
  { label: 'Under 500 KB (Web Optimized)', quality: 0.75, maxSizeMB: 0.5 },
  { label: 'Under 1 MB (High Quality)', quality: 0.85, maxSizeMB: 1.0 },
]

export default function CompressImage() {
  const [original, setOriginal] = useState(null)
  const [quality, setQuality] = useState(0.8)
  const [maxSizeMB, setMaxSizeMB] = useState(1.0)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

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
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleCompress = async () => {
    if (!original?.file) return
    setLoading(true)
    setError('')
    setProgress(0)

    try {
      const res = await compressImage(original.file, {
        quality,
        maxSizeMB,
        onProgress: setProgress,
      })
      setResult(res)
    } catch (e) {
      console.error(e)
      setError(e.message ?? 'Compression failed. Please try a different quality or size limit.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result?.blob) return
    const nameParts = original.file.name.split('.')
    const ext = nameParts.pop()
    const baseName = nameParts.join('.')
    downloadBlob(result.blob, `${baseName}_compressed.${ext}`)
  }

  const applyPreset = (preset) => {
    setQuality(preset.quality)
    setMaxSizeMB(preset.maxSizeMB)
    setResult(null)
  }

  const saving = result
    ? Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))
    : null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Image Compressor & KB Reducer',
    url: 'https://omnitasker.co.in/compress-image',
    description: 'Compress PNG, JPG, and WebP images to 20KB, 50KB, 100KB online for free. 100% private in-browser compression.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Image Compressor Online Free – Compress PNG, JPG, WebP Under 20KB 50KB 100KB"
        description="Compress images online for free to any KB target. Reduce PNG, JPG, and WebP file size under 20KB, 50KB, 100KB, or 200KB without losing quality. Perfect for government portals, email attachments, and web uploads."
        keywords="image compressor online free, compress png to 20kb, reduce jpg file size, compress image under 50kb, compress photo for government portal, tinypng alternative free, compress webp online, omnitasker image compressor"
        canonicalPath="/compress-image"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.3))' }}
          >
            🗜️
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Image Compressor <span className="gradient-text">&amp; KB/MB Reducer</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Compress PNG, JPG, and WEBP files with exact target quality and size constraints client-side
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-6 border border-white/10">
            {/* File Uploader supporting PNG, JPG, WEBP */}
            <FileUploader
              onFiles={handleFiles}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              label="Drop image here or click to browse"
              subLabel="Supports PNG, JPG, WEBP up to 50MB"
            />

            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Size Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_KB_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="p-2.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 hover:border-brand-500/30 text-left transition-all"
                  >
                    <div className="text-xs font-semibold text-slate-200">{p.label.split(' ')[0]} {p.label.split(' ')[1]}</div>
                    <div className="text-[11px] text-slate-500 truncate">{p.label.replace(/^Under \d+ (?:KB|MB) /, '')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Target Quality */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Target Quality</span>
                <span className="font-mono text-brand-400 font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => {
                  setQuality(parseFloat(e.target.value))
                  setResult(null)
                }}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Maximum compression (smaller file)</span>
                <span>Best quality</span>
              </div>
            </div>

            {/* Slider 2: Max Size in MB */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Max File Size Limit</span>
                <span className="font-mono text-emerald-400 font-bold">{maxSizeMB} MB</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="5"
                step="0.05"
                value={maxSizeMB}
                onChange={(e) => {
                  setMaxSizeMB(parseFloat(e.target.value))
                  setResult(null)
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0.02 MB (20 KB)</span>
                <span>5.0 MB</span>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-300 text-xs">
                ⚠️ {error}
              </div>
            )}

            <Button
              id="compress-btn"
              onClick={handleCompress}
              disabled={!original || loading}
              loading={loading}
              className="w-full justify-center py-3.5 font-bold shadow-lg"
            >
              {loading ? `Compressing… ${progress}%` : '🗜️ Compress Image'}
            </Button>
          </div>

          {/* Results Card */}
          {result && (
            <div className="glass-card p-6 space-y-4 animate-slide-up border-2 border-emerald-500/40 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Compression Summary</span>
                </h3>
                <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                  {saving}% Saved
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Original Size:</span>
                  <span className="font-mono text-slate-300 font-medium">{formatBytes(result.originalSize)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Compressed Size:</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatBytes(result.compressedSize)}</span>
                </div>
              </div>

              <AdPlaceholder slot="downloadZone" />

              <Button
                id="download-compressed-btn"
                variant="accent"
                onClick={handleDownload}
                className="w-full justify-center py-3.5 font-bold shadow-md"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download Compressed Image</span>
              </Button>
            </div>
          )}
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7">
          <div className="glass-card p-5 h-full min-h-[480px] flex flex-col border border-white/10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-slate-300 font-semibold text-sm">Visual Preview</span>
              {original && (
                <span className="text-xs text-slate-400 font-mono">
                  {result ? 'Side-by-side comparison' : 'Original file ready'}
                </span>
              )}
            </div>

            {!original ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-slate-300 font-medium text-sm">Upload an image to see comparison</p>
                <p className="text-slate-500 text-xs mt-1">PNG, JPG, or WEBP</p>
              </div>
            ) : (
              <div className="flex-1 grid md:grid-cols-2 gap-4 items-center">
                {/* Original Preview */}
                <div className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-white/8 h-full flex flex-col">
                  <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span className="font-semibold text-slate-300">Original</span>
                    <span className="font-mono">{formatBytes(original.file.size)}</span>
                  </div>
                  <div className="flex-1 relative rounded-xl overflow-hidden bg-black/40 flex items-center justify-center min-h-[260px] p-2">
                    <img
                      src={original.dataUrl}
                      alt="Original"
                      className="max-h-[240px] max-w-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* Compressed Preview */}
                <div className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-white/8 h-full flex flex-col">
                  <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span className="font-semibold text-emerald-400">Compressed Result</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {result ? formatBytes(result.compressedSize) : 'Pending…'}
                    </span>
                  </div>
                  <div className="flex-1 relative rounded-xl overflow-hidden bg-black/40 flex items-center justify-center min-h-[260px] p-2">
                    {result ? (
                      <img
                        src={result.objectUrl || result.dataUrl}
                        alt="Compressed"
                        className="max-h-[240px] max-w-full object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="text-center text-slate-600 text-xs">
                        {loading ? `Compressing (${progress}%)…` : 'Adjust sliders & click Compress Image'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Question SEO FAQ Accordion */}
      <FaqSection
        items={COMPRESS_FAQS}
        title="Image Compression FAQs"
        className="mt-12"
      />

      {/* AdSense Placement at Bottom */}
      <AdPlaceholder slot="leaderboard" className="mt-10" />
    </div>
  )
}
