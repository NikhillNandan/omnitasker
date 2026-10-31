import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Scissors,
  Download,
  Pipette,
  Sparkles,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sliders,
  CheckCircle,
} from 'lucide-react'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import {
  detectBackgroundColor,
  removeBackground,
} from '../utils/backgroundRemover'
import { downloadBlob } from '../utils/downloadHelper'
import { formatBytes } from '../utils/imageCompressor'
import { sanitizeFilename } from '../utils/sanitize'

const BG_FAQS = [
  {
    q: 'How does the client-side background remover isolate objects without server uploads?',
    a: 'OmniTasker analyzes high-frequency pixel color deltas across 3D RGB color space using HTML5 Canvas directly in your browser. It detects background color gradients, applies Euclidean distance thresholding, and feathery anti-aliasing without uploading your private images to any cloud server.',
  },
  {
    q: 'Can I replace the transparent background with official white or passport blue?',
    a: 'Yes! After removing the original background, you can switch between 100% transparent PNG, solid studio white (#FFFFFF), official passport sky blue (#60A5FA), or any custom color from the palette selector.',
  },
  {
    q: 'How do I pick a specific background color to remove?',
    a: 'Click the "Eyedropper" button, then click directly on any pixel in the image preview to sample that exact color as the target background. You can then fine-tune the tolerance slider to achieve a clean cut.',
  },
]

export default function BackgroundRemover() {
  const [original, setOriginal] = useState(null)
  const [tolerance, setTolerance] = useState(25)
  const [feather, setFeather] = useState(2)
  const [targetColor, setTargetColor] = useState({ r: 255, g: 255, b: 255 })
  const [replaceBg, setReplaceBg] = useState('transparent') // 'transparent' | '#ffffff' | '#60a5fa' | '#0f172a'
  const [eyedropperActive, setEyedropperActive] = useState(false)

  // Output
  const [resultBlob, setResultBlob] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [resultSize, setResultSize] = useState(0)
  const [processing, setProcessing] = useState(false)

  const originalCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const file = files[0]
    if (!file) return

    setResultUrl(null)
    setResultBlob(null)

    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginal({
        file,
        img,
        name: file.name,
        width: img.width,
        height: img.height,
        size: file.size,
      })

      // Setup original canvas
      const oc = originalCanvasRef.current
      if (oc) {
        oc.width = img.width
        oc.height = img.height
        const ctx = oc.getContext('2d')
        ctx.drawImage(img, 0, 0)

        // Auto-detect background color
        const autoBg = detectBackgroundColor(ctx, img.width, img.height)
        setTargetColor(autoBg)
      }
    }
    img.src = objectUrl
  }, [])

  // Process removal whenever options change
  const runRemoval = useCallback(() => {
    if (!original || !originalCanvasRef.current || !previewCanvasRef.current) return
    setProcessing(true)

    // Redraw original to source canvas
    const oc = originalCanvasRef.current
    const pc = previewCanvasRef.current
    pc.width = original.width
    pc.height = original.height

    const oCtx = oc.getContext('2d')
    oCtx.clearRect(0, 0, original.width, original.height)
    oCtx.drawImage(original.img, 0, 0)

    const processedData = removeBackground(oc, {
      targetColor,
      tolerance,
      feather,
      replaceBg,
    })

    const pCtx = pc.getContext('2d')
    pCtx.clearRect(0, 0, original.width, original.height)
    pCtx.putImageData(processedData, 0, 0)

    const isPng = replaceBg === 'transparent'
    const mime = isPng ? 'image/png' : 'image/jpeg'

    pc.toBlob((blob) => {
      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        const url = URL.createObjectURL(blob)
        setResultBlob(blob)
        setResultUrl(url)
        setResultSize(blob.size)
      }
      setProcessing(false)
    }, mime, 0.92)
  }, [original, targetColor, tolerance, feather, replaceBg])

  useEffect(() => {
    if (original) {
      runRemoval()
    }
  }, [original, targetColor, tolerance, feather, replaceBg, runRemoval])

  // Handle Eyedropper click
  const handleCanvasClick = (e) => {
    if (!eyedropperActive || !originalCanvasRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const scaleX = original.width / rect.width
    const scaleY = original.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)

    const ctx = originalCanvasRef.current.getContext('2d')
    const pixel = ctx.getImageData(x, y, 1, 1).data
    setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] })
    setEyedropperActive(false)
  }

  const handleDownload = () => {
    if (!resultBlob) return
    const ext = replaceBg === 'transparent' ? 'png' : 'jpg'
    const baseName = (original?.name || 'image').replace(/\.[^.]+$/, '')
    const safeName = sanitizeFilename(`${baseName}_nobg`, ext)
    downloadBlob(resultBlob, safeName)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Background Remover Online Free',
    url: 'https://omnitasker.co.in/background-remover',
    description: 'Remove background from images online free. Create transparent PNG cutouts instantly in your browser.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Background Remover Online Free – Remove Image Background Instantly (Transparent PNG)"
        description="Remove image background online for free. Get transparent PNG cutouts for logos, products, and passport photos. Replace background with white, transparent, or custom color. 100% in-browser, no upload."
        keywords="background remover online free, remove image background, transparent background png, erase background from photo, passport photo white background, remove bg free alternative, omnitasker background remover"
        canonicalPath="/background-remover"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(168,85,247,0.3))',
            }}
          >
            ✂️
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Background <span className="gradient-text">Remover &amp; Cutout</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              100% Client-side background removal with instant transparent PNG download
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      {/* Hidden processing canvas */}
      <canvas ref={originalCanvasRef} className="hidden" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            {/* Upload Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Upload Photo, Logo or Graphic
              </label>
              <FileUploader
                onFilesSelected={handleFiles}
                selectedFile={original?.file}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                maxFiles={1}
                label="Drop image here or browse"
                sublabel="PNG, JPG, or WebP up to 30MB"
              />
            </div>

            {original && (
              <div className="space-y-5 pt-2 border-t border-white/10 animate-fade-in">
                {/* Target Background Color Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Target Color to Erase
                    </span>
                    <button
                      type="button"
                      onClick={() => setEyedropperActive(!eyedropperActive)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                        eyedropperActive
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Pipette className="w-3 h-3" />
                      <span>{eyedropperActive ? 'Click on preview…' : 'Pick from image'}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8">
                    <div
                      className="w-8 h-8 rounded-lg border border-white/20 shadow-sm"
                      style={{
                        backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
                      }}
                    />
                    <div className="text-xs font-mono text-slate-300">
                      RGB({targetColor.r}, {targetColor.g}, {targetColor.b})
                    </div>
                  </div>
                </div>

                {/* Color Tolerance Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Tolerance (Threshold)</span>
                    <span className="font-mono text-brand-400 font-bold">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Higher values erase wider shades of the background color
                  </span>
                </div>

                {/* Edge Feathering Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Edge Softness (Feather)</span>
                    <span className="font-mono text-emerald-400 font-bold">{feather} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={feather}
                    onChange={(e) => setFeather(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Smooths rough cutouts and avoids pixelated borders
                  </span>
                </div>

                {/* Replacement Background Selection */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                    Output Background
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setReplaceBg('transparent')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        replaceBg === 'transparent'
                          ? 'bg-brand-500/20 border-brand-500 text-white font-semibold'
                          : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                      }`}
                    >
                      🏁 Transparent
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplaceBg('#ffffff')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        replaceBg === '#ffffff'
                          ? 'bg-brand-500/20 border-brand-500 text-white font-semibold'
                          : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⬜ White
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplaceBg('#60a5fa')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        replaceBg === '#60a5fa'
                          ? 'bg-brand-500/20 border-brand-500 text-white font-semibold'
                          : 'bg-white/4 border-white/8 text-slate-400 hover:text-white'
                      }`}
                    >
                      🟦 Sky Blue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview & Download Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between min-h-[500px] border border-white/10">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-400" />
                  <span>Interactive Cutout Preview</span>
                </span>
                {resultSize > 0 && (
                  <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
                    {formatBytes(resultSize)}
                  </span>
                )}
              </div>

              {!original ? (
                <div className="flex flex-col items-center justify-center text-center py-24 text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3 text-slate-400">
                    🖼️
                  </div>
                  <p className="text-slate-300 font-semibold text-sm">Upload an image to start background removal</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Isolate products, logos, stamps, and profile photos in seconds
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Checkerboard Preview Canvas */}
                  <div
                    onClick={handleCanvasClick}
                    className={`w-full rounded-2xl border border-white/15 p-4 flex items-center justify-center min-h-[320px] max-h-[460px] overflow-hidden ${
                      eyedropperActive ? 'cursor-crosshair ring-2 ring-brand-500' : ''
                    }`}
                    style={{
                      backgroundImage:
                        replaceBg === 'transparent'
                          ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
                          : 'none',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      backgroundColor: replaceBg === 'transparent' ? '#0f172a' : replaceBg,
                    }}
                  >
                    <canvas
                      ref={previewCanvasRef}
                      className="max-h-[380px] max-w-full rounded-lg shadow-2xl object-contain"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    {eyedropperActive
                      ? '🎯 Eyedropper mode active: click anywhere on the image above to set target background color.'
                      : 'Preview renders real-time transparency against dark checkerboard background.'}
                  </p>
                </div>
              )}
            </div>

            {/* Separated Safe Download Zone Banner */}
            {resultBlob && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <AdPlaceholder slot="downloadZone" />

                <Button
                  id="download-nobg-btn"
                  variant="accent"
                  onClick={handleDownload}
                  className="w-full justify-center py-3.5 font-bold shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>
                    Download {replaceBg === 'transparent' ? 'Transparent PNG' : 'Processed Image'}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructional Content */}
      <section className="mt-16 glass-card p-8 border border-white/10 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
          How to Remove Image Backgrounds Online for Free (100% In-Browser)
        </h2>
        <p>
          Whether creating clean eCommerce product photos, preparing transparent company logos for pitch decks, or generating candidate portraits with crisp white backgrounds, traditional background removal services require expensive subscriptions or upload your private photos to remote servers.
        </p>
        <p>
          OmniTasker’s client-side background removal engine works completely inside your modern web browser using HTML5 Canvas pixel arrays. It samples ambient background color vectors, calculates color Euclidean distances, and feathers object outlines for clean, professional results.
        </p>
      </section>

      {/* FAQ Accordion */}
      <FaqSection
        items={BG_FAQS}
        title="Background Remover FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}

