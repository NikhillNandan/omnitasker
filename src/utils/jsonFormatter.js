/**
 * JSON utility functions for validation, formatting, minification, and sorting.
 */

export function validateJson(input) {
  if (!input || !input.trim()) {
    return { valid: true, error: null, parsed: null }
  }

  try {
    const parsed = JSON.parse(input)
    return { valid: true, error: null, parsed }
  } catch (err) {
    // Extract line/column information if present
    const message = err.message || 'Invalid JSON format'
    const lineMatch = message.match(/position (\d+)/i)
    let line = 1
    let column = 1

    if (lineMatch && lineMatch[1]) {
      const pos = parseInt(lineMatch[1], 10)
      const lines = input.slice(0, pos).split('\n')
      line = lines.length
      column = lines[lines.length - 1].length + 1
    }

    return {
      valid: false,
      error: {
        message,
        line,
        column,
      },
      parsed: null,
    }
  }
}

export function formatJson(input, indent = 2) {
  const { valid, error, parsed } = validateJson(input)
  if (!valid) throw new Error(error.message)
  if (parsed === null) return ''
  return JSON.stringify(parsed, null, indent)
}

export function minifyJson(input) {
  const { valid, error, parsed } = validateJson(input)
  if (!valid) throw new Error(error.message)
  if (parsed === null) return ''
  return JSON.stringify(parsed)
}

export function sortJsonKeys(input, indent = 2) {
  const { valid, error, parsed } = validateJson(input)
  if (!valid) throw new Error(error.message)
  if (parsed === null) return ''

  const sortObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(sortObject)
    return Object.keys(obj)
      .sort()
      .reduce((res, key) => {
        res[key] = sortObject(obj[key])
        return res
      }, {})
  }

  return JSON.stringify(sortObject(parsed), null, indent)
}

export function getJsonStats(input) {
  try {
    const parsed = JSON.parse(input)
    const byteSize = new Blob([input]).size

    let keysCount = 0
    let depth = 0

    const traverse = (obj, currentDepth = 1) => {
      depth = Math.max(depth, currentDepth)
      if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
          obj.forEach((item) => traverse(item, currentDepth + 1))
        } else {
          keysCount += Object.keys(obj).length
          Object.values(obj).forEach((val) => traverse(val, currentDepth + 1))
        }
      }
    }

    traverse(parsed)

    return {
      sizeBytes: byteSize,
      keys: keysCount,
      depth,
      isArray: Array.isArray(parsed),
      rootType: typeof parsed,
    }
  } catch {
    return null
  }
}
