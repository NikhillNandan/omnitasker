import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Breadcrumbs from './components/layout/Breadcrumbs'

// Core landing page loaded directly for instant First Contentful Paint (FCP)
import Home from './pages/Home'

// Route-level code splitting: heavy libraries load on demand
const CompressImage = lazy(() => import('./pages/CompressImage'))
const ResizeImage = lazy(() => import('./pages/ResizeImage'))
const GovtExamPhotoResizer = lazy(() => import('./pages/GovtExamPhotoResizer'))
const BackgroundRemover = lazy(() => import('./pages/BackgroundRemover'))
const PdfToWord = lazy(() => import('./pages/PdfToWord'))
const WordToPdf = lazy(() => import('./pages/WordToPdf'))
const ExcelToPdf = lazy(() => import('./pages/ExcelToPdf'))
const PdfMaker = lazy(() => import('./pages/PdfMaker'))
const PdfCompressor = lazy(() => import('./pages/PdfCompressor'))
const MergePdf = lazy(() => import('./pages/MergePdf'))
const QrGenerator = lazy(() => import('./pages/QrGenerator'))
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'))

// Legal & Trust Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 animate-fade-in">
      <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      <span className="text-xs text-slate-400 font-medium">Loading tool…</span>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* --- Image Tools --- */}
            <Route path="/image-resizer" element={<ResizeImage />} />
            <Route path="/resize-image" element={<Navigate to="/image-resizer" replace />} />
            <Route path="/govt-exam-photo-resizer" element={<GovtExamPhotoResizer />} />
            <Route path="/background-remover" element={<BackgroundRemover />} />
            <Route path="/remove-background" element={<Navigate to="/background-remover" replace />} />
            <Route path="/remove-bg" element={<Navigate to="/background-remover" replace />} />
            <Route path="/compress-image" element={<CompressImage />} />
            <Route path="/image-compressor" element={<Navigate to="/compress-image" replace />} />

            {/* --- PDF & Document Conversion Tools --- */}
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/convert-pdf-to-word" element={<Navigate to="/pdf-to-word" replace />} />
            <Route path="/word-to-pdf" element={<WordToPdf />} />
            <Route path="/convert-word-to-pdf" element={<Navigate to="/word-to-pdf" replace />} />
            <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/xlsx-to-pdf" element={<Navigate to="/excel-to-pdf" replace />} />
            <Route path="/csv-to-pdf" element={<Navigate to="/excel-to-pdf" replace />} />
            <Route path="/pdf-maker" element={<PdfMaker />} />
            <Route path="/images-to-pdf" element={<Navigate to="/pdf-maker" replace />} />
            <Route path="/pdf-compressor" element={<PdfCompressor />} />
            <Route path="/compress-pdf" element={<Navigate to="/pdf-compressor" replace />} />
            <Route path="/pdf-merger" element={<MergePdf />} />
            <Route path="/merge-pdf" element={<MergePdf />} />

            {/* --- Developer Tools --- */}
            <Route path="/qr-generator" element={<QrGenerator />} />
            <Route path="/qr-code-generator" element={<Navigate to="/qr-generator" replace />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/json" element={<Navigate to="/json-formatter" replace />} />

            {/* --- Legal & Trust Pages --- */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
