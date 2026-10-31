/**
 * High-Performance Client-Side PDF Utilities (pdf-lib based)
 * Handles PDF creation from images/text, PDF compression, and page manipulation.
 */

import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib'

/**
 * Creates a high-quality multi-page PDF from a list of images or text items.
 *
 * @param {Array<{ file: File, dataUrl: string, name: string }>} items
 * @param {Object} options
 * @param {'a4'|'letter'|'auto'} options.pageSize
 * @param {'portrait'|'landscape'} options.orientation
 * @param {number} options.margin - in points (e.g., 20)
 * @returns {Promise<Uint8Array>}
 */
export async function createPdfFromImages(items, options = {}) {
  const { pageSize = 'a4', orientation = 'portrait', margin = 20 } = options

  const pdfDoc = await PDFDocument.create()

  let pageDimensions
  if (pageSize === 'letter') {
    pageDimensions = PageSizes.Letter
  } else {
    pageDimensions = PageSizes.A4 // [595.28, 841.89]
  }

  let pageWidth = orientation === 'landscape' ? pageDimensions[1] : pageDimensions[0]
  let pageHeight = orientation === 'landscape' ? pageDimensions[0] : pageDimensions[1]

  for (const item of items) {
    const arrayBuffer = await item.file.arrayBuffer()
    let image
    const isPng = item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png')

    try {
      if (isPng) {
        image = await pdfDoc.embedPng(arrayBuffer)
      } else {
        image = await pdfDoc.embedJpg(arrayBuffer)
      }
    } catch {
      // Fallback: convert to JPG via canvas if image format was WebP/other
      const convertedJpgBuffer = await convertImageToJpgBuffer(item.dataUrl)
      image = await pdfDoc.embedJpg(convertedJpgBuffer)
    }

    const imgWidth = image.width
    const imgHeight = image.height

    if (pageSize === 'auto') {
      // Page fits image perfectly
      const page = pdfDoc.addPage([imgWidth + margin * 2, imgHeight + margin * 2])
      page.drawImage(image, {
        x: margin,
        y: margin,
        width: imgWidth,
        height: imgHeight,
      })
    } else {
      // Scale to fit within A4/Letter margins preserving aspect ratio
      const maxW = pageWidth - margin * 2
      const maxH = pageHeight - margin * 2
      const scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1)

      const drawW = imgWidth * scale
      const drawH = imgHeight * scale
      const posX = (pageWidth - drawW) / 2
      const posY = (pageHeight - drawH) / 2

      const page = pdfDoc.addPage([pageWidth, pageHeight])
      page.drawImage(image, {
        x: posX,
        y: posY,
        width: drawW,
        height: drawH,
      })
    }
  }

  return pdfDoc.save()
}

function sanitizeWinAnsi(text) {
  if (!text) return ''
  return String(text)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u25CF\u25CB]/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')
}

/**
 * Creates a formatted PDF document from text paragraphs.
 *
 * @param {string} textContent
 * @returns {Promise<Uint8Array>}
 */
export async function createPdfFromText(textContent) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const [pageWidth, pageHeight] = PageSizes.A4
  const margin = 50
  const maxLineWidth = pageWidth - margin * 2
  const fontSize = 11
  const lineHeight = 16

  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let cursorY = pageHeight - margin

  const cleanContent = sanitizeWinAnsi(textContent || '')
  const paragraphs = cleanContent.split(/\r?\n/)

  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (!trimmed) {
      cursorY -= 12
      continue
    }

    // Word wrap paragraph into lines
    const words = trimmed.split(/\s+/)
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      let textWidth = 0
      try {
        textWidth = font.widthOfTextAtSize(testLine, fontSize)
      } catch {
        textWidth = testLine.length * 6
      }

      if (textWidth > maxLineWidth && currentLine) {
        if (cursorY < margin + 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight])
          cursorY = pageHeight - margin
        }
        page.drawText(currentLine, {
          x: margin,
          y: cursorY,
          size: fontSize,
          font,
          color: rgb(0.2, 0.25, 0.3),
        })
        cursorY -= lineHeight
        currentLine = word
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      if (cursorY < margin + 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        cursorY = pageHeight - margin
      }
      page.drawText(currentLine, {
        x: margin,
        y: cursorY,
        size: fontSize,
        font,
        color: rgb(0.2, 0.25, 0.3),
      })
      cursorY -= lineHeight + 6
    }
  }

  return pdfDoc.save()
}

/**
 * Compresses an existing PDF document by stripping unneeded metadata,
 * optimizing streams, and saving with useObjectStreams.
 *
 * @param {File} file
 * @param {'recommended'|'extreme'} level
 * @returns {Promise<{ bytes: Uint8Array, originalSize: number, compressedSize: number }>}
 */
export async function compressPdfDocument(file, level = 'recommended') {
  const originalSize = file.size
  const arrayBuffer = await file.arrayBuffer()

  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  // Strip non-essential metadata
  pdfDoc.setTitle('')
  pdfDoc.setAuthor('')
  pdfDoc.setSubject('')
  pdfDoc.setKeywords([])
  pdfDoc.setProducer('OmniTasker PDF Engine')
  pdfDoc.setCreator('OmniTasker')

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })

  return {
    bytes: compressedBytes,
    originalSize,
    compressedSize: compressedBytes.length,
  }
}

/** Helper to convert image dataUrl to JPEG ArrayBuffer via Canvas */
function convertImageToJpgBuffer(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, img.width, img.height)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        async (blob) => {
          if (!blob) return reject(new Error('Canvas to blob failed'))
          const buf = await blob.arrayBuffer()
          resolve(buf)
        },
        'image/jpeg',
        0.9
      )
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

