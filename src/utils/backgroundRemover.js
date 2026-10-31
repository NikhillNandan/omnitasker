/**
 * Client-Side Background Removal Engine
 * Features:
 *  - Automatic corner/edge background color sampling
 *  - Interactive eyedropper click-to-pick
 *  - Color distance thresholding (Euclidean RGB delta)
 *  - Edge feathering & anti-aliasing
 *  - Transparent PNG and custom background color replacement
 */

export function detectBackgroundColor(ctx, width, height) {
  // Sample 4 corners and middle edges
  const samplePoints = [
    { x: 5, y: 5 },
    { x: width - 6, y: 5 },
    { x: 5, y: height - 6 },
    { x: width - 6, y: height - 6 },
    { x: Math.floor(width / 2), y: 5 },
    { x: Math.floor(width / 2), y: height - 6 },
  ]

  let rSum = 0, gSum = 0, bSum = 0

  for (const p of samplePoints) {
    const data = ctx.getImageData(p.x, p.y, 1, 1).data
    rSum += data[0]
    gSum += data[1]
    bSum += data[2]
  }

  const count = samplePoints.length
  return {
    r: Math.round(rSum / count),
    g: Math.round(gSum / count),
    b: Math.round(bSum / count),
  }
}

/**
 * Removes or replaces the background of an image on an HTML Canvas.
 *
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {Object} options
 * @param {{r:number, g:number, b:number}} options.targetColor
 * @param {number} options.tolerance - 1 to 100
 * @param {number} options.feather - 0 to 10
 * @param {string} options.replaceBg - 'transparent' | '#ffffff' | hex
 * @returns {ImageData}
 */
export function removeBackground(sourceCanvas, options = {}) {
  const {
    targetColor = { r: 255, g: 255, b: 255 },
    tolerance = 25,
    feather = 2,
    replaceBg = 'transparent',
  } = options

  const width = sourceCanvas.width
  const height = sourceCanvas.height
  const ctx = sourceCanvas.getContext('2d')
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  const tr = targetColor.r
  const tg = targetColor.g
  const tb = targetColor.b

  // Max color distance in 3D RGB space is sqrt(255^2 * 3) ~ 441.67
  const maxDistance = 441.67
  const threshold = (tolerance / 100) * maxDistance
  const featherDist = (feather / 100) * maxDistance

  let replaceR = 0, replaceG = 0, replaceB = 0, replaceA = 0
  if (replaceBg !== 'transparent') {
    const parsed = hexToRgb(replaceBg)
    replaceR = parsed.r
    replaceG = parsed.g
    replaceB = parsed.b
    replaceA = 255
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Euclidean distance
    const dist = Math.sqrt(
      (r - tr) * (r - tr) +
      (g - tg) * (g - tg) +
      (b - tb) * (b - tb)
    )

    if (dist <= threshold) {
      // Full background match
      if (replaceBg === 'transparent') {
        data[i + 3] = 0 // transparent
      } else {
        data[i] = replaceR
        data[i + 1] = replaceG
        data[i + 2] = replaceB
        data[i + 3] = replaceA
      }
    } else if (dist < threshold + featherDist) {
      // Feathered transition edge
      const alphaRatio = (dist - threshold) / (featherDist || 1)
      if (replaceBg === 'transparent') {
        data[i + 3] = Math.round(data[i + 3] * alphaRatio)
      } else {
        data[i] = Math.round(r * alphaRatio + replaceR * (1 - alphaRatio))
        data[i + 1] = Math.round(g * alphaRatio + replaceG * (1 - alphaRatio))
        data[i + 2] = Math.round(b * alphaRatio + replaceB * (1 - alphaRatio))
      }
    }
  }

  return imgData
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    }
  }
  return {
    r: parseInt(clean.substring(0, 2), 16) || 255,
    g: parseInt(clean.substring(2, 4), 16) || 255,
    b: parseInt(clean.substring(4, 6), 16) || 255,
  }
}

