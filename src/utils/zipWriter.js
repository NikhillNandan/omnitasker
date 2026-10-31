/**
 * Pure JavaScript ZIP archive generator (PK standard)
 * Enables client-side generation of valid .docx (Word) and .zip files
 * with zero external dependencies and 100% browser compatibility.
 */

// CRC32 Table
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  CRC_TABLE[i] = c
}

export function crc32(bytes) {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

export class SimpleZip {
  constructor() {
    this.files = []
  }

  /**
   * Adds a file to the archive.
   * @param {string} filename - relative path in zip (e.g., 'word/document.xml')
   * @param {string|Uint8Array} data - content
   */
  file(filename, data) {
    let bytes
    if (typeof data === 'string') {
      bytes = new TextEncoder().encode(data)
    } else if (data instanceof Uint8Array) {
      bytes = data
    } else if (data instanceof ArrayBuffer) {
      bytes = new Uint8Array(data)
    } else {
      bytes = new Uint8Array(0)
    }

    this.files.push({
      name: filename,
      bytes,
      crc: crc32(bytes),
      size: bytes.length,
    })
  }

  /**
   * Generates a Blob containing the valid ZIP archive.
   * @param {string} mimeType
   * @returns {Blob}
   */
  generateBlob(mimeType = 'application/zip') {
    const fileHeaders = []
    const centralDirs = []
    let offset = 0

    const now = new Date()
    const dosTime =
      ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff
    const dosDate =
      (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff

    for (const f of this.files) {
      const nameBytes = new TextEncoder().encode(f.name)

      // Local File Header (30 bytes + name length + data)
      const lfh = new Uint8Array(30 + nameBytes.length)
      const lfhView = new DataView(lfh.buffer)
      lfhView.setUint32(0, 0x04034b50, true) // signature
      lfhView.setUint16(4, 20, true)         // version needed to extract (2.0)
      lfhView.setUint16(6, 0x0800, true)     // general purpose bit flag (UTF-8)
      lfhView.setUint16(8, 0, true)          // compression method (0 = stored)
      lfhView.setUint16(10, dosTime, true)   // last mod file time
      lfhView.setUint16(12, dosDate, true)   // last mod file date
      lfhView.setUint32(14, f.crc, true)     // crc-32
      lfhView.setUint32(18, f.size, true)    // compressed size
      lfhView.setUint32(22, f.size, true)    // uncompressed size
      lfhView.setUint16(26, nameBytes.length, true) // file name length
      lfhView.setUint16(28, 0, true)         // extra field length
      lfh.set(nameBytes, 30)

      fileHeaders.push(lfh)
      fileHeaders.push(f.bytes)

      // Central Directory Header (46 bytes + name length)
      const cdh = new Uint8Array(46 + nameBytes.length)
      const cdhView = new DataView(cdh.buffer)
      cdhView.setUint32(0, 0x02014b50, true) // signature
      cdhView.setUint16(4, 20, true)         // version made by
      cdhView.setUint16(6, 20, true)         // version needed
      cdhView.setUint16(8, 0x0800, true)     // flag
      cdhView.setUint16(10, 0, true)         // compression (0)
      cdhView.setUint16(12, dosTime, true)   // mod time
      cdhView.setUint16(14, dosDate, true)   // mod date
      cdhView.setUint32(16, f.crc, true)     // crc32
      cdhView.setUint32(20, f.size, true)    // compressed size
      cdhView.setUint32(24, f.size, true)    // uncompressed size
      cdhView.setUint16(28, nameBytes.length, true)
      cdhView.setUint16(30, 0, true)         // extra field length
      cdhView.setUint16(32, 0, true)         // file comment length
      cdhView.setUint16(34, 0, true)         // disk number start
      cdhView.setUint16(36, 0, true)         // internal file attributes
      cdhView.setUint32(38, 0, true)         // external file attributes
      cdhView.setUint32(42, offset, true)    // relative offset of local header
      cdh.set(nameBytes, 46)

      centralDirs.push(cdh)
      offset += lfh.length + f.bytes.length
    }

    const cdOffset = offset
    let cdSize = 0
    for (const cdh of centralDirs) {
      cdSize += cdh.length
    }

    // End of Central Directory Record (22 bytes)
    const eocd = new Uint8Array(22)
    const eocdView = new DataView(eocd.buffer)
    eocdView.setUint32(0, 0x06054b50, true) // signature
    eocdView.setUint16(4, 0, true)          // number of this disk
    eocdView.setUint16(6, 0, true)          // disk where central directory starts
    eocdView.setUint16(8, this.files.length, true)  // number of central directory records on this disk
    eocdView.setUint16(10, this.files.length, true) // total number of central directory records
    eocdView.setUint32(12, cdSize, true)    // size of central directory
    eocdView.setUint32(16, cdOffset, true)  // offset of start of central directory
    eocdView.setUint16(20, 0, true)         // comment length

    const parts = [...fileHeaders, ...centralDirs, eocd]
    return new Blob(parts, { type: mimeType })
  }
}

