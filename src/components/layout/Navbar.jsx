import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Image,
  FileText,
  Code2,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Home,
  CheckCircle2,
} from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Govt Exams & Image',
    icon: Image,
    items: [
      {
        name: 'Govt Exam Photo & Sign Resizer',
        desc: 'UPSC, SSC CGL, GATE, Bank 1-click auto-ready',
        path: '/govt-exam-photo-resizer',
        badge: 'Official Specs',
      },
      {
        name: 'Custom Image Resizer & Crop',
        desc: 'Custom dimensions, aspect ratio lock & formats',
        path: '/image-resizer',
        badge: 'Precision',
      },
      {
        name: 'Background Remover',
        desc: '1-Click transparent PNG & passport white bg',
        path: '/background-remover',
        badge: 'AI Cutout',
      },
      {
        name: 'Image Compressor & KB Reducer',
        desc: 'Compress to under 20KB, 50KB, 100KB, 200KB',
        path: '/compress-image',
        badge: 'Popular',
      },
    ],
  },
  {
    name: 'PDF & Documents',
    icon: FileText,
    items: [
      {
        name: 'PDF to Word Converter',
        desc: 'Extract text from PDF into editable .docx',
        path: '/pdf-to-word',
        badge: 'Editable',
      },
      {
        name: 'Word to PDF Converter',
        desc: 'Transform DOCX into clean A4 PDF',
        path: '/word-to-pdf',
        badge: 'Clean PDF',
      },
      {
        name: 'Excel to PDF Converter',
        desc: 'Convert .xlsx / .xls / .csv to PDF tables',
        path: '/excel-to-pdf',
        badge: 'New ✨',
      },
      {
        name: 'PDF Maker (Images to PDF)',
        desc: 'Combine photos & scans into paginated PDF',
        path: '/pdf-maker',
        badge: 'Multi-Page',
      },
      {
        name: 'PDF Compressor',
        desc: 'Shrink PDF file size without losing quality',
        path: '/pdf-compressor',
        badge: 'Shrink KB',
      },
      {
        name: 'Merge PDF Documents',
        desc: 'Combine & reorder multiple PDFs client-side',
        path: '/merge-pdf',
        badge: '100% Private',
      },
    ],
  },
  {
    name: 'Dev Tools',
    icon: Code2,
    items: [
      {
        name: 'Custom QR Code Generator',
        desc: 'Generate colored vector SVG & high-res PNG QRs',
        path: '/qr-generator',
        badge: 'Vector SVG',
      },
      {
        name: 'JSON Formatter & Validator',
        desc: 'Beautify, minify, sort keys & validate JSON AST',
        path: '/json-formatter',
        badge: 'Validator',
      },
    ],
  },
]

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef(null)
  const timeoutRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMouseEnter = (catName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(catName)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/95 border-b border-white/10 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo + Home Link on Left */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              title="OmniTasker Home"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)' }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-100 group-hover:text-white transition-colors flex items-center gap-1.5">
                  Omni<span className="gradient-text">Tasker</span>
                  <span className="text-[10px] font-sans font-semibold tracking-normal px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden xs:inline-block">
                    Free
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 hidden sm:block tracking-wide">
                  Fast, Secure &amp; 100% In-Browser
                </span>
              </div>
            </Link>

            {/* Direct Home Icon Button */}
            <Link
              to="/"
              className="ml-1 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
              title="Go to Homepage"
              aria-label="OmniTasker Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* Desktop Nav Categories */}
          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isOpen = activeDropdown === cat.name
              const isCatActive = cat.items.some(
                (item) => location.pathname === item.path
              )

              return (
                <div
                  key={cat.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : cat.name)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isCatActive
                        ? 'text-white bg-white/10 shadow-sm border border-white/15'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                    <span>{cat.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-400' : 'text-slate-500'
                      }`}
                    />
                  </button>

                  {/* Dropdown Panel */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/95 p-3 z-50 animate-slide-up ring-1 ring-white/10 before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5 flex items-center justify-between border-b border-white/10 mb-1.5 pb-2">
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-emerald-400 font-normal">100% Free</span>
                      </div>
                      <div className="space-y-1">
                        {cat.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex flex-col p-2.5 rounded-xl transition-all ${
                              location.pathname === item.path
                                ? 'bg-brand-500/25 border border-brand-500/40 text-white shadow-sm'
                                : 'hover:bg-slate-800 text-slate-200 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-slate-100">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Direct Quick Nav Links */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === '/about'
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === '/contact'
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <Link
              to="/govt-exam-photo-resizer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-md shadow-brand-500/20"
            >
              <span>🇮🇳 Govt Exam Resizer</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-semibold">1-Click</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950 px-4 py-5 space-y-5 animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* Quick Home Mobile Link */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold"
          >
            <Home className="w-4 h-4 text-brand-400" />
            <span>OmniTasker Home</span>
          </Link>

          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                <cat.icon className="w-4 h-4 text-brand-400" />
                <span>{cat.name}</span>
              </div>
              <div className="space-y-1 pl-2">
                {cat.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-brand-500/20 text-brand-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`
                    }
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Company links in mobile drawer */}
          <div className="border-t border-white/10 pt-4 space-y-1">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs text-slate-400 hover:text-white"
            >
              About OmniTasker
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs text-slate-400 hover:text-white"
            >
              Contact Support
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs text-slate-400 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs text-slate-400 hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
