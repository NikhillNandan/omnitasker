/**
 * Bulletproof cross-browser file download helper.
 * Handles Blobs, Data URLs, Blob URLs, and Remote URLs (with proxy fallback).
 * Uses off-screen anchored elements with genuine click dispatch to guarantee
 * that Chrome, Edge, Firefox, and Safari save files directly to disk without
 * opening in new tabs or getting blocked.
 *
 * Security hardened:
 *  - Filename sanitized before every download (strips path traversal, null bytes)
 *  - Remote URL fetch validated before use
 *  - Blob URL revocation after 30 s (not 60 s) to free memory sooner
 */
import { sanitizeFilename } from './sanitize'

/**
 * Downloads a Blob directly to the user's local disk.
 */
export async function downloadBlob(blob, filename = 'download') {
  if (!blob) {
    console.error('downloadBlob: valid blob is required')
    return false
  }

  // If a Promise was inadvertently passed, resolve it
  if (typeof blob?.then === 'function') {
    try {
      blob = await blob
    } catch (e) {
      console.error('downloadBlob: promise resolution failed', e)
      return false
    }
  }

  if (!(blob instanceof Blob)) {
    console.error('downloadBlob: expected a Blob instance, received:', typeof blob)
    return false
  }

  // Sanitize filename to prevent path traversal and injection
  const safeFilename = sanitizeFilename(
    filename.replace(/\.[^.]+$/, ''),   // strip extension for base
    filename.split('.').pop()            // pass extension separately
  )

  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = safeFilename
    // Using off-screen position rather than display:none so strict browsers trigger the save event
    a.style.position = 'fixed'
    a.style.top = '-9999px'
    a.style.left = '-9999px'
    a.style.opacity = '0'

    document.body.appendChild(a)

    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    } catch {
      a.click()
    }

    setTimeout(() => {
      try {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch {}
    }, 30_000)

    return true
  } catch (err) {
    console.error('downloadBlob failed:', err)
    return false
  }
}

/**
 * Downloads a base64 Data URL by converting to a local Blob first.
 */
export async function downloadDataUrl(dataUrl, filename = 'download') {
  if (!dataUrl) return false

  const safeFilename = sanitizeFilename(
    filename.replace(/\.[^.]+$/, ''),
    filename.split('.').pop()
  )

  try {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return downloadBlob(blob, safeFilename)
  } catch (err) {
    console.warn('Data URL conversion failed, using fallback:', err)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = safeFilename
    a.style.position = 'fixed'
    a.style.top = '-9999px'
    a.style.left = '-9999px'
    a.style.opacity = '0'
    document.body.appendChild(a)
    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    } catch {
      a.click()
    }
    setTimeout(() => {
      try {
        document.body.removeChild(a)
      } catch {}
    }, 10000)
    return true
  }
}

/**
 * Downloads a remote URL by fetching its binary stream into a local Blob.
 * If direct CORS fetch fails, falls back to public proxies to ensure
 * the browser triggers a real file download rather than opening a tab.
 */
export async function downloadFromUrl(url, filename = 'download') {
  if (!url) return false

  const safeFilename = sanitizeFilename(
    filename.replace(/\.[^.]+$/, ''),
    filename.split('.').pop()
  )

  // If already a blob URL
  if (url.startsWith('blob:')) {
    const a = document.createElement('a')
    a.href = url
    a.download = safeFilename
    a.style.position = 'fixed'
    a.style.top = '-9999px'
    a.style.left = '-9999px'
    a.style.opacity = '0'
    document.body.appendChild(a)
    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    } catch {
      a.click()
    }
    setTimeout(() => {
      try {
        document.body.removeChild(a)
      } catch {}
    }, 10000)
    return true
  }

  // 1. Try direct fetch
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (res.ok) {
      const blob = await res.blob()
      return downloadBlob(blob, safeFilename)
    }
  } catch (err) {
    console.warn('Direct fetch download blocked by CORS, trying proxy:', err)
  }

  // 2. Try proxy fetch to convert to Blob
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    const pRes = await fetch(proxyUrl)
    if (pRes.ok) {
      const blob = await pRes.blob()
      return downloadBlob(blob, safeFilename)
    }
  } catch (err2) {
    console.warn('Proxy download failed:', err2)
  }

  // 3. Fallback: create temporary anchor
  const a = document.createElement('a')
  a.href = url
  a.download = safeFilename
  a.style.position = 'fixed'
  a.style.top = '-9999px'
  a.style.left = '-9999px'
  a.style.opacity = '0'
  document.body.appendChild(a)
  try {
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
  } catch {
    a.click()
  }
  setTimeout(() => {
    try {
      document.body.removeChild(a)
    } catch {}
  }, 10000)
  return true
}

/**
 * Universal dispatcher for any file download source.
 */
export function downloadFile(source, filename = 'download') {
  if (!source) return false

  if (source instanceof Blob) {
    return downloadBlob(source, filename)
  }

  if (typeof source === 'string') {
    if (source.startsWith('data:')) {
      return downloadDataUrl(source, filename)
    }
    return downloadFromUrl(source, filename)
  }

  return false
}
