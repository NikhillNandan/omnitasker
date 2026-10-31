export default async function handler(req, res) {
  const { url, filename = 'video.mp4' } = req.query || {}

  if (!url) {
    return res.status(400).send('Missing target URL parameter')
  }

  try {
    const fetchRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': url.includes('tiktok') ? 'https://www.tiktok.com/' : 'https://www.google.com/',
      },
    })

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).send('Failed to fetch remote media stream')
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    const contentType = fetchRes.headers.get('content-type') || 'video/mp4'
    res.setHeader('Content-Type', contentType)
    const contentLength = fetchRes.headers.get('content-length')
    if (contentLength) res.setHeader('Content-Length', contentLength)

    const arrayBuffer = await fetchRes.arrayBuffer()
    return res.status(200).send(Buffer.from(arrayBuffer))
  } catch (err) {
    console.error('Download proxy error:', err)
    return res.status(500).send('Failed to proxy video download')
  }
}

