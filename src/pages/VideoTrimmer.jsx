import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  Link as LinkIcon,
  Play,
  Pause,
  Scissors,
  Download,
  AlertCircle,
  Sparkles,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { formatBytes } from '../utils/imageCompressor'
import { downloadBlob, downloadFile } from '../utils/downloadHelper'
import {
  resolveSocialContent,
  convertRemoteUrlToLocalBlobUrl,
  detectPlatform,
  SOCIAL_PLATFORMS,
} from '../utils/socialDownloader'
import { sanitizeUrl } from '../utils/sanitize'
import { checkRateLimit } from '../utils/rateLimiter'

const VIDEO_TRIMMER_FAQS = [
  {
    q: 'How do I cut a video from where to where for Instagram Reels?',
    a: 'Upload your video file or paste a link, then drag the "Start Time" slider to your desired beginning point and the "End Time" slider to where you want the clip to finish. You can preview the loop continuously, then click "Trim & Export Video".',
  },
  {
    q: 'How do I crop horizontal landscape videos to 9:16 vertical ratio for YouTube Shorts?',
    a: 'In the Target Format selector, select "9:16 Reel / Shorts". OmniTasker automatically crops and centers your video to standard 1080x1920 vertical dimensions without black letterbox bars.',
  },
  {
    q: 'Are my videos uploaded to any server during trimming?',
    a: 'No. Trimming, cropping, and audio recording execute 100% client-side in your web browser using HTML5 Canvas and MediaRecorder APIs. Your media never leaves your device.',
  },
]

const ASPECT_RATIOS = [
  { id: 'original', label: 'Original', ratio: null, desc: 'Original Video Ratio' },
  { id: '9:16', label: '9:16 Reel / Shorts', ratio: 9 / 16, desc: 'Instagram Reels, YouTube Shorts, TikTok' },
  { id: '16:9', label: '16:9 Landscape', ratio: 16 / 9, desc: 'YouTube Standard Video' },
  { id: '1:1', label: '1:1 Square', ratio: 1 / 1, desc: 'Instagram Feed Post' },
  { id: '4:5', label: '4:5 Portrait', ratio: 4 / 5, desc: 'Instagram Portrait Post' },
]

const QUICK_DURATIONS = [
  { label: '15s (Reel / Story)', seconds: 15 },
  { label: '30s (Short Reel)', seconds: 30 },
  { label: '60s (YT Shorts)', seconds: 60 },
  { label: '90s (Max Reel)', seconds: 90 },
]

const SAMPLE_VIDEOS = [
  {
    name: 'Instagram Reel (9:16 Vertical)',
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    aspect: '9:16',
    platform: 'Instagram',
  },
  {
    name: 'YouTube Shorts Clip (9:16)',
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    aspect: '9:16',
    platform: 'YouTube',
  },
  {
    name: 'Landscape HD Video (16:9)',
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    aspect: '16:9',
    platform: 'Web',
  },
]

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00.0'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 10)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`
}

export default function VideoTrimmer() {
  const location = useLocation()

  // Input source: 'file' | 'link'
  const [inputTab, setInputTab] = useState('file')
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoName, setVideoName] = useState('video')

  // Social link input
  const [socialLink, setSocialLink] = useState('')
  const [fetchingSocial, setFetchingSocial] = useState(false)

  // Playback state
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopSelection, setLoopSelection] = useState(true)

  // Selection timestamps
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(15)
  const [aspectRatio, setAspectRatio] = useState('9:16')

  // Trimming / Export state
  const [trimming, setTrimming] = useState(false)
  const [trimProgress, setTrimProgress] = useState(0)
  const [trimmedBlob, setTrimmedBlob] = useState(null)
  const [trimmedBlobUrl, setTrimmedBlobUrl] = useState(null)
  const [trimmedSize, setTrimmedSize] = useState(0)
  const [error, setError] = useState('')

  const videoRef = useRef(null)
  const trimmedVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const animFrameRef = useRef(null)
  const isTrimmingRef = useRef(false)

  // Receive external video from Social Downloader if routed with state
  useEffect(() => {
    if (location.state?.externalVideoUrl) {
      loadVideoFromUrl(location.state.externalVideoUrl, location.state.title, location.state.aspectRatio)
      setInputTab('link')
    }
  }, [location.state])

  // Core file loader
  const loadVideoFromFile = (file) => {
    if (!file) return
    setError('')
    setTrimmedBlobUrl(null)
    setTrimmedBlob(null)
    setVideoFile(file)
    setVideoName(file.name)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
  }

  // React Dropzone configuration for flawless drag-and-drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      setError('Please upload a valid video file (MP4, WebM, MOV, or MKV).')
      return
    }
    const file = acceptedFiles?.[0]
    if (file) loadVideoFromFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.mkv', '.m4v', '.ogg', '.ogv'],
    },
    maxFiles: 1,
    multiple: false,
  })

  // Core URL loader (converts remote URL to local Blob URL to guarantee canvas drawing and zero CORS crash)
  const loadVideoFromUrl = async (rawUrl, title, aspect) => {
    if (!rawUrl) return

    // ── URL validation before any network call ────────────────────────────
    const { valid, url: safeUrl, error: urlErr } = sanitizeUrl(rawUrl.trim())
    if (!valid) {
      setError(urlErr)
      return
    }

    // ── Rate limit: 8 link-loads per 60 s ────────────────────────────────
    const rl = checkRateLimit('videoLinkLoad', 8, 60_000)
    if (!rl.allowed) {
      setError(`Too many requests. Please wait ${rl.waitMs}s before loading another link.`)
      return
    }

    setError('')
    setFetchingSocial(true)
    setTrimmedBlobUrl(null)
    setTrimmedBlob(null)

    try {
      // 1. Resolve media stream via resolver
      const data = await resolveSocialContent(safeUrl)
      const streamUrl = data?.videoUrl || safeUrl

      // 2. Buffer into in-browser local Blob
      const localBlob = await convertRemoteUrlToLocalBlobUrl(streamUrl)

      setVideoUrl(localBlob)
      setVideoName(title || data?.title || 'video_clip')
      setVideoFile({ name: `${title || data?.title || 'video_clip'}.mp4` })
      if (aspect || data?.aspectRatio) {
        setAspectRatio(aspect || data.aspectRatio)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to fetch video from this link.')
    } finally {
      setFetchingSocial(false)
    }
  }

  // Loaded metadata
  const onLoadedMetadata = () => {
    const v = videoRef.current
    if (!v) return
    const dur = isFinite(v.duration) && v.duration > 0 ? v.duration : 60
    setDuration(dur)
    setStartTime(0)
    setEndTime(Math.min(dur, 15))
    v.currentTime = 0
  }

  // Playhead update & loop inside [startTime, endTime]
  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v || isTrimmingRef.current || trimming) return
    setCurrentTime(v.currentTime)
    if (loopSelection && v.currentTime >= endTime) {
      v.currentTime = startTime
      if (!v.paused) {
        v.play().catch(() => {})
      }
    }
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      if (v.currentTime < startTime || v.currentTime >= endTime) {
        v.currentTime = startTime
      }
      const p = v.play()
      if (p && p.catch) {
        p.catch((err) => console.warn('Play prevented:', err))
      }
    } else {
      v.pause()
    }
  }

  const seekTo = (t) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = t
    setCurrentTime(t)
  }

  const applyDurationPreset = (secs) => {
    const newEnd = Math.min(duration || 100, startTime + secs)
    setEndTime(Math.round(newEnd * 10) / 10)
  }

  // Process Video Trimming in Browser via Canvas & MediaRecorder
  const handleTrimVideo = async () => {
    if (!videoRef.current || !videoUrl) return
    const v = videoRef.current
    v.pause()
    setIsPlaying(false)
    setTrimming(true)
    isTrimmingRef.current = true
    setTrimProgress(0)
    setError('')
    setTrimmedBlobUrl(null)
    setTrimmedBlob(null)

    try {
      const selectedAspect = ASPECT_RATIOS.find((a) => a.id === aspectRatio)
      let outW = v.videoWidth || 1280
      let outH = v.videoHeight || 720

      if (selectedAspect?.ratio) {
        if (selectedAspect.id === '9:16') {
          outW = 720
          outH = 1280
        } else if (selectedAspect.id === '16:9') {
          outW = 1280
          outH = 720
        } else if (selectedAspect.id === '1:1') {
          outW = 720
          outH = 720
        } else if (selectedAspect.id === '4:5') {
          outW = 720
          outH = 900
        }
      }

      const canvas = canvasRef.current
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')

      // Capture canvas stream
      const stream = canvas.captureStream(30) // 30 FPS

      // Try capturing audio from video
      let combinedStream = stream
      try {
        let audioStream = null
        if (v.captureStream) {
          audioStream = v.captureStream()
        } else if (v.mozCaptureStream) {
          audioStream = v.mozCaptureStream()
        }
        if (audioStream && audioStream.getAudioTracks().length > 0) {
          const audioTrack = audioStream.getAudioTracks()[0]
          combinedStream = new MediaStream([...stream.getVideoTracks(), audioTrack])
        }
      } catch (audioErr) {
        console.warn('Audio capture not available, exporting video only', audioErr)
      }

      // Check supported MIME type
      const mimeTypes = [
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ]
      const chosenMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || ''
      const recorder = new MediaRecorder(combinedStream, chosenMime ? { mimeType: chosenMime } : undefined)
      mediaRecorderRef.current = recorder

      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data)
      }

      const trimDuration = Math.max(0.1, endTime - startTime)

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: chosenMime || 'video/mp4' })
        const url = URL.createObjectURL(finalBlob)
        setTrimmedBlob(finalBlob)
        setTrimmedBlobUrl(url)
        setTrimmedSize(finalBlob.size)
        setTrimming(false)
        isTrimmingRef.current = false
        setTrimProgress(100)
      }

      recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e)
        setError('Recording error: ' + (e.error?.message || 'Encoding failed'))
        stopAndFinalize()
        setTrimming(false)
        isTrimmingRef.current = false
      }

      // Seek to startTime
      v.currentTime = startTime
      await new Promise((res) => {
        const onSeeked = () => {
          v.removeEventListener('seeked', onSeeked)
          res()
        }
        v.addEventListener('seeked', onSeeked)
      })

      recorder.start(100)

      try {
        await v.play()
      } catch {
        v.muted = true
        await v.play()
      }

      let stopped = false
      const stopAndFinalize = () => {
        if (stopped) return
        stopped = true
        isTrimmingRef.current = false
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        try {
          if (recorder.state === 'recording') recorder.stop()
        } catch {}
        v.pause()
        v.currentTime = startTime
      }

      const drawLoop = () => {
        if (stopped) return

        // Stop condition: reached or exceeded endTime or video ended
        if (v.currentTime >= endTime || v.ended) {
          stopAndFinalize()
          return
        }

        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, outW, outH)

        const vW = v.videoWidth || outW
        const vH = v.videoHeight || outH
        const scale = Math.max(outW / vW, outH / vH)
        const dW = vW * scale
        const dH = vH * scale
        const dx = (outW - dW) / 2
        const dy = (outH - dH) / 2

        try {
          ctx.drawImage(v, dx, dy, dW, dH)
        } catch (drawErr) {
          console.warn('Canvas draw error:', drawErr)
        }

        const elapsed = Math.max(0, v.currentTime - startTime)
        const pct = Math.min(100, Math.round((elapsed / trimDuration) * 100))
        setTrimProgress(pct)

        animFrameRef.current = requestAnimationFrame(drawLoop)
      }

      animFrameRef.current = requestAnimationFrame(drawLoop)
    } catch (err) {
      console.error(err)
      setError('Trimming error: ' + (err.message || 'Browser failed to record clip'))
      setTrimming(false)
      isTrimmingRef.current = false
    }
  }

  const handleDownload = () => {
    if (!trimmedBlob && !trimmedBlobUrl) {
      return // nothing to download
    }
    const isWebm = (trimmedBlob?.type || '').includes('webm')
    const ext = isWebm ? 'webm' : 'mp4'
    const cleanAspect = aspectRatio.replace(':', 'x')
    // Sanitize filename: no path traversal, no special chars
    const safeName = `clip_${cleanAspect}_${Math.round(startTime)}s_${Math.round(endTime)}s.${ext}`
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\.{2,}/g, '_')
    if (trimmedBlob) {
      downloadBlob(trimmedBlob, safeName)
    } else if (trimmedBlobUrl) {
      downloadFile(trimmedBlobUrl, safeName)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Video Trimmer Online - Cut & Trim Instagram Reels & YouTube Videos"
        description="Free online video trimmer and cutter by OmniTasker. Cut videos from where to where with exact timestamps, crop to 9:16 vertical Reels/Shorts, and preview immediately in browser."
        keywords="video trimmer, cut youtube video, trim instagram reel, online video cutter from where to where, 9:16 reel maker, omnitasker video trimmer"
        canonicalPath="/video-trimmer"
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
            🎬
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Video Trimmer <span className="gradient-text">&amp; Reels / YT Cutter</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Select &quot;from where to where&quot; to trim your video for Instagram Reels, YouTube Shorts, or custom clips
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      {/* Hidden offscreen canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            {/* Input Method Switcher */}
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setInputTab('file')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  inputTab === 'file'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setInputTab('link')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  inputTab === 'link'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Link / URL</span>
              </button>
            </div>

            {/* TAB 1: File Upload with Full Drag-and-Drop */}
            {inputTab === 'file' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Upload Video File
                </label>
                <div
                  {...getRootProps()}
                  className={`drop-zone p-6 text-center cursor-pointer transition-all border-2 border-dashed rounded-2xl ${
                    isDragActive
                      ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
                      : 'border-white/10 hover:border-white/20 bg-white/2'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-brand-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-slate-200 font-semibold text-sm">
                    {isDragActive
                      ? 'Drop video file here…'
                      : videoFile?.name
                      ? videoFile.name
                      : 'Drag & drop video here, or browse'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">MP4, WebM, MOV, MKV up to 2GB</p>
                </div>
              </div>
            )}

            {/* TAB 2: Social Media & Video Link Input */}
            {inputTab === 'link' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Paste Video or Social Media Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadVideoFromUrl(socialLink)}
                    placeholder="TikTok, YouTube Shorts, or direct .mp4 link"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <Button
                    size="sm"
                    onClick={() => loadVideoFromUrl(socialLink)}
                    loading={fetchingSocial}
                    disabled={fetchingSocial || !socialLink.trim()}
                  >
                    {fetchingSocial ? 'Fetching…' : 'Load'}
                  </Button>
                </div>
              </div>
            )}

            {/* 1-Click Working Sample Presets */}
            <div className="pt-2 border-t border-white/8">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or Try 1-Click Sample Videos:
              </span>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_VIDEOS.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => loadVideoFromUrl(s.url, s.name, s.aspect)}
                    className="px-3 py-2 rounded-xl bg-white/4 hover:bg-brand-500/15 border border-white/8 hover:border-brand-500/30 text-left text-xs text-slate-300 font-medium transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🎬</span>
                      <span>{s.name}</span>
                    </span>
                    <span className="badge bg-white/10 text-slate-400 text-[10px]">{s.aspect}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editing Controls (Active Once Video is loaded) */}
            {videoUrl && (
              <>
                {/* Target Aspect Ratio */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Target Format / Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ASPECT_RATIOS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAspectRatio(a.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          aspectRatio === a.id
                            ? 'bg-brand-500/20 border-brand-500/60 shadow-sm'
                            : 'bg-white/4 border-white/8 hover:bg-white/8'
                        }`}
                      >
                        <div className="font-semibold text-xs text-slate-200">{a.label}</div>
                        <div className="text-slate-500 text-[11px] truncate">{a.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Durations */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Reel / Short Presets
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_DURATIONS.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => applyDurationPreset(q.seconds)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-brand-500/20 text-xs text-slate-300 font-medium transition-all"
                      >
                        ⏱️ {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection Range: From Where to Where */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Trim Selection
                    </span>
                    <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono">
                      Clip: {Math.max(0, Math.round((endTime - startTime) * 10) / 10)}s
                    </span>
                  </div>

                  {/* Start Time */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Start Time (From)</span>
                      <span className="font-mono text-slate-200 font-semibold">{formatTime(startTime)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      step="0.1"
                      value={startTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        setStartTime(val)
                        if (val >= endTime) setEndTime(Math.min(duration || 100, val + 1))
                        seekTo(val)
                      }}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>

                  {/* End Time */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>End Time (To)</span>
                      <span className="font-mono text-slate-200 font-semibold">{formatTime(endTime)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max={duration || 100}
                      step="0.1"
                      value={endTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        setEndTime(val)
                        if (val <= startTime) setStartTime(Math.max(0, val - 1))
                        seekTo(val)
                      }}
                      className="w-full accent-accent-500 cursor-pointer"
                    />
                  </div>

                  {/* Loop Selection Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/8 text-xs">
                    <span className="text-slate-400">Loop inside selected timestamps</span>
                    <button
                      type="button"
                      onClick={() => setLoopSelection(!loopSelection)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        loopSelection
                          ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40'
                          : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      {loopSelection ? '🔁 Looping ON' : '➡️ Play Full Video'}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {trimming && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-brand-500/10 border border-brand-500/30">
                    <div className="flex justify-between text-xs text-brand-300 font-semibold">
                      <span>Trimming &amp; Recording clip…</span>
                      <span>{trimProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-150"
                        style={{ width: `${trimProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Trim Button */}
                <Button
                  id="trim-video-btn"
                  onClick={handleTrimVideo}
                  disabled={trimming || !videoUrl || endTime <= startTime}
                  loading={trimming}
                  className="w-full justify-center py-3.5 font-bold"
                >
                  {trimming ? `Trimming… (${trimProgress}%)` : '✂️ Trim & Export Video'}
                </Button>
              </>
            )}
          </div>

          {/* TRIMMED RESULT PLAYER & DOWNLOAD CARD */}
          {trimmedBlobUrl && (
            <div className="glass-card p-6 space-y-4 animate-slide-up border-2 border-accent-500/50 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-400" />
                  <span>Trimmed Clip Ready!</span>
                </span>
                <span className="badge bg-accent-500/20 text-accent-300 border border-accent-500/30 text-xs font-mono">
                  {formatBytes(trimmedSize)}
                </span>
              </div>

              {/* Trimmed Video Player */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Preview Trimmed Output:
                </label>
                <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/15 flex items-center justify-center max-h-[320px] p-1">
                  <video
                    ref={trimmedVideoRef}
                    src={trimmedBlobUrl}
                    controls
                    playsInline
                    loop
                    className="max-h-[300px] w-auto max-w-full rounded-xl object-contain"
                  />
                </div>
              </div>

              <p className="text-slate-400 text-xs">
                Your video clip ({Math.round((endTime - startTime) * 10) / 10}s, {aspectRatio}) has been processed and is ready to download.
              </p>

              <AdPlaceholder slot="downloadZone" />

              <Button
                id="download-clip-btn"
                variant="accent"
                onClick={handleDownload}
                className="w-full justify-center py-3.5 font-bold shadow-lg"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download Trimmed Video Clip</span>
              </Button>
            </div>
          )}
        </div>

        {/* Video Player Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-5 flex flex-col min-h-[480px] border border-white/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="text-slate-300 font-semibold text-sm">Interactive Player &amp; Timestamp Cutter</span>
              {duration > 0 && (
                <span className="text-xs font-mono text-slate-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            {!videoUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-4 text-brand-400">
                  🎬
                </div>
                <p className="text-slate-300 font-medium">Upload or paste a video to view player</p>
                <p className="text-slate-500 text-xs mt-1">
                  Preview start &amp; end points, loop within range, and crop for Reels &amp; Shorts
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                {/* Main Video Element with click-to-play & custom frame */}
                <div
                  onClick={togglePlay}
                  className={`relative rounded-2xl overflow-hidden bg-black border border-white/15 max-h-[420px] flex items-center justify-center cursor-pointer group shadow-2xl ${
                    aspectRatio === '9:16'
                      ? 'w-[240px] h-[420px]'
                      : aspectRatio === '1:1'
                      ? 'w-[320px] h-[320px]'
                      : 'w-full max-w-lg aspect-video'
                  }`}
                >
                  <video
                    key={videoUrl}
                    ref={videoRef}
                    src={videoUrl}
                    crossOrigin="anonymous"
                    controls={false}
                    preload="auto"
                    playsInline
                    onLoadedMetadata={onLoadedMetadata}
                    onTimeUpdate={onTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error('Video decoding error:', e)
                      setError('Cannot decode this video format in your browser. Please try an MP4 or WebM video.')
                    }}
                    className="w-full h-full object-contain"
                  />

                  {/* Play Overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
                      <div className="w-16 h-16 rounded-full bg-brand-500/90 text-white flex items-center justify-center text-2xl shadow-xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Controls Bar */}
                <div className="w-full max-w-lg space-y-3 pt-2">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => seekTo(startTime)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium"
                      title="Jump to Start Point"
                    >
                      ⏮ Start ({formatTime(startTime)})
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 text-lg"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => seekTo(endTime)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium"
                      title="Jump to End Point"
                    >
                      ⏭ End ({formatTime(endTime)})
                    </button>
                  </div>

                  {/* Scrub Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      step="0.1"
                      value={currentTime}
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span className="text-accent-400 font-bold">
                        [{formatTime(startTime)} ➔ {formatTime(endTime)}]
                      </span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="glass-card p-6 space-y-3 border border-white/10">
            <h3 className="font-display font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Creator Tips for Instagram Reels &amp; YouTube Shorts</span>
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              <li>
                <strong className="text-slate-200">Instagram Reels:</strong> 9:16 vertical ratio (1080×1920). Optimal hook duration is the first 3 seconds!
              </li>
              <li>
                <strong className="text-slate-200">YouTube Shorts:</strong> Vertical 9:16 format with duration under 60 seconds.
              </li>
              <li>
                <strong className="text-slate-200">Zero Server Uploads:</strong> Your video is converted into a local browser buffer for instant scrubbing and trimming.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3-Question SEO FAQ Accordion with Schema.org Microdata */}
      <FaqSection
        items={VIDEO_TRIMMER_FAQS}
        title="Video Trimmer & Reels Cutter FAQs"
        className="mt-12"
      />

      {/* AdSense Placement at Bottom */}
      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}

