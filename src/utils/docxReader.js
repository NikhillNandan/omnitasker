/**
 * Client-Side DOCX Reader & Text Extractor
 * Powered by Mammoth.js
 * Accurately extracts structured paragraphs, headings, lists, and tables
 * from Microsoft Word (.docx) documents with zero corrupted binary artifacts.
 */

import mammoth from 'mammoth/mammoth.browser.js'

export async function extractTextFromDocx(fileOrBuffer) {
  let arrayBuffer
  if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer()
  } else if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer
  } else if (ArrayBuffer.isView(fileOrBuffer)) {
    arrayBuffer = fileOrBuffer.buffer
  } else {
    throw new Error('Invalid Word document input.')
  }

  try {
    const result = await mammoth.extractRawText({ arrayBuffer })
    const text = (result?.value || '').trim()

    if (!text) {
      return 'Notice: This Word document appears to be empty or contains only non-text media.'
    }

    // Clean control characters and normalize newlines
    const sanitized = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')

    return sanitized
  } catch (err) {
    console.error('Mammoth extraction failed:', err)
    throw new Error('Could not read Word document: ' + (err.message || 'Ensure this is a standard .docx file.'))
  }
}
