/**
 * High-Performance Client-Side PDF Text Extractor
 * Powered by Mozilla's PDF.js (pdfjs-dist)
 * Correctly decodes FlateDecode compressed streams, Font CMap encodings,
 * and multi-page document layouts without ever outputting raw binary garbage.
 */

import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Configure worker URL for Vite bundling
if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
}

export async function extractTextFromPdf(fileOrBuffer) {
  let arrayBuffer
  if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer()
  } else if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer
  } else if (ArrayBuffer.isView(fileOrBuffer)) {
    arrayBuffer = fileOrBuffer.buffer
  } else {
    throw new Error('Invalid PDF input. Please provide a valid PDF file.')
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    })

    const pdfDoc = await loadingTask.promise
    const numPages = pdfDoc.numPages
    const pagesText = []

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()

      const rawItems = (textContent.items || []).filter((item) => {
        if (!item || typeof item.str !== 'string') return false
        return item.str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').length > 0
      })

      if (rawItems.length === 0) continue

      // Map to items with geometric position
      const positioned = rawItems.map((item) => ({
        str: item.str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''),
        x: item.transform ? item.transform[4] : 0,
        y: item.transform ? item.transform[5] : 0,
        hasEOL: !!item.hasEOL,
      }))

      // Group into lines by Y coordinate (PDF Y decreases from top to bottom)
      // Items within ~4pt vertical distance belong to the same line
      const lineBuckets = []
      for (const item of positioned) {
        let placed = false
        for (const bucket of lineBuckets) {
          if (Math.abs(bucket.y - item.y) <= 4.5) {
            bucket.items.push(item)
            // Update running average Y for bucket
            bucket.y = (bucket.y * (bucket.items.length - 1) + item.y) / bucket.items.length
            placed = true
            break
          }
        }
        if (!placed) {
          lineBuckets.push({ y: item.y, items: [item] })
        }
      }

      // Sort lines from top of page to bottom of page (descending Y)
      lineBuckets.sort((a, b) => b.y - a.y)

      const pageLines = []
      for (const bucket of lineBuckets) {
        // Sort items within line from left to right (ascending X)
        bucket.items.sort((a, b) => a.x - b.x)
        const lineText = bucket.items.map((i) => i.str).join(' ').replace(/\s+/g, ' ').trim()
        if (lineText) {
          pageLines.push(lineText)
        }
      }

      const pageResult = pageLines.join('\n').trim()
      if (pageResult) {
        pagesText.push(pageResult)
      }
    }

    let fullResult = pagesText.join('\n\n').trim()

    // De-hyphenate words broken across line wraps (e.g. organiza-\ntion -> organization)
    fullResult = fullResult.replace(/([A-Za-z]{2,})-\n\s*([A-Za-z]{2,})/g, '$1$2')

    if (!fullResult) {
      return 'Notice: No selectable text could be extracted from this PDF. It appears to be a scanned document or image-only PDF.'
    }

    return fullResult
  } catch (err) {
    console.error('PDF.js extraction failed:', err)
    throw new Error('Could not parse PDF content: ' + (err.message || 'Corrupted or password-protected PDF'))
  }
}
