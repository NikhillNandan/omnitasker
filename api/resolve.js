import { resolveUrl } from '../server/resolver.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url } = req.body || {}
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    const data = await resolveUrl(url)
    return res.status(200).json(data)
  } catch (err) {
    console.error('API resolve error:', err)
    return res.status(500).json({ error: err.message || 'Failed to resolve media link' })
  }
}

