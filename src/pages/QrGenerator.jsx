import { useState, useRef, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import {
  QrCode as QrIcon,
  Download,
  Copy,
  Check,
  Palette,
  Sliders,
  Sparkles,
} from 'lucide-react'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { downloadBlob } from '../utils/downloadHelper'

const QR_FAQS = [
  {
    q: 'How do I create a custom colored QR code with logo or high resolution?',
    a: 'Use our color pickers to select your custom foreground (dots) and background colors, or click any of the curated presets. Then select your desired output resolution (from 128px up to 1024px Ultra Print) and download instantly.',
  },
  {
    q: 'What is the difference between downloading PNG and SVG QR codes?',
    a: 'PNG is a raster bitmap format ideal for websites, social media, and digital display. SVG is a resolution-independent vector format that can be scaled infinitely without any blurriness or pixelation, making it perfect for billboards, posters, and print merchandise.',
  },
  {
    q: 'Do QR codes created on OmniTasker ever expire?',
    a: 'No. The QR codes generated are static barcodes that directly encode your text or URL within the matrix itself. They never expire and will work indefinitely without depending on any redirect service.',
  },
]

const COLOR_PALETTES = [
  { label: 'Classic Dark', fg: '#000000', bg: '#ffffff' },
  { label: 'Obsidian Minimal', fg: '#090a0f', bg: '#f8fafc' },
  { label: 'Vibrant Emerald', fg: '#047857', bg: '#ecfdf5' },
  { label: 'Indigo Brand', fg: '#4338ca', bg: '#eef2ff' },
  { label: 'Rose Accent', fg: '#be123c', bg: '#fff1f2' },
  { label: 'Cyber Neon', fg: '#10b981', bg: '#090a0f' },
]

const SIZE_PRESETS = [
  { label: 'Small (128 px)', size: 128 },
  { label: 'Standard (256 px)', size: 256 },
  { label: 'High-Res (384 px)', size: 384 },
  { label: 'Large (512 px)', size: 512 },
  { label: 'Ultra Print (1024 px)', size: 1024 },
]

export default function QrGenerator() {
  const [text, setText] = useState('https://omnitasker.co.in')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(256)
  const [errorCorrection, setErrorCorrection] = useState('M') // L, M, Q, H
  const [copied, setCopied] = useState(false)
  const [pngDataUrl, setPngDataUrl] = useState('')
  const [svgString, setSvgString] = useState('')

  const canvasRef = useRef(null)

  // Generate QR Code using the qrcode library
  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setPngDataUrl('')
      setSvgString('')
      return
    }

    try {
      // 1. Draw to canvas
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        })
      }

      // 2. Generate PNG Data URL
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      })
      setPngDataUrl(dataUrl)

      // 3. Generate SVG String
      const svg = await QRCode.toString(text, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      })
      setSvgString(svg)
    } catch (err) {
      console.error('QR code generation error:', err)
    }
  }, [text, fgColor, bgColor, size, errorCorrection])

  useEffect(() => {
    generateQR()
  }, [generateQR])

  // Download PNG
  const handleDownloadPng = async () => {
    if (!text.trim()) return
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorCorrection,
      })
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      downloadBlob(blob, `qrcode_${size}x${size}.png`)
    } catch (e) {
      console.error(e)
    }
  }

  // Download SVG
  const handleDownloadSvg = async () => {
    if (!text.trim()) return
    try {
      const svg = await QRCode.toString(text, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorCorrection,
      })
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      downloadBlob(blob, 'qrcode.svg')
    } catch (e) {
      console.error(e)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!canvasRef.current) return
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch (err) {
      console.error('Failed to copy QR code image', err)
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Custom QR Code Generator',
    url: 'https://omnitasker.co.in/qr-generator',
    description: 'Generate custom colored QR codes online for free. Download high-res PNG or vector SVG.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="QR Code Generator Free Online – Custom Color QR Codes (PNG & SVG Download)"
        description="Generate custom QR codes online for free. Create colored QR codes for website URLs, UPI payments, WiFi passwords, and more. Download as high-resolution PNG or vector SVG. No signup required."
        keywords="qr code generator free, custom qr code maker, colored qr code online, qr code for upi payment, wifi qr code generator, svg qr code download, omnitasker qr code"
        canonicalPath="/qr-generator"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.3))',
            }}
          >
            ⬛
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              QR Code Generator <span className="gradient-text">&amp; Customizer</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Generate custom high-resolution QR codes with custom colors and instant PNG/SVG vector downloads
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            {/* Live Text/URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Live URL or Text Content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL, WiFi, email, or any text to encode…"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Quick Color Palettes */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Color Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PALETTES.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setFgColor(p.fg)
                      setBgColor(p.bg)
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      fgColor === p.fg && bgColor === p.bg
                        ? 'border-brand-500 bg-white/10 shadow-sm'
                        : 'border-white/10 bg-white/4 hover:bg-white/8'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                      style={{ backgroundColor: p.fg }}
                    />
                    <span className="text-[11px] text-slate-200 truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Pickers: Foreground & Background */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/4 border border-white/10">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Size & Error Correction */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Size Resolution (px)
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs font-semibold focus:outline-none"
                >
                  {SIZE_PRESETS.map((s) => (
                    <option key={s.size} value={s.size} className="bg-slate-900">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Error Correction Level
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs font-semibold focus:outline-none"
                >
                  <option value="L" className="bg-slate-900">Low (7% recovery)</option>
                  <option value="M" className="bg-slate-900">Medium (15% recovery)</option>
                  <option value="Q" className="bg-slate-900">Quartile (25% recovery)</option>
                  <option value="H" className="bg-slate-900">High (30% recovery)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Download Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 flex flex-col items-center justify-between min-h-[460px] border border-white/10">
            <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-slate-300 font-semibold text-sm">Interactive QR Preview</span>
              <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                {size} × {size} px
              </span>
            </div>

            {/* QR Canvas Display */}
            <div
              className="p-6 rounded-2xl border border-white/15 shadow-2xl flex items-center justify-center my-auto transition-all"
              style={{ backgroundColor: bgColor }}
            >
              <canvas ref={canvasRef} className="max-w-[240px] max-h-[240px] rounded-lg" />
            </div>

            {/* Download and Copy Actions */}
            <div className="w-full space-y-2.5 pt-4">
              <AdPlaceholder slot="downloadZone" />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  id="download-qr-png-btn"
                  variant="primary"
                  onClick={handleDownloadPng}
                  disabled={!text.trim()}
                  className="w-full justify-center py-2.5 font-bold text-xs shadow-md"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download PNG ({size}px)</span>
                </Button>
                <Button
                  id="download-qr-svg-btn"
                  variant="secondary"
                  onClick={handleDownloadSvg}
                  disabled={!text.trim()}
                  className="w-full justify-center py-2.5 font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download SVG (Vector)</span>
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!text.trim()}
                className="w-full justify-center text-xs py-2"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy PNG to Clipboard'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Question SEO FAQ Accordion */}
      <FaqSection
        items={QR_FAQS}
        title="QR Code Generator FAQs"
        className="mt-12"
      />

      {/* AdSense Placement at Bottom */}
      <AdPlaceholder slot="leaderboard" className="mt-10" />
    </div>
  )
}
