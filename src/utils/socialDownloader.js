/**
 * Robust Social Media & Video Resolution Engine
 * Handles TikTok (no watermark), Instagram, YouTube, and direct video links.
 */

import { checkRateLimit } from './rateLimiter'
import { sanitizeUrl } from './sanitize'

export const SOCIAL_PLATFORMS = {
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'from-cyan-400 to-pink-500',
    sampleUrl: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: 'from-red-600 to-rose-600',
    sampleUrl: 'https://youtube.com/shorts/50_49-uB_X8',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: 'from-pink-500 via-purple-500 to-amber-500',
    sampleUrl: 'https://www.instagram.com/reel/C8_sample_reel/',
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '𝕏',
    color: 'from-slate-700 to-slate-900',
    sampleUrl: 'https://x.com/sports/status/1789012345678901234',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    color: 'from-blue-600 to-indigo-700',
    sampleUrl: 'https://www.facebook.com/reel/1234567890',
  },
}

export function detectPlatform(url) {
  if (!url) return null
  const clean = url.trim().toLowerCase()

  if (clean.includes('tiktok.com')) return 'tiktok'
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube'
  if (clean.includes('instagram.com') || clean.includes('instagr.am')) return 'instagram'
  if (clean.includes('twitter.com') || clean.includes('x.com')) return 'twitter'
  if (clean.includes('facebook.com') || clean.includes('fb.watch')) return 'facebook'
  if (/\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(clean) || clean.includes('/video/')) return 'direct_video'
  if (/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(clean)) return 'direct_image'

  return 'generic'
}

export async function resolveSocialContent(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Please enter a valid URL')
  }

  // Rate limit
  const rl = checkRateLimit('socialFetch', 15, 60_000)
  if (!rl.allowed) {
    throw new Error(`Too many requests. Please wait ${rl.waitMs}s before fetching again.`)
  }

  const { valid, url: safeUrl, error: urlError } = sanitizeUrl(url.trim())
  if (!valid) throw new Error(urlError)

  // 1. Try server resolver (/api/resolve)
  try {
    const apiRes = await fetch('/api/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: safeUrl }),
    })
    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data && !data.error) {
        return data
      }
    }
  } catch (e) {
    console.warn('Server resolve failed, trying client fallback:', e)
  }

  // 2. Client-side fallback for TikTok (tikwm API)
  const platform = detectPlatform(safeUrl)
  if (platform === 'tiktok') {
    try {
      const tikRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(safeUrl)}`)
      if (tikRes.ok) {
        const json = await tikRes.json()
        if (json.code === 0 && json.data) {
          const d = json.data
          const playUrl = d.play ? (d.play.startsWith('http') ? d.play : `https://www.tikwm.com${d.play}`) : d.wmplay
          const hdUrl = d.hdplay ? (d.hdplay.startsWith('http') ? d.hdplay : `https://www.tikwm.com${d.hdplay}`) : playUrl
          const video = hdUrl || playUrl

          return {
            platform: 'tiktok',
            platformName: 'TikTok (No Watermark)',
            title: d.title || 'TikTok Video Clip',
            author: d.author?.unique_id ? `@${d.author.unique_id}` : '@tiktok_user',
            duration: d.duration ? `${d.duration}s` : '15s',
            type: 'video',
            aspectRatio: '9:16',
            videoUrl: video,
            downloadUrl: video,
            thumbnail: d.cover,
            qualities: [
              { label: 'HD 1080p Video (No Watermark)', url: video, ext: 'mp4' },
              { label: 'Fast 720p Video (MP4)', url: playUrl, ext: 'mp4' },
              ...(d.music ? [{ label: 'Original Sound / Music (MP3)', url: d.music, ext: 'mp3' }] : []),
              ...(d.cover ? [{ label: 'Cover Image (JPG)', url: d.cover, ext: 'jpg' }] : []),
            ],
          }
        }
      }
    } catch (e) {
      console.warn('Tikwm fallback error:', e)
    }
  }

  // 3. Direct video file fallback
  if (platform === 'direct_video' || safeUrl.endsWith('.mp4') || safeUrl.endsWith('.webm')) {
    const rawName = safeUrl.split('/').pop().split('?')[0] || 'video.mp4'
    return {
      platform: 'direct',
      platformName: 'Direct Video Stream',
      title: decodeURIComponent(rawName),
      author: 'Web Source',
      type: 'video',
      videoUrl: safeUrl,
      downloadUrl: safeUrl,
      thumbnail: null,
      aspectRatio: 'original',
      qualities: [{ label: 'Original MP4 / WebM', url: safeUrl, ext: 'mp4' }],
    }
  }

  throw new Error('Could not extract video from this link. Please ensure the link is public and accessible.')
}

/**
 * Converts a remote stream into an in-browser local Blob URL for canvas/video manipulation.
 */
export async function convertRemoteUrlToLocalBlobUrl(remoteUrl) {
  if (!remoteUrl) return null
  if (remoteUrl.startsWith('blob:')) return remoteUrl

  try {
    const res = await fetch(`/api/stream?url=${encodeURIComponent(remoteUrl)}`)
    if (res.ok) {
      const blob = await res.blob()
      return URL.createObjectURL(blob)
    }
  } catch {}

  try {
    const directRes = await fetch(remoteUrl, { mode: 'cors' })
    if (directRes.ok) {
      const blob = await directRes.blob()
      return URL.createObjectURL(blob)
    }
  } catch {}

  return remoteUrl
}
