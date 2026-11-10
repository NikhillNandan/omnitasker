/**
 * Post-Build Static SEO Page Generator for OmniTasker
 *
 * Generates pre-rendered, crawlable HTML entrypoints for every single tool and page.
 * When Googlebot crawls https://omnitasker.co.in/pdf-to-word, it receives a 200 OK
 * response containing that tool's exact <title>, meta description, keywords,
 * canonical link, OpenGraph tags, and WebApplication JSON-LD schema — guaranteeing
 * that Google indexes each tool as its own distinct search result!
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

const PAGES = [
  {
    path: 'pdf-to-word',
    title: 'PDF to Word Converter Online Free – Convert PDF to Editable .docx (No Upload)',
    description: 'Convert PDF to Word (.docx) online for free. Extract text and headings from any PDF into an editable Microsoft Word document. 100% client-side — your file never leaves your browser.',
    keywords: 'pdf to word converter, convert pdf to docx online free, pdf to word free, pdf to editable word, extract text from pdf, omnitasker pdf to word, best pdf to word converter',
    category: 'UtilityApplication',
  },
  {
    path: 'word-to-pdf',
    title: 'Word to PDF Converter Free Online – Convert DOCX to PDF (No Upload, Instant)',
    description: 'Convert Word (.docx) files to PDF online free. Get a clean, print-ready A4 PDF from your Word document in seconds. No file upload, no registration, 100% private client-side processing.',
    keywords: 'word to pdf converter, docx to pdf online free, convert word to pdf, word document to pdf, omnitasker word to pdf, docx to pdf without upload',
    category: 'UtilityApplication',
  },
  {
    path: 'excel-to-pdf',
    title: 'Excel to PDF Converter Online Free – Convert XLSX, XLS, CSV to PDF',
    description: 'Convert Excel spreadsheets (.xlsx, .xls) and CSV files to PDF online for free. All sheets are converted with clean table formatting. 100% client-side — your files never leave your browser.',
    keywords: 'excel to pdf converter, xlsx to pdf, xls to pdf online free, csv to pdf converter, convert excel to pdf without uploading, spreadsheet to pdf, omnitasker excel to pdf',
    category: 'UtilityApplication',
  },
  {
    path: 'govt-exam-photo-resizer',
    title: 'Govt Exam Photo & Signature Resizer – UPSC, SSC, GATE, IBPS, NEET (Free)',
    description: 'Resize photo and signature for UPSC, SSC CGL, SSC CHSL, GATE, Bank IBPS PO, NEET, and Indian govt exams in 1 click. Auto-enforces official pixel dimensions and 10KB–50KB file size limits. Free, no upload.',
    keywords: 'govt exam photo resizer, upsc photo resizer, ssc signature resizer 10 to 20 kb, gate photo 480x640 pixels, ibps signature resizer, neet photo resizer, government exam photo size online, ssc photo resizer online',
    category: 'UtilityApplication',
  },
  {
    path: 'image-resizer',
    title: 'Image Resizer Online Free – Resize to Custom Pixels, CM, Inches (PNG, JPG, WebP)',
    description: 'Resize images to any custom dimension in pixels, centimeters, or inches. Convert between JPG, PNG, and WebP. Lock aspect ratio, set exact width and height. Free online image resizer with no upload required.',
    keywords: 'image resizer online free, resize image to specific pixels, resize jpg online, convert image to 1080x1080, resize png without quality loss, custom image dimensions, omnitasker image resizer',
    category: 'UtilityApplication',
  },
  {
    path: 'background-remover',
    title: 'Background Remover Online Free – Remove Image Background Instantly (Transparent PNG)',
    description: 'Remove image background online for free. Get transparent PNG cutouts for logos, products, and passport photos. Replace background with white, transparent, or custom color. 100% in-browser, no upload.',
    keywords: 'background remover online free, remove image background, transparent background png, erase background from photo, passport photo white background, remove bg free alternative, omnitasker background remover',
    category: 'UtilityApplication',
  },
  {
    path: 'compress-image',
    title: 'Image Compressor Online Free – Compress PNG, JPG, WebP Under 20KB 50KB 100KB',
    description: 'Compress images online for free to any KB target. Reduce PNG, JPG, and WebP file size under 20KB, 50KB, 100KB, or 200KB without losing quality. Perfect for government portals, email attachments, and web uploads.',
    keywords: 'image compressor online free, compress png to 20kb, reduce jpg file size, compress image under 50kb, compress photo for government portal, tinypng alternative free, compress webp online, omnitasker image compressor',
    category: 'UtilityApplication',
  },
  {
    path: 'pdf-maker',
    title: 'PDF Maker Online Free – Convert Images to PDF (JPG PNG to PDF, A4)',
    description: 'Create PDF from images online free. Combine multiple JPG, PNG, or WebP photos into a single organized PDF with A4 or Letter page size. Drag, reorder pages, and download instantly. No upload required.',
    keywords: 'pdf maker online free, jpg to pdf converter, images to pdf, png to pdf, create pdf from photos free, combine images into pdf, omnitasker pdf maker',
    category: 'UtilityApplication',
  },
  {
    path: 'pdf-compressor',
    title: 'PDF Compressor Online Free – Reduce PDF File Size Without Losing Quality',
    description: 'Compress PDF files online for free. Reduce PDF size for email, WhatsApp, and government portal uploads. Shrinks PDF from MB to KB without degrading text quality. Client-side — no file upload.',
    keywords: 'pdf compressor online free, reduce pdf file size, compress pdf to 1mb, compress pdf without losing quality, shrink pdf for email, compress pdf for whatsapp, omnitasker pdf compressor',
    category: 'UtilityApplication',
  },
  {
    path: 'merge-pdf',
    title: 'Merge PDF Online Free – Combine Multiple PDF Files into One (No Upload)',
    description: 'Merge multiple PDF files into one document online for free. Drag and drop, reorder pages with arrows, and download a combined PDF instantly. 100% client-side — your files never leave your browser.',
    keywords: 'merge pdf online free, combine pdf files, join pdf pages, merge multiple pdfs, pdf merger free, combine pdf documents without upload, omnitasker merge pdf',
    category: 'UtilityApplication',
  },
  {
    path: 'qr-generator',
    title: 'QR Code Generator Free Online – Custom Color QR Codes (PNG & SVG Download)',
    description: 'Generate custom QR codes online for free. Create colored QR codes for website URLs, UPI payments, WiFi passwords, and more. Download as high-resolution PNG or vector SVG. No signup required.',
    keywords: 'qr code generator free, custom qr code maker, colored qr code online, qr code for upi payment, wifi qr code generator, svg qr code download, omnitasker qr code',
    category: 'UtilityApplication',
  },
  {
    path: 'json-formatter',
    title: 'JSON Formatter & Validator Online Free – Beautify, Minify & Validate JSON',
    description: 'Format, validate, and inspect JSON online for free. Beautify minified JSON, minify large JSON, sort keys alphabetically, and detect syntax errors with line-accurate diagnostics. Dual-pane editor.',
    keywords: 'json formatter online free, json beautifier, json validator, prettify json, minify json online, json editor, format json online, validate json syntax, omnitasker json formatter',
    category: 'DeveloperApplication',
  },
  {
    path: 'about',
    title: 'About OmniTasker – Free Online Utility & File Converter Tool Hub',
    description: 'OmniTasker is a 100% free online utility and file converter hub. Convert PDF to Word, Word to PDF, Excel to PDF, resize exam photos, and format JSON with zero server uploads.',
    keywords: 'about omnitasker, free online utilities, file converter hub, zero upload file tools',
    type: 'AboutPage',
  },
  {
    path: 'contact',
    title: 'Contact Us – OmniTasker Support & Inquiries',
    description: 'Have questions, suggestions, or need help with a file conversion? Contact the OmniTasker team at omnitasker98@gmail.com.',
    keywords: 'omnitasker contact, omnitasker support, omnitasker98@gmail.com',
    type: 'ContactPage',
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy – OmniTasker (100% In-Browser & Zero Server Uploads)',
    description: 'OmniTasker Privacy Policy: Learn how our 100% client-side architecture protects your documents. Full disclosures on cookies, analytics, and Google AdSense.',
    keywords: 'omnitasker privacy policy, client side privacy, adsense compliance, zero upload policy',
    type: 'WebPage',
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service – OmniTasker',
    description: 'Review the terms and conditions for using OmniTasker\'s free online document converters and utilities. Clear guidelines on usage and disclaimers.',
    keywords: 'omnitasker terms of service, acceptable use, utility disclaimer',
    type: 'WebPage',
  },
]

function generate() {
  const templatePath = path.join(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found. Run vite build first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8')

  console.log(`Generating ${PAGES.length} static SEO entrypoints in dist/...`)

  for (const page of PAGES) {
    const pageUrl = `https://omnitasker.co.in/${page.path}`

    let html = baseHtml

    // 1. Replace <title>
    html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`)

    // 2. Replace meta description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${page.description}" />`
    )

    // 3. Replace meta keywords
    html = html.replace(
      /<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="keywords" content="${page.keywords}" />`
    )

    // 4. Set Canonical Link to this exact page URL
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(
        /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
        `<link rel="canonical" href="${pageUrl}" />`
      )
    } else {
      html = html.replace('</head>', `    <link rel="canonical" href="${pageUrl}" />\n  </head>`)
    }

    // 5. Replace OpenGraph & Twitter tags
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:title" content="${page.title}" />`
    )
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:description" content="${page.description}" />`
    )
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:url" content="${pageUrl}" />`
    )
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${page.title}" />`
    )
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${page.description}" />`
    )

    // 6. Inject Schema.org JSON-LD
    const schemaObj = page.category
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: page.title.split('–')[0].trim(),
          url: pageUrl,
          description: page.description,
          applicationCategory: page.category,
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }
      : {
          '@context': 'https://schema.org',
          '@type': page.type || 'WebPage',
          name: page.title,
          url: pageUrl,
          description: page.description,
        }

    const schemaTag = `    <script type="application/ld+json">\n    ${JSON.stringify(
      schemaObj,
      null,
      2
    )}\n    </script>\n  </head>`

    html = html.replace('</head>', schemaTag)

    // 7. Write to dist/<path>/index.html
    const targetDir = path.join(distDir, page.path)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8')
    console.log(`  ✓ Created dist/${page.path}/index.html`)
  }

  console.log(`\nAll ${PAGES.length} static SEO entrypoints generated successfully!`)
}

generate()

