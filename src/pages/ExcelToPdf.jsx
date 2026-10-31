import { useState, useCallback } from 'react'
import { FileSpreadsheet, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import FileUploader from '../components/ui/FileUploader'
import Button from '../components/ui/Button'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import SEO from '../components/layout/SEO'
import FaqSection from '../components/ui/FaqSection'
import { downloadBlob } from '../utils/downloadHelper'

const FAQS = [
  {
    q: 'How does the Excel to PDF converter work without uploading my file?',
    a: 'OmniTasker reads your Excel or CSV file entirely inside your browser using SheetJS, extracts all sheets and table data, then generates a clean PDF using jsPDF with auto-table layout. No bytes are sent to any server.',
  },
  {
    q: 'Which Excel file formats does it support?',
    a: 'It supports .xlsx (Excel 2007+), .xls (legacy Excel), and .csv (comma-separated values). All sheets in a multi-sheet workbook are converted into separate sections in the PDF.',
  },
  {
    q: 'Will the downloaded PDF open correctly in all PDF viewers?',
    a: 'Yes. The generated file is a fully standard ISO 32000 PDF that opens in Adobe Acrobat, Windows PDF viewer, Google Chrome, macOS Preview, Foxit, and any other standard PDF reader.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'There is no hard server-side limit since processing is entirely local. Very large files (100,000+ rows) may take a few seconds to render in your browser.',
  },
]


export default function ExcelToPdf() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(null) // { sheets: [{name, headers, rows}] }

  const handleFiles = useCallback(async (files) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setError('')
    setSuccess(false)
    setPreview(null)
    setLoading(true)

    try {
      const buffer = await f.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })

      const sheets = workbook.SheetNames.map((name) => {
        const ws = workbook.Sheets[name]
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        if (!data.length) return { name, headers: [], rows: [] }

        // Find the maximum number of columns across all rows in this sheet
        const maxCols = data.reduce((max, r) => Math.max(max, Array.isArray(r) ? r.length : 0), 0)
        if (maxCols === 0) return { name, headers: [], rows: [] }

        // Normalize all rows to have maxCols columns so no cells or columns are omitted
        const normalizedData = data
          .map((r) => {
            const rowArr = Array.isArray(r) ? r : []
            const result = []
            for (let i = 0; i < maxCols; i++) {
              result.push(rowArr[i] != null ? String(rowArr[i]).trim() : '')
            }
            return result
          })
          .filter((r) => r.some((cell) => cell.length > 0)) // Remove completely empty rows

        if (!normalizedData.length) return { name, headers: [], rows: [] }

        // Use first row as table headers, subsequent rows as table body
        const headers = normalizedData[0].map((h, i) => h || `Col ${i + 1}`)
        const rows = normalizedData.slice(1)
        return { name, headers, rows }
      })

      setPreview({ sheets, fileName: f.name })
    } catch (err) {
      setError('Could not read this file. Make sure it is a valid .xlsx, .xls, or .csv file.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleConvert = async () => {
    if (!preview) return
    setLoading(true)
    setError('')

    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      const baseName = preview.fileName.replace(/\.[^.]+$/, '')

      preview.sheets.forEach((sheet, idx) => {
        if (idx > 0) doc.addPage()

        let startY = 14
        if (preview.sheets.length > 1) {
          // Subtle sheet identifier only when workbook has multiple sheets
          doc.setFontSize(10)
          doc.setTextColor(100, 116, 139)
          doc.text(`Sheet: ${sheet.name}`, 14, 11)
          startY = 15
        }

        if (!sheet.headers.length && !sheet.rows.length) {
          doc.setFontSize(10)
          doc.setTextColor(120, 120, 120)
          doc.text('(Empty sheet)', 14, 25)
          return
        }

        doc.autoTable({
          startY,
          head: [sheet.headers],
          body: sheet.rows,
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak',
            halign: 'left',
          },
          headStyles: {
            fillColor: [99, 102, 241], // indigo
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          margin: { top: 14, left: 14, right: 14, bottom: 14 },
          tableWidth: 'auto',
        })
      })

      const pdfBlob = doc.output('blob')
      await downloadBlob(pdfBlob, `${baseName}.pdf`)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error(err)
      setError('PDF generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setError('')
    setSuccess(false)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Excel to PDF Converter',
    url: 'https://omnitasker.co.in/excel-to-pdf',
    description: 'Free online Excel to PDF converter. Convert .xlsx, .xls, and .csv files to PDF instantly in your browser with no uploads.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Excel to PDF Converter Online Free – Convert XLSX, XLS, CSV to PDF"
        description="Convert Excel spreadsheets (.xlsx, .xls) and CSV files to PDF online for free. All sheets are converted with clean table formatting. 100% client-side — your files never leave your browser."
        keywords="excel to pdf converter, xlsx to pdf, xls to pdf online free, csv to pdf converter, convert excel to pdf without uploading, spreadsheet to pdf, omnitasker excel to pdf"
        canonicalPath="/excel-to-pdf"
        schema={schema}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(99,102,241,0.3))' }}
          >
            📊
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              Excel to PDF <span className="gradient-text">Converter</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Convert .xlsx, .xls, and .csv spreadsheets to PDF instantly — 100% free, no upload
            </p>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mb-6" />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5 border border-white/10">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Upload Excel or CSV File
            </h2>
            <FileUploader
              onFilesSelected={handleFiles}
              selectedFile={file}
              accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'], 'text/csv': ['.csv'] }}
              label="Drop your Excel or CSV file here"
              subLabel="Supports .xlsx · .xls · .csv"
              maxFiles={1}
            />

            {file && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="truncate">{file.name}</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {preview && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400">
                  <span className="text-slate-200 font-semibold">{preview.sheets.length} sheet{preview.sheets.length > 1 ? 's' : ''}</span> detected
                  {preview.sheets.map((s) => (
                    <div key={s.name} className="flex items-center justify-between mt-1 bg-white/5 rounded-lg px-3 py-1.5">
                      <span className="text-slate-300 font-medium">{s.name}</span>
                      <span className="text-slate-500">{s.rows.length} rows × {s.headers.length} cols</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleConvert}
                disabled={!preview || loading}
                loading={loading}
                className="flex-1 justify-center py-3 font-bold"
              >
                {loading ? 'Converting…' : '⬇ Convert & Download PDF'}
              </Button>
              {file && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  title="Reset"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>PDF downloaded successfully! Check your downloads folder.</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-6 border border-white/10 min-h-[300px]">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Data Preview
            </h2>
            {!preview ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-600 space-y-2">
                <FileSpreadsheet className="w-12 h-12" />
                <p className="text-sm">Upload an Excel or CSV file to preview its contents</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
                {preview.sheets.map((sheet) => (
                  <div key={sheet.name}>
                    {preview.sheets.length > 1 && (
                      <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                        Sheet: {sheet.name}
                      </h3>
                    )}
                    {sheet.headers.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">Empty sheet</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="text-xs w-full border-collapse">
                          <thead>
                            <tr className="bg-indigo-500/20">
                              {sheet.headers.map((h, i) => (
                                <th key={i} className="px-3 py-2 text-left text-slate-200 font-semibold border-b border-white/10 whitespace-nowrap">
                                  {h || `Col ${i + 1}`}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sheet.rows.slice(0, 20).map((row, ri) => (
                              <tr key={ri} className={ri % 2 === 0 ? 'bg-white/2' : 'bg-white/5'}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className="px-3 py-1.5 text-slate-400 border-b border-white/5 whitespace-nowrap max-w-[200px] truncate">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {sheet.rows.length > 20 && (
                          <p className="text-[10px] text-slate-500 text-center py-2">
                            Showing 20 of {sheet.rows.length} rows — all rows will be in the PDF
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <AdPlaceholder slot="downloadZone" />
        </div>
      </div>

      {/* How it works */}
      <div className="mt-12 glass-card p-6 border border-white/10">
        <h2 className="font-display text-lg font-bold text-slate-100 mb-4">How to Convert Excel to PDF</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Upload Excel File', desc: 'Drag & drop or click to upload your .xlsx, .xls, or .csv file. It loads instantly in your browser.' },
            { step: '2', title: 'Preview Your Data', desc: 'All sheets are shown in a clean table preview so you can verify the data before converting.' },
            { step: '3', title: 'Download PDF', desc: 'Click "Convert & Download PDF" to get a clean, properly formatted PDF saved directly to your device.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{s.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdPlaceholder slot="leaderboard" className="mt-10" />

      <div className="mt-8">
        <FaqSection items={FAQS} title="Excel to PDF Converter – FAQs" />
      </div>

      <AdPlaceholder slot="leaderboard" className="mt-10" />
    </div>
  )
}

