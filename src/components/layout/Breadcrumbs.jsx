import { Link, useLocation } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

// Route-to-metadata mapping for breadcrumbs
const ROUTE_CONFIG = {
  '/pdf-to-word': { name: 'PDF to Word Converter', category: 'PDF & Documents' },
  '/word-to-pdf': { name: 'Word to PDF Converter', category: 'PDF & Documents' },
  '/excel-to-pdf': { name: 'Excel to PDF Converter', category: 'PDF & Documents' },
  '/pdf-maker': { name: 'PDF Maker (Images to PDF)', category: 'PDF & Documents' },
  '/pdf-compressor': { name: 'PDF Compressor', category: 'PDF & Documents' },
  '/merge-pdf': { name: 'Merge PDF Documents', category: 'PDF & Documents' },
  '/govt-exam-photo-resizer': { name: 'Govt Exam Photo & Sign Resizer', category: 'Image Tools' },
  '/image-resizer': { name: 'Custom Image Resizer', category: 'Image Tools' },
  '/background-remover': { name: 'Background Remover', category: 'Image Tools' },
  '/compress-image': { name: 'Image Compressor', category: 'Image Tools' },
  '/qr-generator': { name: 'QR Code Generator', category: 'Dev Tools' },
  '/json-formatter': { name: 'JSON Formatter & Validator', category: 'Dev Tools' },
  '/about': { name: 'About OmniTasker', category: 'Company' },
  '/contact': { name: 'Contact Us', category: 'Support' },
  '/privacy-policy': { name: 'Privacy Policy', category: 'Legal' },
  '/terms-of-service': { name: 'Terms of Service', category: 'Legal' },
}

export default function Breadcrumbs() {
  const location = useLocation()
  const path = location.pathname.toLowerCase()

  // Do not render breadcrumbs on home page
  if (path === '/' || path === '') return null

  const routeInfo = ROUTE_CONFIG[path] || {
    name: path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    category: 'Tools',
  }

  // Schema.org BreadcrumbList for Google Search Console & Rich Results
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://omnitasker.co.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: routeInfo.category,
        item: `https://omnitasker.co.in/#${routeInfo.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: routeInfo.name,
        item: `https://omnitasker.co.in${path}`,
      },
    ],
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-sm"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400">
          <li className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-white transition-colors text-slate-400 group"
              title="Return to OmniTasker Home"
            >
              <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
              <span className="font-medium">Home</span>
            </Link>
          </li>

          <li className="flex items-center text-slate-600">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>

          <li className="flex items-center">
            <span className="text-slate-400 font-medium">
              {routeInfo.category}
            </span>
          </li>

          <li className="flex items-center text-slate-600">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>

          <li className="flex items-center text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {routeInfo.name}
          </li>
        </ol>
      </div>
    </nav>
  )
}

