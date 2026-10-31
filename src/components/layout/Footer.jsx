import { Link } from 'react-router-dom'
import { Sparkles, Shield, Cpu, Lock, Mail } from 'lucide-react'

const TOOL_SECTIONS = [
  {
    title: 'Image Tools',
    links: [
      { name: 'Govt Exam Photo & Sign Resizer', path: '/govt-exam-photo-resizer' },
      { name: 'Custom Image Resizer & Crop', path: '/image-resizer' },
      { name: 'Background Remover & Cutout', path: '/background-remover' },
      { name: 'Compress Image Under 20KB/50KB', path: '/compress-image' },
    ],
  },
  {
    title: 'PDF & Document Tools',
    links: [
      { name: 'PDF to Word Converter (.docx)', path: '/pdf-to-word' },
      { name: 'Word to PDF Converter', path: '/word-to-pdf' },
      { name: 'Excel to PDF Converter', path: '/excel-to-pdf' },
      { name: 'PDF Maker (Images to PDF)', path: '/pdf-maker' },
      { name: 'PDF Compressor & Reducer', path: '/pdf-compressor' },
      { name: 'Merge PDF Documents', path: '/merge-pdf' },
    ],
  },
  {
    title: 'Dev & Company',
    links: [
      { name: 'Custom QR Code Generator', path: '/qr-generator' },
      { name: 'JSON Formatter & Validator', path: '/json-formatter' },
      { name: 'About OmniTasker Hub', path: '/about' },
      { name: 'Contact Support', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top Feature Badges */}
        <div className="grid sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                100% Client-Side
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Files never leave your browser</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                High-Speed Processing
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant local WebAssembly &amp; Canvas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                No Registration
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Unlimited free access forever</p>
            </div>
          </div>
        </div>

        {/* Categorized Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="col-span-2 md:col-span-2 space-y-4 pr-0 md:pr-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #10b981)',
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-slate-100 tracking-tight">
                Omni<span className="gradient-text">Tasker</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              OmniTasker is a free online utility and file converter hub for students, job applicants, and professionals. All file conversions, resizing, and compressions run 100% locally in your browser with maximum speed and zero data retention.
            </p>
            <div className="pt-1">
              <a
                href="mailto:omnitasker98@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-mono transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>omnitasker98@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Section columns */}
          {TOOL_SECTIONS.map((sec) => (
            <div key={sec.title} className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {sec.title}
              </h3>
              <ul className="space-y-2">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-xs text-slate-400 hover:text-white transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Privacy Policy & Terms Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
          <div className="text-[11px] text-slate-500 leading-relaxed max-w-4xl">
            <strong className="text-slate-400">Privacy &amp; Security Disclaimer:</strong> OmniTasker operates with zero server uploads for image, PDF, and developer operations. All file manipulation and compression happen directly on the client machine using browser APIs (HTML5 Canvas, WebAssembly, and FileReader). We do not collect, view, or retain your files, photos, or documents.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 pt-2">
            <p>&copy; {new Date().getFullYear()} OmniTasker. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <span className="text-slate-700">&bull;</span>
              <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <span className="text-slate-700">&bull;</span>
              <Link to="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
              <span className="text-slate-700">&bull;</span>
              <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
