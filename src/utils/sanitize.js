/**
 * Input Sanitization & URL Validation Utilities
 * Guards all user-supplied URLs and filenames before they reach any API or download logic.
 */

const ALLOWED_URL_PROTOCOLS = ['https:', 'http:']

const ALLOWED_MEDIA_EXTENSIONS = [
  'mp4', 'webm', 'mov', 'mkv', 'm4v', 'ogg', 'ogv',
  'jpg', 'jpeg', 'png', 'webp', 'gif',
  'mp3', 'aac', 'm4a',
  'pdf', 'docx', 'doc', 'txt', 'zip',
]

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^::1$/,
  /^0\./,
]

/**
 * Validates and sanitizes a URL entered by the user.
 * Returns { valid: boolean, url: string|null, error: string|null }
 */
export function sanitizeUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { valid: false, url: null, error: 'Please enter a valid URL.' }
  }

  const trimmed = rawInput.trim().slice(0, 2048) // hard cap length

  // Allow local blob: URLs created by the browser — these are safe, origin-bound, temporary
  if (trimmed.startsWith('blob:')) {
    return { valid: true, url: trimmed, error: null }
  }

  // Must start with http or https
  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      valid: false,
      url: null,
      error: 'Only http:// and https:// URLs are supported.',
    }
  }

  let parsed
  try {
    parsed = new URL(trimmed)
  } catch {
    return { valid: false, url: null, error: 'The URL format is invalid. Please check and try again.' }
  }

  // Block non-http(s) schemes
  if (!ALLOWED_URL_PROTOCOLS.includes(parsed.protocol)) {
    return { valid: false, url: null, error: 'Only HTTPS and HTTP URLs are allowed.' }
  }

  // Block private/local network targets (SSRF guard)
  const hostname = parsed.hostname.toLowerCase()
  for (const pattern of BLOCKED_HOSTNAME_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        valid: false,
        url: null,
        error: 'Private or local network addresses are not allowed.',
      }
    }
  }

  // Block data: URLs masquerading as http
  if (parsed.href.toLowerCase().startsWith('data:')) {
    return { valid: false, url: null, error: 'Data URLs are not accepted here.' }
  }

  return { valid: true, url: parsed.href, error: null }
}

/**
 * Sanitizes a filename before use in a download.
 * Strips path traversal, null bytes, and dangerous characters.
 */
export function sanitizeFilename(name = 'download', ext = '') {
  const base = String(name)
    .replace(/\0/g, '')           // null bytes
    .replace(/[/\\:*?"<>|]/g, '_') // reserved characters
    .replace(/\.{2,}/g, '_')      // path traversal (..)
    .replace(/^\.+/, '_')         // leading dots
    .trim()
    .slice(0, 80)                 // max filename length

  const safeName = base || 'download'
  const rawExt = ext.toLowerCase().replace('.', '')
  // If extension is in the allowlist, use it. Otherwise allow it through as-is
  // (avoids corrupting docx, doc, etc. by forcing them to mp4)
  const safeExt = rawExt || ''

  return ext ? `${safeName}.${safeExt}` : safeName
}

/**
 * Validates that a file size is within acceptable limits.
 */
export function validateFileSize(bytes, maxMB = 2048) {
  if (!bytes || bytes <= 0) return { valid: false, error: 'File appears to be empty.' }
  const maxBytes = maxMB * 1024 * 1024
  if (bytes > maxBytes) {
    return { valid: false, error: `File exceeds the ${maxMB} MB limit.` }
  }
  return { valid: true, error: null }
}

/**
 * Validates a file's MIME type against allowed types.
 */
export function validateMimeType(file, allowedTypes = []) {
  if (!file?.type) return { valid: true, error: null } // graceful — some browsers omit type
  const match = allowedTypes.some((t) =>
    t.endsWith('/*') ? file.type.startsWith(t.replace('/*', '/')) : file.type === t
  )
  if (!match && allowedTypes.length > 0) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type}". Please upload a valid file.`,
    }
  }
  return { valid: true, error: null }
}

