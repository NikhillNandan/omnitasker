/**
 * Post-Build Static SEO & Content Pre-Renderer for OmniTasker
 *
 * Generates pre-rendered, crawlable HTML entrypoints for every single tool and page.
 * Crucially, injects rich, high-value editorial content, how-to guides, and FAQs
 * inside <div id="root"> so that Google AdSense review bots (Mediapartners-Google)
 * and search engine crawlers see hundreds of words of unique, authentic content on every
 * single URL — resolving "Low value content" and thin content rejections!
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
    h1: 'PDF to Word Converter – Convert PDF to Editable .docx Online Free',
    summary: 'OmniTasker provides an enterprise-grade, 100% browser-based PDF to Word converter that extracts text, paragraphs, headings, and formatting from read-only PDF documents and packages them into clean, editable Microsoft Word (.docx) files without requiring any software installation or remote server uploads.',
    steps: [
      { title: 'Select or Drop Your PDF File', desc: 'Click the upload box or drag your PDF document directly into the tool. Processing begins immediately in your device memory.' },
      { title: 'Review & Edit Extracted Text', desc: 'Our dual-pane interface decodes document streams using Mozilla PDF.js, displaying the extracted text in an editable preview pane where you can make instant edits.' },
      { title: 'Download Official .docx Document', desc: 'Click Download to receive an official OpenXML (.docx) file that opens seamlessly in Microsoft Word, Google Docs, Apple Pages, and LibreOffice.' }
    ],
    features: [
      '100% In-Browser Conversion: Zero bytes uploaded to external servers for complete data confidentiality.',
      'Interactive Live Text Editing: Review, format, or append notes directly before downloading your DOCX.',
      'Preserves Text Structure: Correctly handles paragraphs, line wraps, bulleted lists, and heading hierarchies.',
      'Completely Free: Unlimited conversions without sign-up, email requirements, or watermarks.'
    ],
    faqs: [
      { q: 'How does the PDF to Word converter work without sending files to an external server?', a: 'OmniTasker decodes the internal text streams of your PDF document directly inside your browser memory using Mozilla PDF.js. It extracts paragraphs and structures them into an official OpenXML (.docx) Word file on your local hardware.' },
      { q: 'Can I edit the extracted text before downloading the Word document?', a: 'Yes! Our interactive dual-pane interface presents the extracted document text in an editable preview box where you can review, modify, or append notes before triggering your .docx download.' },
      { q: 'Is converting sensitive legal or financial PDFs on OmniTasker safe?', a: '100% safe. Because processing runs entirely client-side on your device hardware, zero bytes are uploaded to remote databases or third-party cloud servers.' },
      { q: 'Which Word processing applications can open the downloaded .docx file?', a: 'The downloaded file follows the official Microsoft OpenXML standard, meaning it opens in Microsoft Word 2007 through Office 365, Google Docs, Apple Pages, WPS Office, and LibreOffice.' }
    ]
  },
  {
    path: 'word-to-pdf',
    title: 'Word to PDF Converter Free Online – Convert DOCX to PDF (No Upload, Instant)',
    description: 'Convert Word (.docx) files to PDF online free. Get a clean, print-ready A4 PDF from your Word document in seconds. No file upload, no registration, 100% private client-side processing.',
    keywords: 'word to pdf converter, docx to pdf online free, convert word to pdf, word document to pdf, omnitasker word to pdf, docx to pdf without upload',
    category: 'UtilityApplication',
    h1: 'Word to PDF Converter – Convert DOCX Documents to PDF Online Free',
    summary: 'Transform Microsoft Word documents (.docx) into universal, print-ready PDF files in seconds. OmniTasker ensures crisp typographic rendering, table preservation, and standard A4 page layout with zero server uploads.',
    steps: [
      { title: 'Upload DOCX Document', desc: 'Drag and drop your Microsoft Word (.docx) file into the upload zone or choose it from your local storage.' },
      { title: 'Instant Browser-Side Parsing', desc: 'Mammoth.js parses your Word document XML structures locally, converting headings, lists, tables, and inline styles into high-fidelity PDF layout.' },
      { title: 'Download Print-Ready PDF', desc: 'Preview the rendered document pages and click Download to save your ISO-compliant PDF file ready for distribution.' }
    ],
    features: [
      'Preserves Document Styling: Accurate conversion of headings, bold/italic text, tables, and spacing.',
      'A4 & Letter Formatting: Produces standardized print-ready PDFs formatted for business and academia.',
      'No File Size Queue: Instantly renders documents on your local CPU without waiting in server queues.',
      'Private & Secure: Files never leave your computer or phone.'
    ],
    faqs: [
      { q: 'Does Word to PDF conversion require Microsoft Office installed on my computer?', a: 'No. OmniTasker runs its own client-side OpenXML rendering engine inside your web browser, so you do not need Microsoft Office, Word, or any desktop software installed.' },
      { q: 'Will my converted PDF look identical to the original Word file?', a: 'Yes, our parser converts standard headings, body paragraphs, bullet points, tables, and bold/italic formatting into standard PDF typography.' },
      { q: 'Are my private Word documents uploaded to a server?', a: 'Never. All parsing and PDF rendering happen locally within your browser tab.' }
    ]
  },
  {
    path: 'excel-to-pdf',
    title: 'Excel to PDF Converter Online Free – Convert XLSX, XLS, CSV to PDF',
    description: 'Convert Excel spreadsheets (.xlsx, .xls) and CSV files to PDF online for free. All sheets are converted with clean table formatting. 100% client-side — your files never leave your browser.',
    keywords: 'excel to pdf converter, xlsx to pdf, xls to pdf online free, csv to pdf converter, convert excel to pdf without uploading, spreadsheet to pdf, omnitasker excel to pdf',
    category: 'UtilityApplication',
    h1: 'Excel to PDF Converter – Convert XLSX, XLS & CSV to Formatted PDF',
    summary: 'Effortlessly convert Excel workbooks and CSV files into professional, beautifully styled PDF reports. OmniTasker reads all workbook sheets, calculates column widths, and formats tabular data with alternating row highlights.',
    steps: [
      { title: 'Select Excel or CSV File', desc: 'Drop any .xlsx, .xls, or .csv spreadsheet into the converter. Works with complex multi-sheet workbooks.' },
      { title: 'Select Sheets & Review Table Preview', desc: 'View interactive sheet previews with automatic column wrapping, header styling, and cell alignment.' },
      { title: 'Export Formatted PDF Report', desc: 'Generate a clean, print-ready landscape or portrait PDF report with professional typography.' }
    ],
    features: [
      'Multi-Sheet Support: Automatically processes multiple tabs within a single Excel workbook.',
      'Auto-Table Layout: Calculates column widths dynamically to prevent awkward text clipping.',
      'Supports All Spreadsheets: Works with modern .xlsx, legacy .xls, and universal .csv datasets.',
      'Complete Privacy: Highly sensitive financial and accounting records remain completely local.'
    ],
    faqs: [
      { q: 'Which Excel versions and formats are supported?', a: 'OmniTasker supports Microsoft Excel (.xlsx), legacy Excel 97-2003 (.xls), and Comma Separated Values (.csv).' },
      { q: 'How does it handle wide tables with many columns?', a: 'Our auto-table engine dynamically shrinks font sizing and wraps cell contents to fit standard page dimensions, ensuring all columns remain readable.' },
      { q: 'Is there a row or sheet limit?', a: 'Because processing utilizes your device hardware, spreadsheets with dozens of sheets and tens of thousands of rows render in just a few seconds.' }
    ]
  },
  {
    path: 'govt-exam-photo-resizer',
    title: 'Govt Exam Photo & Signature Resizer – UPSC, SSC, GATE, IBPS, NEET (Free)',
    description: 'Resize photo and signature for UPSC, SSC CGL, SSC CHSL, GATE, Bank IBPS PO, NEET, and Indian govt exams in 1 click. Auto-enforces official pixel dimensions and 10KB–50KB file size limits. Free, no upload.',
    keywords: 'govt exam photo resizer, upsc photo resizer, ssc signature resizer 10 to 20 kb, gate photo 480x640 pixels, ibps signature resizer, neet photo resizer, government exam photo size online, ssc photo resizer online',
    category: 'UtilityApplication',
    h1: 'Official Govt Exam Photo & Signature Resizer (UPSC, SSC, GATE, IBPS, NEET)',
    summary: 'Never get your competitive exam application rejected again due to incorrect photo or signature specifications. OmniTasker automatically enforces the exact official dimensions, DPI standards, KB limits, and date/name stamps required by Indian recruitment boards.',
    steps: [
      { title: 'Select Your Exam Preset', desc: 'Choose from official presets including UPSC Civil Services, SSC CGL/CHSL/MTS, GATE, IBPS Bank PO/Clerk, NEET, or enter custom requirements.' },
      { title: 'Upload Candidate Photo or Signature', desc: 'Crop and center your passport photo or signature. Optionally add candidate name and photo date stamp.' },
      { title: 'Download Compliant Image', desc: 'Download a perfectly compliant JPG guaranteed to be accepted by exam portal validators without error.' }
    ],
    features: [
      'Official Exam Presets: Instant presets for UPSC, SSC, GATE, IBPS, NEET, RRB, and state PSC exams.',
      'Exact KB Bounds: Precision binary-search compression guarantees files fit strictly within 20KB-50KB or 10KB-20KB limits.',
      'Name & Date Stamp: Complies with SSC and UPSC mandates requiring candidate name and date of photo capture.',
      'White Background Helper: Cleans and sharpens portrait backgrounds to meet passport photo standards.'
    ],
    faqs: [
      { q: 'What are the photo dimensions for SSC CGL and CHSL exams?', a: 'SSC requires candidate photos to be 3.5 cm x 4.5 cm (approximately 138 x 177 pixels), formatted as JPG, with file size strictly between 20 KB and 50 KB.' },
      { q: 'What are the signature size requirements for IBPS and Bank exams?', a: 'IBPS requires signatures to be 140 x 60 pixels with a file size strictly between 10 KB and 20 KB on white paper with black ink.' },
      { q: 'How does OmniTasker guarantee the file size will not exceed the limit?', a: 'We run an iterative client-side compression loop that recalculates JPEG quality factors until the exact byte size falls within the requested boundary.' }
    ]
  },
  {
    path: 'image-resizer',
    title: 'Image Resizer Online Free – Resize to Custom Pixels, CM, Inches (PNG, JPG, WebP)',
    description: 'Resize images to any custom dimension in pixels, centimeters, or inches. Convert between JPG, PNG, and WebP. Lock aspect ratio, set exact width and height. Free online image resizer with no upload required.',
    keywords: 'image resizer online free, resize image to specific pixels, resize jpg online, convert image to 1080x1080, resize png without quality loss, custom image dimensions, omnitasker image resizer',
    category: 'UtilityApplication',
    h1: 'Custom Image Resizer & Format Converter (Pixels, CM, Inches)',
    summary: 'Resize digital pictures to exact specifications for websites, social media platforms, e-commerce stores, or print publications. Features real-time aspect ratio locking, unit conversions, and multi-format export.',
    steps: [
      { title: 'Choose Image', desc: 'Drop any PNG, JPG, WebP, or SVG file into the workspace.' },
      { title: 'Set Width, Height & Unit', desc: 'Input target dimensions in pixels, centimeters, millimeters, or inches with aspect ratio toggle.' },
      { title: 'Export in Desired Format', desc: 'Choose output format (JPG, PNG, or WebP) and adjust quality slider for optimal sharpness.' }
    ],
    features: [
      'Flexible Measurement Units: Scale images in pixels (px), centimeters (cm), millimeters (mm), or inches (in).',
      'Aspect Ratio Lock: Maintain original image proportions or freely stretch to custom dimensions.',
      'Format Switching: Convert between modern WebP, lossless PNG, and universal JPEG in one step.',
      'Zero Quality Degradation: Uses high-order bicubic interpolation algorithms for crisp output.'
    ],
    faqs: [
      { q: 'Does resizing an image reduce its clarity or sharpness?', a: 'OmniTasker utilizes browser canvas bicubic downsampling algorithms that resample pixels smoothly to maintain sharp details and prevent blurriness.' },
      { q: 'Can I resize images for Instagram and YouTube thumbnails?', a: 'Yes! You can instantly type 1080x1080 for Instagram square posts, 1080x1920 for Stories/Reels, or 1280x720 for YouTube thumbnails.' },
      { q: 'Is there any limit to the number of images I can resize?', a: 'There are no limits. You can resize as many photos as you need without signup or subscriptions.' }
    ]
  },
  {
    path: 'background-remover',
    title: 'Background Remover Online Free – Remove Image Background Instantly (Transparent PNG)',
    description: 'Remove image background online for free. Get transparent PNG cutouts for logos, products, and passport photos. Replace background with white, transparent, or custom color. 100% in-browser, no upload.',
    keywords: 'background remover online free, remove image background, transparent background png, erase background from photo, passport photo white background, remove bg free alternative, omnitasker background remover',
    category: 'UtilityApplication',
    h1: 'Background Remover – Create Transparent PNG Cutouts Online Free',
    summary: 'Effortlessly extract subjects and erase backgrounds from product photos, logos, avatars, and signatures. Replace cluttered backgrounds with clean transparency, studio white, or custom solid colors.',
    steps: [
      { title: 'Upload Photo', desc: 'Select any product shot, portrait, or logo.' },
      { title: 'Adjust Chroma & Threshold', desc: 'Fine-tune color sensitivity, edge feathering, and tolerance to get razor-sharp subject outlines.' },
      { title: 'Download Transparent PNG', desc: 'Save your cutout with transparent alpha channel ready for marketing graphics, slides, or websites.' }
    ],
    features: [
      'Transparent Alpha Cutouts: Exports official transparent 32-bit PNG files.',
      'Custom Background Fills: Replace erased backgrounds with white, black, or custom hex colors.',
      'Adjustable Edge Tolerance: Dial in the exact color isolation threshold for complex edges.',
      'No Server Latency: Processes graphics instantly on your device GPU/CPU.'
    ],
    faqs: [
      { q: 'How do I make a transparent background for e-commerce products?', a: 'Upload your product image, set the background to Transparent, adjust edge tolerance until shadows are cleared, and click Download PNG.' },
      { q: 'Can I change a passport photo background to plain white or blue?', a: 'Yes! Select the Solid Color option, pick white (#FFFFFF) or passport blue (#004080), and export your compliant portrait.' }
    ]
  },
  {
    path: 'compress-image',
    title: 'Image Compressor Online Free – Compress PNG, JPG, WebP Under 20KB 50KB 100KB',
    description: 'Compress images online for free to any KB target. Reduce PNG, JPG, and WebP file size under 20KB, 50KB, 100KB, or 200KB without losing quality. Perfect for government portals, email attachments, and web uploads.',
    keywords: 'image compressor online free, compress png to 20kb, reduce jpg file size, compress image under 50kb, compress photo for government portal, tinypng alternative free, compress webp online, omnitasker image compressor',
    category: 'UtilityApplication',
    h1: 'Image Compressor – Reduce Image Size in KB Without Quality Loss',
    summary: 'Drastically reduce image file sizes for websites, email attachments, and government application portals. Features intelligent lossy and lossless quantization that preserves visual clarity while slashing file weight by up to 85%.',
    steps: [
      { title: 'Upload Image File', desc: 'Select JPG, PNG, or WebP images of any initial resolution.' },
      { title: 'Select Target KB or Slider', desc: 'Choose target presets (Under 20KB, 50KB, 100KB, 200KB) or use the manual quality slider.' },
      { title: 'Compare & Download', desc: 'Inspect side-by-side file size reduction statistics and download your compressed graphic.' }
    ],
    features: [
      'Target KB Precision: Enforce exact maximum file sizes required by job portals and university admission forms.',
      'High Compression Ratio: Shrink 5MB camera photos down to 100KB with imperceptible visual difference.',
      'Format Versatility: Compresses JPEG, PNG, and WebP formats.',
      'Zero Cloud Uploads: Entire compression engine runs locally inside your browser.'
    ],
    faqs: [
      { q: 'How does OmniTasker compress images without making them blurry?', a: 'Our compressor strips unnecessary EXIF metadata, color profile headers, and uses optimized discrete cosine transform (DCT) quantization matrices that preserve edge contrast.' },
      { q: 'How can I compress an image to under 50KB for government application forms?', a: 'Select the "Under 50 KB" preset. Our binary search optimizer calculates the exact quality parameter to ensure the file size is below 50KB.' }
    ]
  },
  {
    path: 'pdf-maker',
    title: 'PDF Maker Online Free – Convert Images to PDF (JPG PNG to PDF, A4)',
    description: 'Create PDF from images online free. Combine multiple JPG, PNG, or WebP photos into a single organized PDF with A4 or Letter page size. Drag, reorder pages, and download instantly. No upload required.',
    keywords: 'pdf maker online free, jpg to pdf converter, images to pdf, png to pdf, create pdf from photos free, combine images into pdf, omnitasker pdf maker',
    category: 'UtilityApplication',
    h1: 'PDF Maker – Convert Multiple Images (JPG, PNG) to PDF Free',
    summary: 'Assemble receipts, invoices, photo albums, or book scans into a consolidated, professional PDF document. Features intuitive drag-and-drop page reordering, margin adjustments, and standard paper sizing.',
    steps: [
      { title: 'Upload Multiple Images', desc: 'Select or drag multiple JPG, PNG, or WebP images into the organizer.' },
      { title: 'Reorder & Configure Page Setup', desc: 'Rearrange pages, choose orientation (Portrait or Landscape), and set page margins.' },
      { title: 'Generate & Save PDF', desc: 'Compile all images into a unified, lightweight PDF ready for sharing.' }
    ],
    features: [
      'Multi-Image Compilation: Combine dozens of photos into one organized PDF file.',
      'Drag & Drop Reordering: Arrange pages with visual thumbnails and move controls.',
      'Standardized Sizing: Auto-scales images to fit standard A4, Letter, or fit-to-image dimensions.',
      '100% In-Browser: Your private photos and receipts never leave your device.'
    ],
    faqs: [
      { q: 'Can I combine both JPG and PNG files into the same PDF?', a: 'Yes! You can mix and match JPG, PNG, and WebP files. OmniTasker normalizes each image into clean PDF pages.' },
      { q: 'How do I rearrange the order of pages before downloading?', a: 'Use the arrow buttons on each image card to move pages up or down in the sequence.' }
    ]
  },
  {
    path: 'pdf-compressor',
    title: 'PDF Compressor Online Free – Reduce PDF File Size Without Losing Quality',
    description: 'Compress PDF files online for free. Reduce PDF size for email, WhatsApp, and government portal uploads. Shrinks PDF from MB to KB without degrading text quality. Client-side — no file upload.',
    keywords: 'pdf compressor online free, reduce pdf file size, compress pdf to 1mb, compress pdf without losing quality, shrink pdf for email, compress pdf for whatsapp, omnitasker pdf compressor',
    category: 'UtilityApplication',
    h1: 'PDF Compressor – Shrink PDF File Size Online Free',
    summary: 'Reduce heavy PDF document file sizes by downsampling embedded images and removing redundant font descriptors. Easily bypass email attachment limits (25MB) and government portal upload ceilings.',
    steps: [
      { title: 'Select PDF Document', desc: 'Drop any oversized PDF document into the compression engine.' },
      { title: 'Choose Compression Strength', desc: 'Select Extreme, Recommended, or Light compression depending on whether file size or graphic sharpness is your priority.' },
      { title: 'Download Compact PDF', desc: 'Save your compressed PDF with significant megabyte savings.' }
    ],
    features: [
      'Multi-Level Optimization: Choose between Extreme (max space saving) and Recommended (balanced quality).',
      'Text Sharpness Preservation: Compresses embedded bitmap artwork while maintaining crisp vector fonts.',
      'Fast Client-Side Execution: Uses local WebAssembly canvas rendering without server queues.',
      'Absolute Privacy: Perfect for confidential contracts, bank statements, and tax returns.'
    ],
    faqs: [
      { q: 'Will compressing my PDF make text unreadable?', a: 'No. Vector fonts, links, and text layers remain razor sharp. Only heavy embedded photos are optimized.' },
      { q: 'What is the best setting to send PDFs via email?', a: 'The Recommended compression level typically reduces PDF sizes by 50-70%, making them ideal for Gmail, Outlook, and WhatsApp.' }
    ]
  },
  {
    path: 'merge-pdf',
    title: 'Merge PDF Online Free – Combine Multiple PDF Files into One (No Upload)',
    description: 'Merge multiple PDF files into one document online for free. Drag and drop, reorder pages with arrows, and download a combined PDF instantly. 100% client-side — your files never leave your browser.',
    keywords: 'merge pdf online free, combine pdf files, join pdf pages, merge multiple pdfs, pdf merger free, combine pdf documents without upload, omnitasker merge pdf',
    category: 'UtilityApplication',
    h1: 'Merge PDF – Combine Multiple PDF Documents into One File',
    summary: 'Merge distinct PDF files, chapters, or legal filings into a single organized document. OmniTasker runs pdf-lib client-side to merge document streams without corrupting metadata or re-compressing pages.',
    steps: [
      { title: 'Add PDF Files', desc: 'Select or drop two or more PDF files you wish to merge.' },
      { title: 'Arrange Document Order', desc: 'Use the move up/down controls to sequence your files in the exact desired page order.' },
      { title: 'Combine & Download', desc: 'Click Merge to generate and download a single consolidated PDF document.' }
    ],
    features: [
      'Seamless Vector Merging: Concatenates PDF byte trees directly without rasterizing pages.',
      'Reorderable File List: Easily sort and delete files before binding.',
      'No Page Restrictions: Merge documents containing hundreds of pages without subscription blocks.',
      '100% Client-Side: Zero server transfers for maximum security.'
    ],
    faqs: [
      { q: 'Does merging PDFs reduce the quality of the pages?', a: 'Not at all. The internal page objects, vector graphics, and text fonts are preserved bit-for-bit from the original documents.' },
      { q: 'Can I merge password-protected PDFs?', a: 'You must unlock password-protected files before merging so our browser engine can read their page structures.' }
    ]
  },
  {
    path: 'qr-generator',
    title: 'QR Code Generator Free Online – Custom Color QR Codes (PNG & SVG Download)',
    description: 'Generate custom QR codes online for free. Create colored QR codes for website URLs, UPI payments, WiFi passwords, and more. Download as high-resolution PNG or vector SVG. No signup required.',
    keywords: 'qr code generator free, custom qr code maker, colored qr code online, qr code for upi payment, wifi qr code generator, svg qr code download, omnitasker qr code',
    category: 'UtilityApplication',
    h1: 'Custom QR Code Generator – URL, UPI, WiFi & Text (PNG & SVG)',
    summary: 'Create high-resolution, branded QR codes for product packaging, menus, business cards, and marketing collateral. Customize foreground and background colors, adjust error correction levels, and export in crisp PNG or scalable vector SVG.',
    steps: [
      { title: 'Choose Content Type', desc: 'Select Website URL, Plain Text, UPI Payment, or WiFi Network configuration.' },
      { title: 'Customize Colors & Size', desc: 'Pick your brand palette colors, select pixel size (up to 1024px), and set error correction levels.' },
      { title: 'Export PNG or SVG', desc: 'Download instant high-resolution PNG for digital use or vector SVG for professional print.' }
    ],
    features: [
      'Versatile Formats: Supports URLs, UPI Indian payment links, WiFi auto-connect credentials, and vCards.',
      'Dual Vector & Raster Export: Download 300+ DPI PNG or infinite-resolution SVG vectors.',
      'Custom Brand Colors: Freely set foreground and background hex hues with automatic contrast indicators.',
      'Never Expiring: All QR codes generated are static and work forever without tracking redirects or fees.'
    ],
    faqs: [
      { q: 'Do the generated QR codes expire?', a: 'No! OmniTasker creates permanent, direct static QR codes. The encoded data is etched directly into the pattern and will work forever.' },
      { q: 'Can I print these QR codes on large billboards and posters?', a: 'Yes. Download the SVG vector format, which scales infinitely to any billboard or banner size without pixelation.' }
    ]
  },
  {
    path: 'json-formatter',
    title: 'JSON Formatter & Validator Online Free – Beautify, Minify & Validate JSON',
    description: 'Format, validate, and inspect JSON online for free. Beautify minified JSON, minify large JSON, sort keys alphabetically, and detect syntax errors with line-accurate diagnostics. Dual-pane editor.',
    keywords: 'json formatter online free, beautify json, validate json, minify json, format json string, json syntax validator, omnitasker json formatter',
    category: 'UtilityApplication',
    h1: 'JSON Formatter & Validator – Beautify, Minify & Inspect JSON Code',
    summary: 'The ultimate browser-based JSON utility for software engineers, API developers, and data analysts. Effortlessly beautify messy minified JSON, validate syntactical correctness, sort object keys, and strip whitespace with single-click precision.',
    steps: [
      { title: 'Paste or Upload JSON', desc: 'Paste raw JSON text, upload a .json file, or load sample data into the input editor.' },
      { title: 'Select Transformation', desc: 'Choose 2-space beautification, 4-space indent, minification, or alphabetical key sorting.' },
      { title: 'Validate & Copy', desc: 'Inspect syntax error highlights, copy formatted output to clipboard, or download as a .json file.' }
    ],
    features: [
      'Line-Accurate Syntax Diagnostics: Pinpoints missing commas, unquoted keys, or bracket mismatches instantly.',
      '2-Space & 4-Space Beautification: Formats dense payloads into clean, readable hierarchical trees.',
      'Production Minification: Removes all whitespace and line breaks to compress payload sizes for APIs.',
      'Alphabetical Key Sorting: Normalizes JSON object keys for easier side-by-side diffing.'
    ],
    faqs: [
      { q: 'Is it safe to paste confidential API keys or customer JSON payloads here?', a: 'Yes. All parsing, validation, and formatting execute 100% locally in your browser memory. No data is sent over the network.' },
      { q: 'Can this tool repair broken JSON strings?', a: 'Our validator shows you the exact line number and character offset of syntax errors so you can quickly fix missing quotes or trailing commas.' }
    ]
  },
  {
    path: 'about',
    title: 'About OmniTasker – Free Online Utility & File Converter Tool Hub',
    description: 'Learn about OmniTasker - A Free Online Utility & File Converter Tool Hub offering 100% private in-browser tools with zero server uploads.',
    keywords: 'about omnitasker, free online tools, private file converter, in browser tools, omnitasker team',
    type: 'AboutPage',
    h1: 'About OmniTasker – Free, Private Online Utilities',
    summary: 'OmniTasker (omnitasker.co.in) is a free web-based utility hub built to simplify everyday digital tasks. Whether you need to convert an Excel spreadsheet into a presentation-ready PDF, transform a PDF into an editable Word document, resize photos for government exam portals, remove image backgrounds, or validate developer JSON code, OmniTasker delivers fast, professional results in seconds.',
    steps: [
      { title: '100% In-Browser Execution', desc: 'Conversions and image manipulations execute directly inside browser memory via HTML5 Canvas, Web Workers, and WebAssembly. No files ever leave your device.' },
      { title: 'No Sign-Up or Paywalls', desc: 'Every tool is completely free with no account creation, no subscription tiers, and no hidden limitations.' },
      { title: 'Continuous Curation & Standards', desc: 'We actively maintain official government exam presets, update conversion algorithms, and support the latest open file specifications.' }
    ],
    features: [
      'Zero Cloud Upload Architecture for complete privacy',
      'Fast, client-side rendering with no queue wait times',
      'Responsive design optimized for mobile, tablet, and desktop',
      'Regular feature releases and responsive support at omnitasker98@gmail.com'
    ],
    faqs: [
      { q: 'Who operates OmniTasker?', a: 'OmniTasker is maintained by an independent development team dedicated to building high-quality, privacy-first web utilities.' },
      { q: 'How is OmniTasker funded if all tools are free?', a: 'OmniTasker is supported by ethical, non-intrusive online advertisements through Google AdSense.' }
    ]
  },
  {
    path: 'contact',
    title: 'Contact Us – OmniTasker Support & Inquiries',
    description: 'Contact the OmniTasker team for technical support, feature requests, partnership inquiries, or feedback. We respond within 24-48 business hours.',
    keywords: 'contact omnitasker, omnitasker support, report bug omnitasker, email omnitasker',
    type: 'ContactPage',
    h1: 'Contact OmniTasker Support',
    summary: 'Have a question about one of our conversion tools, want to request an official exam preset, or noticed an issue? The OmniTasker team is here to assist you.',
    steps: [
      { title: 'Official Email Support', desc: 'Reach our direct support inbox at omnitasker98@gmail.com for priority assistance.' },
      { title: 'Response Timeline', desc: 'Our technical team reviews and responds to all inquiries within 24 to 48 business hours.' },
      { title: 'Feature Suggestions & Feedback', desc: 'We actively implement user-requested document tools, image filters, and exam dimension presets.' }
    ],
    features: [
      'Direct Support Email: omnitasker98@gmail.com',
      'Operating Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST',
      'Support for bugs, feature requests, and partnership opportunities'
    ],
    faqs: [
      { q: 'How quickly can I expect a response?', a: 'Most inquiries are answered within 24 hours during standard business days.' },
      { q: 'How do I report an issue with a document conversion?', a: 'Send an email to omnitasker98@gmail.com describing your file type, browser version, and the error encountered.' }
    ]
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy – OmniTasker (100% In-Browser & Zero Server Uploads)',
    description: 'OmniTasker Privacy Policy: Learn how our 100% client-side architecture protects your documents. Full disclosures on cookies, analytics, and Google AdSense compliance.',
    keywords: 'omnitasker privacy policy, client side privacy, zero upload privacy, adsense cookie disclosure',
    type: 'WebPage',
    h1: 'OmniTasker Privacy Policy',
    summary: 'OmniTasker operates with a zero-server-upload architecture. Your documents, PDFs, Excel sheets, and photos are processed directly in your browser memory and are never transmitted to, stored on, or inspected by our servers.',
    steps: [
      { title: 'Zero Cloud Upload Guarantee', desc: 'Files you process with OmniTasker are read into your device RAM using client-side WebAssembly, Canvas, and JavaScript APIs. They are never transmitted over the internet.' },
      { title: 'Third-Party Advertising Disclosures', desc: 'We partner with Google AdSense to serve ads. Google may use cookies to serve personalized ads based on visits to this and other websites.' },
      { title: 'User Rights & Contact', desc: 'You have full control over your browser cookies and data. For questions regarding our privacy practices, contact omnitasker98@gmail.com.' }
    ],
    features: [
      'Client-side data processing with zero cloud storage',
      'Full compliance with Google AdSense Publisher Policies',
      'No account creation or collection of personal passwords'
    ],
    faqs: [
      { q: 'Does OmniTasker save copies of my uploaded files?', a: 'No. Files are processed entirely in your web browser memory and destroyed when you close the tab.' },
      { q: 'How does Google AdSense use cookies on this site?', a: 'Google AdSense uses cookies to serve ads based on user visits to this and other websites on the internet.' }
    ]
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service – OmniTasker Free Online Tools',
    description: 'OmniTasker Terms of Service: Read our terms governing the use of our free web utilities, user responsibilities, and intellectual property.',
    keywords: 'omnitasker terms of service, terms and conditions, acceptable use policy',
    type: 'WebPage',
    h1: 'OmniTasker Terms of Service',
    summary: 'By accessing or using OmniTasker (omnitasker.co.in), you agree to be bound by these Terms of Service. OmniTasker provides free browser-based digital utilities on an "as-is" and "as-available" basis.',
    steps: [
      { title: 'Acceptable Use Policy', desc: 'You agree to use OmniTasker tools for lawful purposes only and not to attempt any reverse-engineering or security disruption.' },
      { title: 'Intellectual Property', desc: 'You retain full and complete ownership of all files, documents, and images processed through our tools.' },
      { title: 'Disclaimer of Warranties', desc: 'All tools are provided without warranties of any kind. Users should verify critical documents before official submission.' }
    ],
    features: [
      'Free, non-commercial and commercial usage allowed',
      'You retain 100% intellectual property ownership of your files',
      'Clear acceptable use guidelines protecting user safety'
    ],
    faqs: [
      { q: 'Can I use OmniTasker for commercial business files?', a: 'Yes. You are free to use OmniTasker for personal, academic, and commercial business document tasks.' },
      { q: 'Do I need to give attribution to OmniTasker?', a: 'Attribution is appreciated but not required.' }
    ]
  }
]

function buildPageHtml(page) {
  const stepsHtml = (page.steps || [])
    .map(
      (s, i) => `
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-bottom: 12px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-top: 0; margin-bottom: 6px;">Step ${i + 1}: ${s.title}</h3>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">${s.desc}</p>
        </div>`
    )
    .join('')

  const featuresHtml = (page.features || [])
    .map(
      f => `
        <li style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 8px;">
          <strong style="color: #38bdf8;">✓</strong> ${f}
        </li>`
    )
    .join('')

  const faqsHtml = (page.faqs || [])
    .map(
      faq => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-bottom: 12px;">
          <h4 style="font-size: 15px; font-weight: 700; color: #f1f5f9; margin-top: 0; margin-bottom: 8px;">${faq.q}</h4>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">${faq.a}</p>
        </div>`
    )
    .join('')

  return `
    <header style="background: #090d16; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto;">
      <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; font-weight: 800; font-size: 20px;">
        <span style="background: linear-gradient(135deg, #6366f1, #10b981); color: #fff; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 16px;">O</span>
        OmniTasker
      </a>
      <nav style="display: flex; gap: 18px; font-size: 14px;">
        <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a>
        <a href="/pdf-to-word" style="color: #cbd5e1; text-decoration: none;">PDF to Word</a>
        <a href="/excel-to-pdf" style="color: #cbd5e1; text-decoration: none;">Excel to PDF</a>
        <a href="/govt-exam-photo-resizer" style="color: #cbd5e1; text-decoration: none;">Exam Resizer</a>
        <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact</a>
      </nav>
    </header>

    <main style="max-width: 900px; margin: 32px auto; padding: 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="display: inline-block; padding: 4px 12px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 999px; font-size: 12px; font-weight: 600; color: #818cf8; margin-bottom: 12px;">
          100% Free & In-Browser Utility
        </span>
        <h1 style="font-size: 32px; font-weight: 800; color: #f8fafc; margin-top: 0; margin-bottom: 14px; line-height: 1.25;">
          ${page.h1 || page.title}
        </h1>
        <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; max-width: 780px; margin: 0 auto;">
          ${page.summary || page.description}
        </p>
      </div>

      <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 36px; text-align: center;">
        <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 16px 0;">Interactive tool is loading in your browser…</p>
        <div style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #4f46e5, #06b6d4); color: #fff; font-weight: 700; border-radius: 10px; font-size: 14px;">
          Launch Interactive Tool
        </div>
      </div>

      <section style="margin-bottom: 36px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 18px;">
          How to Use This Tool Step-by-Step
        </h2>
        <div>
          ${stepsHtml}
        </div>
      </section>

      <section style="margin-bottom: 36px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 18px;">
          Key Capabilities & Privacy Advantages
        </h2>
        <ul style="list-style: none; padding-left: 0; margin: 0;">
          ${featuresHtml}
        </ul>
      </section>

      <section style="margin-bottom: 36px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 18px;">
          Frequently Asked Questions
        </h2>
        <div>
          ${faqsHtml}
        </div>
      </section>

      <section style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 14px; padding: 20px; margin-bottom: 36px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #34d399; margin-top: 0; margin-bottom: 8px;">
          🔒 100% In-Browser Privacy Guarantee
        </h3>
        <p style="font-size: 14px; color: #a7f3d0; line-height: 1.6; margin: 0;">
          OmniTasker guarantees that all files, documents, photographs, and spreadsheets processed using this utility remain entirely in your device's browser memory. Zero bytes are uploaded to remote cloud servers or third-party databases.
        </p>
      </section>
    </main>

    <footer style="background: #090d16; border-top: 1px solid rgba(255,255,255,0.1); padding: 32px 20px; text-align: center; font-size: 13px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <p style="margin-bottom: 12px; color: #94a3b8;">
        © 2026 OmniTasker. Free, private, client-side digital utilities.
      </p>
      <div style="display: flex; justify-content: center; gap: 18px; flex-wrap: wrap;">
        <a href="/" style="color: #94a3b8; text-decoration: none;">Home</a>
        <a href="/about" style="color: #94a3b8; text-decoration: none;">About</a>
        <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact Support</a>
        <a href="/privacy-policy" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a>
        <a href="/terms-of-service" style="color: #94a3b8; text-decoration: none;">Terms of Service</a>
      </div>
      <p style="margin-top: 14px; font-size: 12px; color: #475569;">
        Support inquiries: omnitasker98@gmail.com
      </p>
    </footer>`
}

function generate() {
  const templatePath = path.join(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run "vite build" first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8')
  console.log(`Generating ${PAGES.length} static SEO & Content-Rich entrypoints in dist/...`)

  for (const page of PAGES) {
    let html = baseHtml
    const pageUrl = `https://omnitasker.co.in/${page.path}`

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

    // 7. Inject rich body content into <div id="root">
    const richContent = buildPageHtml(page)
    html = html.replace('<div id="root"></div>', `<div id="root">${richContent}</div>`)

    // 8. Write to dist/<path>/index.html
    const targetDir = path.join(distDir, page.path)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8')
    console.log(`  ✓ Created dist/${page.path}/index.html with rich editorial content`)
  }

  // Also enhance root dist/index.html with rich homepage content
  const homeRichHtml = `
    <header style="background: #090d16; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto;">
      <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; font-weight: 800; font-size: 20px;">
        <span style="background: linear-gradient(135deg, #6366f1, #10b981); color: #fff; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 16px;">O</span>
        OmniTasker
      </a>
      <nav style="display: flex; gap: 18px; font-size: 14px;">
        <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a>
        <a href="/pdf-to-word" style="color: #cbd5e1; text-decoration: none;">PDF to Word</a>
        <a href="/excel-to-pdf" style="color: #cbd5e1; text-decoration: none;">Excel to PDF</a>
        <a href="/govt-exam-photo-resizer" style="color: #cbd5e1; text-decoration: none;">Govt Resizer</a>
        <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact</a>
      </nav>
    </header>

    <main style="max-width: 1000px; margin: 32px auto; padding: 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
      <div style="text-align: center; margin-bottom: 40px;">
        <span style="display: inline-block; padding: 4px 12px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); border-radius: 999px; font-size: 12px; font-weight: 600; color: #34d399; margin-bottom: 12px;">
          ⚡ 100% Free & Private Online Utilities
        </span>
        <h1 style="font-size: 36px; font-weight: 900; color: #f8fafc; margin-top: 0; margin-bottom: 16px; line-height: 1.2;">
          OmniTasker – Free Online Document, PDF & Image Utilities
        </h1>
        <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; max-width: 760px; margin: 0 auto;">
          The private, all-in-one browser utility platform. Convert PDF to Word, Word to PDF, Excel to PDF, resize photos for official government exams (UPSC, SSC, GATE, IBPS, NEET), compress images, remove backgrounds, merge PDFs, generate QR codes, and format JSON — completely in your browser with zero server uploads.
        </p>
      </div>

      <section style="margin-bottom: 48px;">
        <h2 style="font-size: 24px; font-weight: 800; color: #f1f5f9; margin-bottom: 20px; text-align: center;">
          Available Online Utilities & Converters
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <a href="/pdf-to-word" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #38bdf8; margin: 0 0 6px 0;">PDF to Word Converter →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Extract text, headings, and formatting from any PDF into an editable .docx file.</p>
          </a>
          <a href="/word-to-pdf" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #818cf8; margin: 0 0 6px 0;">Word to PDF Converter →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Convert Word (.docx) files into print-ready standard A4 PDF documents.</p>
          </a>
          <a href="/excel-to-pdf" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #34d399; margin: 0 0 6px 0;">Excel to PDF Converter →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Turn XLSX, XLS, and CSV spreadsheets into formatted table reports.</p>
          </a>
          <a href="/govt-exam-photo-resizer" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #f59e0b; margin: 0 0 6px 0;">Govt Exam Photo Resizer →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">1-Click presets for UPSC, SSC, GATE, IBPS, and NEET candidate photos and signatures.</p>
          </a>
          <a href="/image-resizer" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #2dd4bf; margin: 0 0 6px 0;">Custom Image Resizer →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Scale photos to specific pixels, cm, or inches with aspect ratio lock.</p>
          </a>
          <a href="/background-remover" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #ec4899; margin: 0 0 6px 0;">AI Background Remover →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Erase backgrounds and export transparent PNGs or clean white backgrounds.</p>
          </a>
          <a href="/compress-image" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #a855f7; margin: 0 0 6px 0;">Image Compressor →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Compress JPG, PNG, and WebP under 20KB, 50KB, or 100KB without quality loss.</p>
          </a>
          <a href="/pdf-maker" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #f43f5e; margin: 0 0 6px 0;">Images to PDF Maker →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Combine multiple photos, receipts, or scans into a single A4 PDF.</p>
          </a>
          <a href="/pdf-compressor" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #eab308; margin: 0 0 6px 0;">PDF Compressor →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Shrink heavy PDF files from megabytes to kilobytes for email and job portals.</p>
          </a>
          <a href="/merge-pdf" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #06b6d4; margin: 0 0 6px 0;">Merge PDF Files →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Join multiple PDF files into one ordered document with page reordering.</p>
          </a>
          <a href="/qr-generator" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #6366f1; margin: 0 0 6px 0;">Custom QR Generator →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Create colored QR codes for websites, UPI payments, and WiFi in PNG or SVG.</p>
          </a>
          <a href="/json-formatter" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-decoration: none; color: inherit; display: block;">
            <h3 style="font-size: 17px; font-weight: 700; color: #10b981; margin: 0 0 6px 0;">JSON Formatter & Validator →</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Beautify, minify, sort keys, and diagnose syntax errors with line-accurate precision.</p>
          </a>
        </div>
      </section>

      <section style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 28px; margin-bottom: 40px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin-top: 0; margin-bottom: 14px;">
          Why OmniTasker?
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #34d399; margin: 0 0 6px 0;">🔒 100% In-Browser Privacy</h3>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">Your files are processed directly in your browser memory using WebAssembly and HTML5 Canvas. Zero bytes are uploaded to remote servers.</p>
          </div>
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #38bdf8; margin: 0 0 6px 0;">⚡ Zero Server Queue Delay</h3>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">No waiting in slow upload or conversion queues. Processing happens at full hardware speed directly on your computer or mobile device.</p>
          </div>
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #a855f7; margin: 0 0 6px 0;">✨ 100% Free Forever</h3>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">No subscription paywalls, no daily limits, and no account creation. Access every tool instantly whenever you need it.</p>
          </div>
        </div>
      </section>
    </main>

    <footer style="background: #090d16; border-top: 1px solid rgba(255,255,255,0.1); padding: 32px 20px; text-align: center; font-size: 13px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <p style="margin-bottom: 12px; color: #94a3b8;">
        © 2026 OmniTasker. Free, private, client-side digital utilities.
      </p>
      <div style="display: flex; justify-content: center; gap: 18px; flex-wrap: wrap;">
        <a href="/" style="color: #94a3b8; text-decoration: none;">Home</a>
        <a href="/about" style="color: #94a3b8; text-decoration: none;">About</a>
        <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact Support</a>
        <a href="/privacy-policy" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a>
        <a href="/terms-of-service" style="color: #94a3b8; text-decoration: none;">Terms of Service</a>
      </div>
      <p style="margin-top: 14px; font-size: 12px; color: #475569;">
        Support inquiries: omnitasker98@gmail.com
      </p>
    </footer>`

  const rootIndex = path.join(distDir, 'index.html')
  let rootHtml = fs.readFileSync(rootIndex, 'utf8')
  rootHtml = rootHtml.replace('<div id="root"></div>', `<div id="root">${homeRichHtml}</div>`)
  fs.writeFileSync(rootIndex, rootHtml, 'utf8')
  console.log('  ✓ Enhanced dist/index.html with rich homepage content')

  console.log(`\nAll ${PAGES.length} static SEO & Content-Rich entrypoints generated successfully!`)
}

generate()
