import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import {
  SOCIAL_PLATFORMS,
  detectPlatform,
  resolveSocialContent,
} from '../utils/socialDownloader'
import { sanitizeUrl, sanitizeFilename } from '../utils/sanitize'
import { checkRateLimit } from '../utils/rateLimiter'

const SOCIAL_FAQS = [
  {
    q: 'Can I download Instagram Reels and TikTok videos without watermarks?',
    a: 'Yes! OmniTasker Social Downloader extracts direct high-definition MP4 streams without added platform logos or watermarks whenever available, preserving pristine visual quality.',
  },
  {
    q: 'Do I need to install any software or browser extensions?',
    a: 'No software, plugins, or extensions are needed. The downloader runs entirely in your modern web browser on desktop, iPhone, Android, and tablets.',
  },
  {
    q: 'Are my downloaded links and personal information tracked or saved?',
    a: 'Never. OmniTasker operates with a strict zero-data logging privacy policy. All link extraction and media buffers occur directly on the client side without storing your browsing data or content.',
  },
]

export default function SocialDownloader() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mediaData, setMediaData] = useState(null)
  const [downloadingFormat, setDownloadingFormat] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const videoRef = useRef(null)

  const currentPlatformId = detectPlatform(url)

  const handleFetch = async (targetUrl = url) => {
    const link = targetUrl.trim()
    if (!link) {
      setError('Please paste or enter a valid video URL')
      return
    }

    const { valid: urlValid, error: urlErr } = sanitizeUrl(link)
    if (!urlValid) {
      setError(urlErr)
      return
    }

    const rl = checkRateLimit('socialFetchUI', 15, 60_000)
    if (!rl.allowed) {
      setError(`Too many requests. Please wait ${rl.waitMs}s and try again.`)
      return
    }

    setError('')
    setLoading(true)
    setMediaData(null)
    setDownloadSuccess(false)

    try {
      const data = await resolveSocialContent(link)

      // Use local streaming proxy for playback if it's a remote cross-origin URL
      if (data?.videoUrl && data.videoUrl.startsWith('http')) {
        data.playbackUrl = `/api/stream?url=${encodeURIComponent(data.videoUrl)}`
      } else {
        data.playbackUrl = data?.videoUrl
      }

      setMediaData(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to fetch video from this link. Please check if the video is public.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
        handleFetch(text)
      }
    } catch {
      setError('Clipboard access denied. Please paste the link manually into the box.')
    }
  }

  const handleDownloadItem = async (qualityItem) => {
    if (!qualityItem?.url) return
    setDownloadingFormat(qualityItem.label)
    setDownloadSuccess(false)

    const platformPrefix = mediaData?.platform || 'social'
    const rawTitle = (mediaData?.title || 'video').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35)
    const cleanTitle = sanitizeFilename(rawTitle)
    const safeExt = qualityItem.ext || 'mp4'
    const filename = `${platformPrefix}_${cleanTitle}.${safeExt}`

    try {
      // Use the direct server proxy for 100% reliable file download
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(qualityItem.url)}&filename=${encodeURIComponent(filename)}`

      const a = document.createElement('a')
      a.href = proxyDownloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 5000)
    } catch (err) {
      console.error('Download error:', err)
      window.open(qualityItem.url, '_blank')
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1000)
    }
  }

  const handleSendToVideoTrimmer = () => {
    if (!mediaData?.videoUrl) return
    navigate('/video-trimmer', {
      state: {
        externalVideoUrl: mediaData.playbackUrl || mediaData.videoUrl,
        title: mediaData.title,
        aspectRatio: mediaData.aspectRatio || '9:16',
      },
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Video Downloader Online - Download Instagram Reels, YouTube Shorts & TikTok"
        description="Free online video downloader by OmniTasker. Download Instagram Reels, YouTube Shorts, TikTok videos without watermark, Twitter clips, and audio in full HD MP4/MP3."
        keywords="video downloader, instagram reels downloader, youtube shorts downloader, tiktok video saver no watermark, twitter video downloader online, omnitasker video downloader"
        canonicalPath="/video-downloader"
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(239,68,68,0.3))',
            }}
          >
            📥
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Social Media <span className="gradient-text">Downloader &amp; Saver</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Download real videos from TikTok (No Watermark), Instagram Reels, YouTube, and direct video links
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      {/* Main Input Card */}
      <div className="glass-card p-6 sm:p-8 space-y-6 mb-8 border border-brand-500/30">
        {/* Platform Selection Badges */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPlatform === 'all'
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            ⚡ All Platforms
          </button>
          {Object.values(SOCIAL_PLATFORMS).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPlatform(p.id)
                setUrl(p.sampleUrl)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedPlatform === p.id || currentPlatformId === p.id
                  ? 'bg-white/15 text-slate-100 border border-white/20 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Search / URL Box */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Paste Video Link (TikTok, Instagram Reel, YouTube, MP4)
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                placeholder="https://www.tiktok.com/@... or https://www.instagram.com/reel/..."
                className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-slate-900/90 border border-white/15 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
                {currentPlatformId && SOCIAL_PLATFORMS[currentPlatformId]
                  ? SOCIAL_PLATFORMS[currentPlatformId].icon
                  : '🔗'}
              </span>
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-medium transition-all"
              >
                📋 Paste
              </button>
            </div>

            <Button
              id="fetch-social-btn"
              onClick={() => handleFetch()}
              disabled={loading || !url.trim()}
              loading={loading}
              className="py-3.5 px-7 font-bold justify-center"
            >
              {loading ? 'Fetching Video…' : '🔍 Fetch Video'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Section: Playing & Displaying Video */}
      {mediaData && (
        <div className="grid lg:grid-cols-12 gap-8 mb-12 animate-slide-up">
          {/* Media Player Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-card p-5 border border-white/15 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <span>{mediaData.platformName}</span>
                  <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[10px]">
                    {mediaData.type.toUpperCase()}
                  </span>
                </span>
                {mediaData.duration && (
                  <span className="text-xs font-mono text-slate-400">⏱ {mediaData.duration}</span>
                )}
              </div>

              {/* Video Player */}
              {mediaData.videoUrl ? (
                <div
                  className={`relative rounded-2xl overflow-hidden bg-black border border-white/15 flex items-center justify-center ${
                    mediaData.aspectRatio === '9:16'
                      ? 'w-[260px] h-[460px]'
                      : 'w-full max-w-lg aspect-video'
                  }`}
                >
                  <video
                    key={mediaData.playbackUrl || mediaData.videoUrl}
                    ref={videoRef}
                    src={mediaData.playbackUrl || mediaData.videoUrl}
                    poster={mediaData.thumbnail}
                    controls
                    playsInline
                    loop
                    preload="auto"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : mediaData.thumbnail ? (
                <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/15 max-h-[460px] flex items-center justify-center p-2">
                  <img
                    src={mediaData.thumbnail}
                    alt={mediaData.title}
                    className="max-h-[440px] max-w-full object-contain rounded-xl shadow-lg"
                  />
                </div>
              ) : null}

              {/* Title & Author info */}
              <div className="w-full mt-4 text-left">
                <h3 className="font-semibold text-slate-100 text-base line-clamp-2">
                  {mediaData.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">Creator: {mediaData.author}</p>
                {mediaData.notice && (
                  <p className="text-amber-400 text-xs mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    ℹ️ {mediaData.notice}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Download Options Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-6 space-y-4 border border-accent-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="font-display font-bold text-slate-100 text-lg">
                  Available Download Formats
                </h2>
                <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                  ✓ Ready to Save
                </span>
              </div>

              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>Download initiated! Your video is being saved to your device.</span>
                </div>
              )}

              <AdPlaceholder slot="downloadZone" />

              <div className="space-y-2.5">
                {mediaData.qualities?.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{q.label}</div>
                      <div className="text-[11px] text-slate-500 uppercase mt-0.5 font-mono">
                        Format: {q.ext}
                      </div>
                    </div>
                    <Button
                      variant={idx === 0 ? 'accent' : 'secondary'}
                      size="sm"
                      onClick={() => handleDownloadItem(q)}
                      disabled={downloadingFormat === q.label}
                      className="px-4 py-2 text-xs font-semibold"
                    >
                      {downloadingFormat === q.label ? 'Saving…' : '⬇ Download'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Action: Open in Video Trimmer */}
              {mediaData.type === 'video' && mediaData.videoUrl && (
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleSendToVideoTrimmer}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-fuchsia-600/30 to-pink-600/30 border border-fuchsia-500/40 hover:from-fuchsia-600/40 hover:to-pink-600/40 flex items-center justify-between transition-all group"
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        <span>✂️</span>
                        <span>Edit &amp; Cut in Video Trimmer</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Trim start/end time, crop to 9:16 vertical Reel, or make Shorts
                      </div>
                    </div>
                    <span className="text-fuchsia-400 text-lg group-hover:translate-x-1 transition-transform">
                      ➔
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-3">
          <div className="text-2xl">🎵</div>
          <h3 className="font-display font-bold text-slate-200 text-sm">TikTok No-Watermark</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download high-definition TikTok videos with zero watermark or logos. Instant MP4 download ready for saving.
          </p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="text-2xl">📸</div>
          <h3 className="font-display font-bold text-slate-200 text-sm">Instagram Reels &amp; Stories</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Copy any public Instagram Reel or post link from the Instagram app or browser, paste it here, and save the original MP4.
          </p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="text-2xl">▶️</div>
          <h3 className="font-display font-bold text-slate-200 text-sm">YouTube &amp; Shorts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download high-resolution cover thumbnails, stream metadata, and direct video clips ready for editing in Video Trimmer.
          </p>
        </div>
      </div>

      <FaqSection
        items={SOCIAL_FAQS}
        title="Social Media Downloader FAQs"
        className="mt-12"
      />

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}
