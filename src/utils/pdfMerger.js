import { PDFDocument } from 'pdf-lib'
import { downloadBlob } from './downloadHelper'

/**
 * Merges multiple PDF File objects into a single PDF.
 *
 * @param {File[]} files – array of PDF File objects (in order)
 * @returns {Promise<Uint8Array>} – merged PDF bytes
 */
export async function mergePdfs(files) {
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))
  }

  return mergedPdf.save()
}

/**
 * Triggers a browser download of bytes as a named file.
 *
 * @param {Uint8Array} bytes
 * @param {string} filename
 */
export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  downloadBlob(blob, filename)
}

