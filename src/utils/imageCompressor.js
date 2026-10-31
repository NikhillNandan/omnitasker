import imageCompression from 'browser-image-compression'

/**
 * Compresses an image File using browser-image-compression client-side.
 *
 * @param {File} file
 * @param {Object} options
 * @param {number} [options.quality=0.8]   - 0.1 to 1.0 (Target Quality)
 * @param {number} [options.maxSizeMB=1]   - Maximum file size in MB
 * @param {Function} [options.onProgress]  - Progress callback (0-100)
 * @returns {Promise<{blob: Blob, objectUrl: string, dataUrl: string, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(file, { quality = 0.8, maxSizeMB = 1, onProgress } = {}) {
  // Support legacy signature (file, quality, onProgress)
  let q = typeof arguments[1] === 'number' ? arguments[1] : quality
  let mb = typeof arguments[1] === 'number' ? (q < 0.3 ? 0.2 : q < 0.6 ? 0.5 : q < 0.8 ? 1 : 2) : maxSizeMB
  let progressFn = typeof arguments[2] === 'function' ? arguments[2] : onProgress

  const compressionOptions = {
    maxSizeMB: Math.max(0.01, mb),
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    onProgress: progressFn,
    fileType: file.type || 'image/jpeg',
    initialQuality: Math.min(1, Math.max(0.1, q)),
  }

  const compressedBlob = await imageCompression(file, compressionOptions)
  const objectUrl = URL.createObjectURL(compressedBlob)

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(compressedBlob)
  })

  return {
    blob: compressedBlob,
    objectUrl,
    dataUrl,
    originalSize: file.size,
    compressedSize: compressedBlob.size,
  }
}

/**
 * Compresses an HTML Canvas to fall directly within a target KB limit.
 * Uses binary search over JPEG quality.
 */
export async function compressCanvasToTargetKB(canvas, format = 'image/jpeg', targetKB = 50, minKB = 0, maxKB = Infinity) {
  const outputFormat = format === 'image/png' && targetKB ? 'image/jpeg' : format

  const getBlobAtQuality = (q) =>
    new Promise((resolve) => canvas.toBlob(resolve, outputFormat, q))

  let low = 0.05
  let high = 0.98
  let bestBlob = await getBlobAtQuality(0.85)
  let bestQuality = 0.85
  let bestDiff = Math.abs(bestBlob.size / 1024 - targetKB)

  for (let i = 0; i < 7; i++) {
    const mid = (low + high) / 2
    const blob = await getBlobAtQuality(mid)
    const currentKB = blob.size / 1024
    const diff = Math.abs(currentKB - targetKB)

    if (diff < bestDiff) {
      bestDiff = diff
      bestBlob = blob
      bestQuality = mid
    }

    if (minKB && maxKB && currentKB >= minKB && currentKB <= maxKB) {
      bestBlob = blob
      bestQuality = mid
      break
    }

    if (currentKB > targetKB) {
      high = mid
    } else {
      low = mid
    }
  }

  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(bestBlob)
  })

  return {
    blob: bestBlob,
    dataUrl,
    objectUrl: URL.createObjectURL(bestBlob),
    sizeKB: Math.round((bestBlob.size / 1024) * 10) / 10,
    qualityUsed: Math.round(bestQuality * 100) / 100,
  }
}

/**
 * Convert dimensions from units (cm, mm, inch) to pixels based on DPI.
 */
export function convertUnitsToPx(value, unit = 'px', dpi = 300) {
  const num = parseFloat(value)
  if (isNaN(num)) return 0
  if (unit === 'px') return Math.round(num)
  if (unit === 'cm') return Math.round((num / 2.54) * dpi)
  if (unit === 'mm') return Math.round((num / 25.4) * dpi)
  if (unit === 'inch') return Math.round(num * dpi)
  return Math.round(num)
}

/** Format bytes to human-readable string */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`
}
