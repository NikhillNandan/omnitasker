import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveUrl } from './server/resolver.js'

function socialMediaDevPlugin() {
  return {
    name: 'social-media-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url, 'http://localhost:5173')

        // 1. Download proxy: /api/download?url=...&filename=...
        if (urlObj.pathname === '/api/download') {
          const targetUrl = urlObj.searchParams.get('url')
          const filename = urlObj.searchParams.get('filename') || 'video.mp4'

          if (!targetUrl) {
            res.statusCode = 400
            res.end('Missing target URL')
            return
          }

          try {
            const fetchRes = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': targetUrl.includes('tiktok') ? 'https://www.tiktok.com/' : 'https://www.google.com/',
              },
            })

            if (!fetchRes.ok) {
              res.statusCode = fetchRes.status
              res.end('Failed to fetch remote media stream')
              return
            }

            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
            const contentType = fetchRes.headers.get('content-type') || 'video/mp4'
            res.setHeader('Content-Type', contentType)
            const contentLength = fetchRes.headers.get('content-length')
            if (contentLength) res.setHeader('Content-Length', contentLength)

            const arrayBuffer = await fetchRes.arrayBuffer()
            res.end(Buffer.from(arrayBuffer))
          } catch (err) {
            console.error('Download error:', err)
            res.statusCode = 500
            res.end('Download error: ' + err.message)
          }
          return
        }

        // 2. Playback stream proxy: /api/stream?url=...
        if (urlObj.pathname === '/api/stream') {
          const targetUrl = urlObj.searchParams.get('url')
          if (!targetUrl) {
            res.statusCode = 400
            res.end('Missing URL')
            return
          }

          try {
            const fetchRes = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': targetUrl.includes('tiktok') ? 'https://www.tiktok.com/' : 'https://www.google.com/',
              },
            })

            res.setHeader('Content-Type', fetchRes.headers.get('content-type') || 'video/mp4')
            res.setHeader('Access-Control-Allow-Origin', '*')

            const arrayBuffer = await fetchRes.arrayBuffer()
            res.end(Buffer.from(arrayBuffer))
          } catch (err) {
            res.statusCode = 500
            res.end('Stream error: ' + err.message)
          }
          return
        }

        // 3. Resolver: /api/resolve (POST)
        if (urlObj.pathname === '/api/resolve' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const { url } = JSON.parse(body || '{}')
              if (!url) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'URL is required' }))
                return
              }

              const data = await resolveUrl(url)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message || 'Failed to resolve media' }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    socialMediaDevPlugin(),
  ],
})
