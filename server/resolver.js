/**
 * Server-side Social Media Content Resolver
 * Handles TikTok, Instagram, YouTube, and direct video links.
 */

export async function resolveUrl(inputUrl) {
  const url = inputUrl.trim()
  const clean = url.toLowerCase()

  // 1. TIKTOK
  if (clean.includes('tiktok.com')) {
    try {
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })
      if (res.ok) {
        const json = await res.json()
        if (json.code === 0 && json.data) {
          const d = json.data
          const playUrl = d.play ? (d.play.startsWith('http') ? d.play : `https://www.tikwm.com${d.play}`) : d.wmplay
          const hdUrl = d.hdplay ? (d.hdplay.startsWith('http') ? d.hdplay : `https://www.tikwm.com${d.hdplay}`) : playUrl
          const finalVideoUrl = hdUrl || playUrl

          return {
            platform: 'tiktok',
            platformName: 'TikTok (No Watermark)',
            title: d.title || 'TikTok Video Clip',
            author: d.author?.unique_id ? `@${d.author.unique_id}` : '@tiktok_user',
            duration: d.duration ? `${d.duration}s` : '15s',
            type: 'video',
            aspectRatio: '9:16',
            videoUrl: finalVideoUrl,
            downloadUrl: finalVideoUrl,
            thumbnail: d.cover,
            qualities: [
              { label: 'HD 1080p Video (No Watermark)', url: finalVideoUrl, ext: 'mp4' },
              { label: 'Fast 720p Video (MP4)', url: playUrl, ext: 'mp4' },
              ...(d.music ? [{ label: 'Original Sound / Music (MP3)', url: d.music, ext: 'mp3' }] : []),
              ...(d.cover ? [{ label: 'Cover Image (JPG)', url: d.cover, ext: 'jpg' }] : []),
            ],
          }
        }
      }
    } catch (err) {
      console.warn('Tikwm error:', err)
    }
  }

  // 2. INSTAGRAM (Reels / Posts)
  if (clean.includes('instagram.com') || clean.includes('instagr.am')) {
    try {
      // Try scraping OpenGraph metadata directly
      const igRes = await fetch(url, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
      })
      if (igRes.ok) {
        const html = await igRes.text()
        const videoMatch = html.match(/<meta\s+(?:property|name)=["']og:video(?::secure_url)?["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/video_url["']:\s*["']([^"']+)["']/i)
        const titleMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i)
        const thumbMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i)

        if (videoMatch && videoMatch[1]) {
          const directVideo = videoMatch[1].replace(/&amp;/g, '&')
          const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : 'Instagram Reel'
          const thumb = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : null

          return {
            platform: 'instagram',
            platformName: 'Instagram Reel',
            title,
            author: '@instagram_creator',
            type: 'video',
            aspectRatio: '9:16',
            videoUrl: directVideo,
            downloadUrl: directVideo,
            thumbnail: thumb,
            qualities: [
              { label: 'High Quality MP4', url: directVideo, ext: 'mp4' },
              ...(thumb ? [{ label: 'Cover Photo (JPG)', url: thumb, ext: 'jpg' }] : []),
            ],
          }
        }
      }
    } catch (igErr) {
      console.warn('IG extraction error:', igErr)
    }
  }

  // 3. YOUTUBE (Shorts & Regular Videos)
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
    const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
    const ytId = idMatch ? idMatch[1] : null
    const isShort = clean.includes('/shorts/')

    let title = isShort ? `YouTube Short #${ytId || 'clip'}` : `YouTube Video (${ytId || 'HD'})`
    let author = 'YouTube Creator'
    let thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null

    // Try YouTube oEmbed for official metadata
    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`)
      if (oembedRes.ok) {
        const odata = await oembedRes.json()
        if (odata.title) title = odata.title
        if (odata.author_name) author = odata.author_name
      }
    } catch {}

    // Try extracting real video stream via ytdl
    try {
      const { Ytdl } = await import('@distube/ytdl-core')
      const ytdl = new Ytdl()
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${ytId}`)
      if (info?.videoDetails?.title) {
        title = info.videoDetails.title
        author = info.videoDetails.author?.name || author
      }

      // Filter formats with audio & video or highest quality
      const validFormats = info.formats?.filter(f => f.url && (f.hasVideo || f.hasAudio)) || []
      const combined = validFormats.filter(f => f.hasVideo && f.hasAudio)
      const primaryStream = combined[0]?.url || validFormats[0]?.url

      if (primaryStream) {
        return {
          platform: 'youtube',
          platformName: isShort ? 'YouTube Shorts' : 'YouTube Video',
          title,
          author,
          type: 'video',
          aspectRatio: isShort ? '9:16' : '16:9',
          videoUrl: primaryStream,
          downloadUrl: primaryStream,
          thumbnail,
          qualities: [
            { label: 'HD 1080p / 720p MP4', url: primaryStream, ext: 'mp4' },
            ...(thumbnail ? [{ label: 'Cover Thumbnail (JPG)', url: thumbnail, ext: 'jpg' }] : []),
          ],
        }
      }
    } catch (ytdlErr) {
      console.warn('ytdl stream extraction note:', ytdlErr.message)
    }

    // If ytdl was rate-limited by YouTube, return clean oEmbed card with thumbnail download
    return {
      platform: 'youtube',
      platformName: isShort ? 'YouTube Shorts' : 'YouTube Video',
      title,
      author,
      type: 'video',
      aspectRatio: isShort ? '9:16' : '16:9',
      videoUrl: null,
      downloadUrl: null,
      thumbnail,
      qualities: [
        ...(thumbnail ? [{ label: 'High-Res Thumbnail Cover (JPG)', url: thumbnail, ext: 'jpg' }] : []),
      ],
      notice: 'YouTube direct video streams are protected by YouTube cipher tokens. Thumbnail is ready for instant download.',
    }
  }

  // 4. DIRECT VIDEO / MEDIA URL
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(clean) || clean.includes('/video/')) {
    const rawName = url.split('/').pop().split('?')[0] || 'video.mp4'
    return {
      platform: 'direct',
      platformName: 'Direct Video Stream',
      title: decodeURIComponent(rawName),
      author: 'Web Source',
      type: 'video',
      videoUrl: url,
      downloadUrl: url,
      thumbnail: null,
      aspectRatio: 'original',
      qualities: [
        { label: 'Original MP4 / WebM Video', url, ext: 'mp4' },
      ],
    }
  }

  throw new Error('Unsupported or private video link. Please enter a valid public TikTok, YouTube, Instagram, or MP4 URL.')
}

