import { useState, useMemo } from 'react'
import {
  Code2,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Minimize2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import {
  validateJson,
  formatJson,
  minifyJson,
  sortJsonKeys,
  getJsonStats,
} from '../utils/jsonFormatter'
import { downloadBlob } from '../utils/downloadHelper'
import { formatBytes } from '../utils/imageCompressor'

const JSON_FAQS = [
  {
    q: 'What is the difference between formatting and minifying JSON?',
    a: 'Formatting (beautifying) adds line breaks and indentation (typically 2 or 4 spaces) to make nested JSON objects easy for developers to read and debug. Minifying strips out all whitespace and newlines to produce the smallest possible byte payload for network transfers and storage.',
  },
  {
    q: 'How does real-time syntax error validation work?',
    a: 'OmniTasker uses native JavaScript AST parsing client-side. When a syntax mistake (such as an unclosed bracket, trailing comma, or unquoted key) occurs, the parser immediately computes the exact line number and column position where the issue was found.',
  },
  {
    q: 'Can I format sensitive API responses and auth tokens securely here?',
    a: 'Yes, 100%. All formatting and validation happens strictly in your browser runtime memory. No telemetry or JSON payloads are ever sent to external cloud servers, making it completely safe for production credentials and confidential payloads.',
  },
]

const SAMPLE_JSON = `{
  "toolName": "OmniTasker",
  "version": "2.4.0",
  "clientSide": true,
  "features": [
    "Image Resizer & Exam Optimizer",
    "Video Trimmer for Reels & Shorts",
    "Social Media Downloader",
    "Client-side PDF Merger",
    "QR Code Generator",
    "JSON Formatter & Validator"
  ],
  "stats": {
    "speed": "instant",
    "privacyRating": "100%"
  }
}`

export default function JsonFormatter() {
  const [rawInput, setRawInput] = useState('')
  const [formattedOutput, setFormattedOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [notification, setNotification] = useState(null)

  // Validation
  const validation = useMemo(() => validateJson(rawInput), [rawInput])
  const stats = useMemo(() => getJsonStats(rawInput || formattedOutput), [rawInput, formattedOutput])

  const showNotification = (msg, isErr = false) => {
    setNotification({ text: msg, isErr })
    setTimeout(() => setNotification(null), 3000)
  }

  // Format Action
  const handleFormat = () => {
    if (!rawInput.trim()) return
    try {
      const formatted = formatJson(rawInput, indent)
      setFormattedOutput(formatted)
      showNotification('Formatted successfully')
    } catch (err) {
      showNotification(err.message, true)
    }
  }

  // Minify Action
  const handleMinify = () => {
    if (!rawInput.trim()) return
    try {
      const minified = minifyJson(rawInput)
      setFormattedOutput(minified)
      showNotification('Minified successfully')
    } catch (err) {
      showNotification(err.message, true)
    }
  }

  // Sort Keys Action
  const handleSortKeys = () => {
    if (!rawInput.trim()) return
    try {
      const sorted = sortJsonKeys(rawInput, indent)
      setFormattedOutput(sorted)
      showNotification('Keys sorted alphabetically')
    } catch (err) {
      showNotification(err.message, true)
    }
  }

  // Copy to Clipboard
  const handleCopy = async () => {
    const textToCopy = formattedOutput || rawInput
    if (!textToCopy.trim()) return
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      showNotification('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showNotification('Failed to copy', true)
    }
  }

  // Download Output File
  const handleDownload = () => {
    const content = formattedOutput || rawInput
    if (!content.trim()) return
    const blob = new Blob([content], { type: 'application/json' })
    downloadBlob(blob, 'formatted_data.json')
  }

  const handleLoadSample = () => {
    setRawInput(SAMPLE_JSON)
    try {
      setFormattedOutput(formatJson(SAMPLE_JSON, indent))
    } catch {}
    showNotification('Sample JSON loaded')
  }

  const handleClear = () => {
    setRawInput('')
    setFormattedOutput('')
    showNotification('Cleared all panes')
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON Formatter & Validator',
    url: 'https://omnitasker.co.in/json-formatter',
    description: 'Format, validate, beautify, and minify JSON online for free. Dual-pane editor with instant syntax error detection.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="JSON Formatter & Validator Online Free – Beautify, Minify & Validate JSON"
        description="Format, validate, and inspect JSON online for free. Beautify minified JSON, minify large JSON, sort keys alphabetically, and detect syntax errors with line-accurate diagnostics. Dual-pane editor."
        keywords="json formatter online free, json beautifier, json validator, prettify json, minify json online, json editor, format json online, validate json syntax, omnitasker json formatter"
        canonicalPath="/json-formatter"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(16,185,129,0.3))',
            }}
          >
            {'{ }'}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              JSON Formatter <span className="gradient-text">&amp; Validator</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Dual-pane JSON workspace: Paste raw input on the left and inspect formatted output on the right
            </p>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="glass-card p-4 mb-6 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            id="json-format-btn"
            variant="primary"
            size="sm"
            onClick={handleFormat}
            disabled={!rawInput.trim() || !validation.valid}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>Format</span>
          </Button>
          <Button
            id="json-minify-btn"
            variant="secondary"
            size="sm"
            onClick={handleMinify}
            disabled={!rawInput.trim() || !validation.valid}
          >
            <Minimize2 className="w-3.5 h-3.5 mr-1" />
            <span>Minify</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSortKeys}
            disabled={!rawInput.trim() || !validation.valid}
          >
            <span>Sort Keys (A-Z)</span>
          </Button>

          {/* Indent Selector */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-slate-400">Spaces:</span>
            <select
              value={indent}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                setIndent(val)
                if (rawInput && validation.valid) {
                  try {
                    setFormattedOutput(formatJson(rawInput, val))
                  } catch {}
                }
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value={2} className="bg-slate-900">2 Spaces</option>
              <option value={4} className="bg-slate-900">4 Spaces</option>
              <option value={1} className="bg-slate-900">Compact</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium transition-all"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 text-xs text-slate-400 transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <Button
            id="json-copy-btn"
            variant="accent"
            size="sm"
            onClick={handleCopy}
            disabled={!rawInput.trim() && !formattedOutput.trim()}
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={!formattedOutput.trim() && !rawInput.trim()}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Save .json</span>
          </Button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 mb-4 animate-fade-in ${
            notification.isErr
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          {notification.isErr ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* DUAL-PANE LAYOUT */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* PANE 1 (LEFT): Input Raw JSON */}
        <div className="glass-card p-4 flex flex-col border border-white/10 min-h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              <span>1. Raw JSON Input</span>
            </span>

            {/* Error / Validation highlight badge */}
            {rawInput.trim() && (
              validation.valid ? (
                <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                  ✓ Valid JSON
                </span>
              ) : (
                <span className="badge bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  Error: Line {validation.error?.line}, Col {validation.error?.column}
                </span>
              )
            )}
          </div>

          <textarea
            id="raw-json-input"
            value={rawInput}
            onChange={(e) => {
              setRawInput(e.target.value)
              // Real-time auto-format if valid
              try {
                if (e.target.value.trim()) {
                  setFormattedOutput(formatJson(e.target.value, indent))
                } else {
                  setFormattedOutput('')
                }
              } catch {}
            }}
            placeholder="Paste raw unformatted JSON string here…"
            spellCheck={false}
            className="flex-1 w-full p-4 rounded-xl bg-slate-950/80 border border-white/8 text-slate-200 font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-brand-500 resize-none leading-relaxed min-h-[380px]"
          />

          {!validation.valid && validation.error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              <strong>Syntax Error:</strong> {validation.error.message}
            </div>
          )}
        </div>

        {/* PANE 2 (RIGHT): Formatted / Prettified Output */}
        <div className="glass-card p-4 flex flex-col border border-white/10 min-h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>2. Formatted &amp; Prettified Output</span>
            </span>

            {formattedOutput && (
              <span className="text-[11px] font-mono text-slate-400">
                {formattedOutput.split('\n').length} lines
              </span>
            )}
          </div>

          <textarea
            id="formatted-json-output"
            value={formattedOutput}
            readOnly
            placeholder="Formatted output will appear here automatically…"
            spellCheck={false}
            className="flex-1 w-full p-4 rounded-xl bg-slate-950/90 border border-white/8 text-emerald-300 font-mono text-xs placeholder-slate-600 focus:outline-none resize-none leading-relaxed min-h-[380px]"
          />
        </div>
      </div>

      {/* Download Zone Banner */}
      <AdPlaceholder slot="downloadZone" className="my-6" />

      {/* JSON Stats Footer */}
      {stats && (
        <div className="glass-card p-4 border border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span>
              Size: <strong className="text-slate-200 font-mono">{formatBytes(stats.sizeBytes)}</strong>
            </span>
            <span>
              Total Keys: <strong className="text-slate-200 font-mono">{stats.keys}</strong>
            </span>
            <span>
              Max Depth: <strong className="text-slate-200 font-mono">{stats.depth}</strong>
            </span>
            <span>
              Root Structure: <strong className="text-slate-200 font-mono">{stats.isArray ? 'Array []' : 'Object {}'}</strong>
            </span>
          </div>
          <span className="text-emerald-400 font-medium">100% Client-Side In-Memory Engine</span>
        </div>
      )}

      {/* 3-Question SEO FAQ Accordion */}
      <FaqSection
        items={JSON_FAQS}
        title="JSON Formatting & Validation FAQs"
        className="mt-12"
      />

      {/* AdSense Placement at Bottom */}
      <AdPlaceholder slot="leaderboard" className="mt-10" />
    </div>
  )
}
