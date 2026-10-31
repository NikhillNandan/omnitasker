/**
 * Client-side Rate Limiter
 * Protects all API-calling features (social downloader, tikwm, youtube oembed, proxy)
 * from being hammered — prevents abuse, bandwidth waste, and third-party API bans.
 */

const RATE_STORE = {}

/**
 * Check whether the given action key is rate-limited.
 * @param {string} key       - Action name (e.g. 'socialFetch', 'proxyFetch')
 * @param {number} maxCalls  - Max allowed calls within the window
 * @param {number} windowMs  - Rolling window in milliseconds
 * @returns {{ allowed: boolean, waitMs: number, remaining: number }}
 */
export function checkRateLimit(key, maxCalls = 5, windowMs = 60_000) {
  const now = Date.now()

  if (!RATE_STORE[key]) {
    RATE_STORE[key] = []
  }

  // Purge timestamps outside the rolling window
  RATE_STORE[key] = RATE_STORE[key].filter((ts) => now - ts < windowMs)

  const count = RATE_STORE[key].length

  if (count >= maxCalls) {
    const oldest = RATE_STORE[key][0]
    const waitMs = windowMs - (now - oldest)
    return { allowed: false, waitMs: Math.ceil(waitMs / 1000), remaining: 0 }
  }

  RATE_STORE[key].push(now)
  return { allowed: true, waitMs: 0, remaining: maxCalls - count - 1 }
}

/**
 * Resets a specific rate-limit key (useful after successful action).
 */
export function resetRateLimit(key) {
  delete RATE_STORE[key]
}

/**
 * Returns how many calls remain before rate limiting kicks in.
 */
export function getRemainingCalls(key, maxCalls = 5, windowMs = 60_000) {
  const now = Date.now()
  if (!RATE_STORE[key]) return maxCalls
  const active = RATE_STORE[key].filter((ts) => now - ts < windowMs)
  return Math.max(0, maxCalls - active.length)
}

