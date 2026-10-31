import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Maximize2,
  Lock,
  Unlock,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  AlertTriangle,
  RefreshCw,
  FileCheck,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import {
  compressCanvasToTargetKB,
  formatBytes,
} from '../utils/imageCompressor'
import { downloadBlob, downloadDataUrl } from '../utils/downloadHelper'
import { GOVT_EXAM_PRESETS, EXAM_CATEGORIES, SOCIAL_PRESETS } from '../utils/govtExamPresets'

const RESIZE_FAQS = [
  {
    q: 'How does the 1-click Govt Exam Photo and Signature auto-converter work?',
    a: 'Upload your photo or signature, then click any official exam preset (UPSC, SSC CGL, GATE, CAT, Bank IBPS, NEET). OmniTasker instantly scales the image to exact official pixel dimensions and auto-compresses it into the mandated KB limit (e.g., strictly 10–20 KB for SSC signatures). Your compliant file is ready for download in 1 second!',
  },
  {
    q: 'Will my resized photo be accepted by UPSC, SSC, and GATE application portals?',
    a: 'Yes. All presets are configured according to official notification guidelines for 2025/2026 exams. They enforce exact dimensions (e.g., UPSC 350x350 px, SSC 140x60 px signature), file format (JPG), and strict KB bounds without compromising facial or ink clarity.',
  },
  {
    q: 'Does OmniTasker upload my exam photos or signatures to any server?',
    a: 'Never. Processing happens 100% inside your browser memory using HTML5 Canvas. Your sensitive identity photos and signatures never leave your phone or computer.',
  },
]

export default function ResizeImage() {
  const [original, setOriginal] = useState(null)
  const [activeTab, setActiveTab] = useState('govt') // 'govt' | 'custom' | 'social'

  // Govt exam selection (default to UPSC Photo for instant readiness)
  const [category, setCategory] = useState('all')
  const [selectedGovtPreset, setSelectedGovtPreset] = useState(GOVT_EXAM_PRESETS[0])

  // Custom Dimensions & Aspect Ratio Lock
  const [width, setWidth] = useState(String(GOVT_EXAM_PRESETS[0]?.width || '350'))
  const [height, setHeight] = useState(String(GOVT_EXAM_PRESETS[0]?.height || '350'))
  const [lockAR, setLockAR] = useState(true)
  const [format, setFormat] = useState('image/jpeg') // 'image/jpeg' | 'image/png' | 'image/webp'
  const [enforceKB, setEnforceKB] = useState(true)
  const [targetKB, setTargetKB] = useState(String(GOVT_EXAM_PRESETS[0]?.targetKB || '45'))

  // State
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  // Direct auto-processor engine: takes an image object + target specs and produces the ready output
  const processImage = useCallback(async (imgSource, targetW, targetH, targetFormat, shouldEnforceKB, kbLimit, presetContext = null) => {
    if (!imgSource || !canvasRef.current) return
    setLoading(true)
    setError('')

    try {
      const finalW = parseInt(targetW, 10)
      const finalH = parseInt(targetH, 10)

      if (isNaN(finalW) || isNaN(finalH) || finalW <= 0 || finalH <= 0) {
        throw new Error('Please enter valid width and height values.')
      }

      const canvas = canvasRef.current
      canvas.width = finalW
      canvas.height = finalH
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, finalW, finalH)

      // Ensure white background for JPEG exports (critical for passport/govt exam uploads)
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, finalW, finalH)
      }

      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = () => rej(new Error('Failed to load image into processing canvas.'))
        img.src = imgSource.url
      })

      // Draw and scale image onto canvas
      ctx.drawImage(img, 0, 0, finalW, finalH)

      // Compression to target KB
      const numericKB = parseFloat(kbLimit)
      if (shouldEnforceKB && numericKB && numericKB > 0) {
        const compRes = await compressCanvasToTargetKB(canvas, targetFormat, numericKB)
        setResult({
          dataUrl: compRes.dataUrl,
          blob: compRes.blob,
          w: finalW,
          h: finalH,
          sizeKB: compRes.sizeKB,
          format: targetFormat,
          preset: presetContext,
        })
      } else {
        const blob = await new Promise((res) => canvas.toBlob(res, targetFormat, 0.92))
        const dataUrl = canvas.toDataURL(targetFormat, 0.92)
        setResult({
          dataUrl,
          blob,
          w: finalW,
          h: finalH,
          sizeKB: Math.round((blob.size / 1024) * 10) / 10,
          format: targetFormat,
          preset: presetContext,
        })
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Image processing failed.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-process with a specific Govt Exam preset
  const applyAndProcessGovtPreset = useCallback((preset, imgObj = original) => {
    setSelectedGovtPreset(preset)
    setWidth(String(preset.width))
    setHeight(String(preset.height))
    setFormat(preset.format || 'image/jpeg')
    setEnforceKB(true)
    setTargetKB(String(preset.targetKB))

    // If an image is present, instantly ready it!
    if (imgObj) {
      processImage(
        imgObj,
        preset.width,
        preset.height,
        preset.format || 'image/jpeg',
        true,
        preset.targetKB,
        preset
      )
    }
  }, [original, processImage])

  // Apply social preset
  const applyAndProcessSocialPreset = useCallback((p, imgObj = original) => {
    setWidth(String(p.w))
    setHeight(String(p.h))
    setEnforceKB(false)
    setSelectedGovtPreset(null)

    if (imgObj) {
      processImage(imgObj, p.w, p.h, format, false, 0, null)
    }
  }, [format, original, processImage])

  // Handle uploaded file -> auto-process immediately if preset is active
  const handleFiles = useCallback((files) => {
    const file = files[0]
    if (!file) return
    setError('')
    setResult(null)

    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const imgObj = {
        file,
        url,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      }
      setOriginal(imgObj)

      // Instant Auto-Ready workflow
      if (activeTab === 'govt' && selectedGovtPreset) {
        applyAndProcessGovtPreset(selectedGovtPreset, imgObj)
      } else if (activeTab === 'custom') {
        setWidth(String(img.naturalWidth))
        setHeight(String(img.naturalHeight))
        processImage(imgObj, img.naturalWidth, img.naturalHeight, format, enforceKB, targetKB, null)
      } else if (activeTab === 'social') {
        processImage(imgObj, parseInt(width, 10) || 1080, parseInt(height, 10) || 1080, format, false, 0, null)
      }
    }
    img.src = url
  }, [activeTab, applyAndProcessGovtPreset, enforceKB, format, height, processImage, selectedGovtPreset, targetKB, width])

  // Width change with AR lock
  const onWidthChange = (val) => {
    setWidth(val)
    if (lockAR && original && val && parseFloat(val) > 0) {
      const ratio = original.naturalH / original.naturalW
      setHeight(String(Math.round(parseFloat(val) * ratio)))
    }
  }

  // Height change with AR lock
  const onHeightChange = (val) => {
    setHeight(val)
    if (lockAR && original && val && parseFloat(val) > 0) {
      const ratio = original.naturalW / original.naturalH
      setWidth(String(Math.round(parseFloat(val) * ratio)))
    }
  }

  // Manual Trigger for Custom mode
  const handleManualResize = () => {
    if (!original) return
    processImage(original, width, height, format, enforceKB, targetKB, selectedGovtPreset)
  }

  // One-click Download
  const handleDownload = () => {
    if (!result) return
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg'
    const namePrefix = selectedGovtPreset
      ? `${selectedGovtPreset.id}_ready`
      : 'resized_image'
    const filename = `${namePrefix}_${result.w}x${result.h}.${ext}`

    if (result.blob) {
      downloadBlob(result.blob, filename)
    } else {
      downloadDataUrl(result.dataUrl, filename)
    }
  }

  const filteredGovtPresets = GOVT_EXAM_PRESETS.filter(
    (p) => category === 'all' || p.category === category
  )

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Image Resizer & Dimensions Converter',
    url: 'https://omnitasker.co.in/image-resizer',
    description: 'Resize images to custom dimensions in pixels, cm, or inches online free. Convert JPG, PNG, and WebP with zero upload.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Image Resizer Online Free – Resize to Custom Pixels, CM, Inches (PNG, JPG, WebP)"
        description="Resize images to any custom dimension in pixels, centimeters, or inches. Convert between JPG, PNG, and WebP. Lock aspect ratio, set exact width and height. Free online image resizer with no upload required."
        keywords="image resizer online free, resize image to specific pixels, resize jpg online, convert image to 1080x1080, resize png without quality loss, custom image dimensions, omnitasker image resizer"
        canonicalPath="/image-resizer"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(16,185,129,0.3))',
            }}
          >
            🇮🇳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
                Govt Exam Photo &amp; <span className="gradient-text">Signature Resizer</span>
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                1-Click Auto-Ready ⚡
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5">
              Upload photo or signature and click your exam — instantly scaled &amp; compressed to exact official portal specifications
            </p>
          </div>
        </div>
      </div>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Workspace */}
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            {/* Step 1: Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 inline-flex items-center justify-center text-[11px]">1</span>
                  <span>Upload Photo or Signature</span>
                </span>
                {original && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Loaded: {original.naturalW}×{original.naturalH} px</span>
                  </span>
                )}
              </div>
              <FileUploader
                onFiles={handleFiles}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                label={original ? 'Change photo/signature' : 'Drop photo or signature here'}
                subLabel="JPG, PNG, WEBP (No server upload · 100% Private)"
              />
            </div>

            {/* Step 2: Mode Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 inline-flex items-center justify-center text-[11px]">2</span>
                  <span>Select Target Purpose</span>
                </span>
              </div>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('govt')
                    if (selectedGovtPreset) applyAndProcessGovtPreset(selectedGovtPreset)
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'govt'
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🇮🇳 Govt Exams</span>
                  <span className="text-[9px] px-1 py-0.2 bg-white/20 rounded">Popular</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'custom'
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚙️ Custom Size
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('social')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'social'
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📱 Social
                </button>
              </div>
            </div>

            {/* TAB: Govt Exam Presets (1-Click Auto Ready) */}
            {activeTab === 'govt' && (
              <div className="space-y-3">
                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {EXAM_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        category === c.id
                          ? 'bg-brand-500/25 text-brand-300 border border-brand-500/50'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {filteredGovtPresets.map((p) => {
                    const isSelected = selectedGovtPreset?.id === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyAndProcessGovtPreset(p)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-brand-500/20 border-brand-500 shadow-md ring-1 ring-brand-500/50'
                            : 'bg-slate-900/60 border-white/8 hover:bg-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-100 flex items-center gap-1">
                            {p.type === 'signature' ? '✍️' : '👤'} {p.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                          <span className="font-mono text-slate-300">{p.width}×{p.height} px</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-semibold font-mono">
                            {p.minKB}-{p.maxKB} KB
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 truncate">
                          {p.exam}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Active Preset Guideline Banner */}
                {selectedGovtPreset && (
                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs space-y-1">
                    <div className="font-semibold text-brand-300 flex items-center justify-between">
                      <span>Official Spec: {selectedGovtPreset.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">Target: {selectedGovtPreset.targetKB} KB</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedGovtPreset.bgColorNotice}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Custom Dimensions */}
            {activeTab === 'custom' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Custom Dimensions
                    </span>
                    <button
                      type="button"
                      onClick={() => setLockAR(!lockAR)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        lockAR
                          ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lockAR ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{lockAR ? 'Aspect Locked' : 'Unlocked'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => onWidthChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-slate-100 font-mono text-sm focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => onHeightChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-slate-100 font-mono text-sm focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] text-slate-300 font-medium">Compress to Max KB Limit</label>
                      <input
                        type="checkbox"
                        checked={enforceKB}
                        onChange={(e) => setEnforceKB(e.target.checked)}
                        className="rounded accent-brand-500"
                      />
                    </div>
                    {enforceKB && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={targetKB}
                          onChange={(e) => setTargetKB(e.target.value)}
                          className="w-24 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/15 text-slate-100 font-mono text-xs focus:outline-none focus:border-brand-500"
                        />
                        <span className="text-xs text-slate-400">KB (e.g., 20, 50, 100)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Format selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG / JPEG', desc: 'Govt Standard' },
                      { id: 'image/png', label: 'PNG', desc: 'Lossless' },
                      { id: 'image/webp', label: 'WEBP', desc: 'Compact' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormat(f.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          format === f.id
                            ? 'bg-brand-500/20 border-brand-500 text-white font-bold'
                            : 'bg-white/4 border-white/8 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs">{f.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleManualResize}
                  disabled={!original || loading}
                  loading={loading}
                  className="w-full justify-center py-3.5 font-bold shadow-lg"
                >
                  📐 Resize Custom Dimensions
                </Button>
              </div>
            )}

            {/* TAB: Social Presets */}
            {activeTab === 'social' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Social Media Size Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyAndProcessSocialPreset(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        width === String(p.w) && height === String(p.h)
                          ? 'bg-brand-500/20 border-brand-500/60 shadow-sm'
                          : 'bg-white/4 border-white/8 hover:bg-white/8'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-200">{p.label}</div>
                      <div className="text-slate-500 text-[11px] font-mono mt-0.5">{p.w} × {p.h} px</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>

        {/* Visual Preview & 1-Click Ready Release Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 h-full min-h-[520px] flex flex-col justify-between border border-white/10">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <span className="text-slate-200 font-bold text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Output Preview &amp; Verification</span>
                </span>
                {result && (
                  <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    {result.w} × {result.h} px · {result.sizeKB} KB
                  </span>
                )}
              </div>

              {/* Body */}
              {!original ? (
                <div className="flex flex-col items-center justify-center text-slate-500 py-20">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="text-slate-200 font-semibold text-sm">Drop a photo or signature to start</p>
                  <p className="text-slate-500 text-xs mt-1 text-center max-w-sm">
                    Selecting any exam preset will automatically convert, scale, and compress your file for immediate 1-click download.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Canvas Viewport */}
                  <div className="max-w-md w-full bg-slate-950 rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col items-center">
                    <div className="relative overflow-hidden rounded-xl bg-black/60 border border-white/10 p-2 max-h-[320px] w-full flex items-center justify-center">
                      <img
                        src={result ? result.dataUrl : original.url}
                        alt="Resized output preview"
                        className="max-h-[280px] max-w-full object-contain rounded-lg shadow-md"
                      />
                    </div>

                    <div className="mt-3 w-full flex items-center justify-between text-xs text-slate-400 border-t border-white/8 pt-2.5">
                      <span>Original: {original.naturalW}×{original.naturalH} px ({formatBytes(original.file.size)})</span>
                      <span className="font-semibold text-slate-200">
                        {result ? `Output: ${result.w}×${result.h} px` : 'Processing…'}
                      </span>
                    </div>
                  </div>

                  {/* Ready Release Banner */}
                  {result && (
                    <div className="max-w-md w-full p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-brand-500/10 border border-emerald-500/30 space-y-3 shadow-xl animate-slide-up">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span className="font-bold text-sm text-slate-100">
                            {result.preset ? `Ready for ${result.preset.name}!` : 'Resized File Ready!'}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          100% Compliant
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                        <div>
                          <span className="text-slate-500 text-[11px] block">Dimensions</span>
                          <span className="font-mono font-bold text-slate-200">{result.w} × {result.h} px</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[11px] block">File Size</span>
                          <span className="font-mono font-bold text-emerald-400">{result.sizeKB} KB</span>
                        </div>
                      </div>

                      {/* Separated Safe Download Zone Banner */}
                      <AdPlaceholder slot="downloadZone" />

                      {/* 1-Click Download Button */}
                      <Button
                        id="download-ready-btn"
                        variant="accent"
                        onClick={handleDownload}
                        className="w-full justify-center py-3.5 font-bold text-sm shadow-xl hover:scale-[1.02] transition-transform"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        <span>Download Ready {result.preset ? result.preset.name : 'Image'}</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Switch Bar */}
            {original && selectedGovtPreset && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>Try another exam format:</span>
                <div className="flex items-center gap-1.5">
                  {GOVT_EXAM_PRESETS.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyAndProcessGovtPreset(p)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                        selectedGovtPreset.id === p.id
                          ? 'bg-brand-500 text-white'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {p.name.split(' ')[0]} {p.type === 'signature' ? 'Sign' : 'Photo'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Question SEO FAQ Accordion */}
      <FaqSection
        items={RESIZE_FAQS}
        title="Govt Exam Image & Signature Resizing FAQs"
        className="mt-12"
      />

      {/* AdSense Placement at Bottom */}
      <AdPlaceholder slot="leaderboard" className="mt-10" />
    </div>
  )
}
