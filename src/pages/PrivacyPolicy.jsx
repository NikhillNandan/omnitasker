import SEO from '../components/layout/SEO'
import AdPlaceholder from '../components/layout/AdPlaceholder'
import { ShieldCheck, Lock, ServerOff, EyeOff, Cookie, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - OmniTasker',
    url: 'https://omnitasker.co.in/privacy-policy',
    description: 'Privacy Policy for OmniTasker explaining our zero-upload client-side architecture, cookies, and Google AdSense compliance.',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-300">
      <SEO
        title="Privacy Policy – OmniTasker (100% In-Browser & Zero Server Uploads)"
        description="OmniTasker Privacy Policy: Learn how our 100% client-side architecture protects your documents. Full disclosures on cookies, analytics, and Google AdSense."
        canonicalPath="/privacy-policy"
        schema={schema}
      />

      <div className="space-y-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl shadow-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Last Updated: October 31, 2026 | Effective immediately for all visitors to <strong>omnitasker.co.in</strong>
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-6 border border-white/10 text-xs sm:text-sm leading-relaxed">
        {/* Core Guarantee */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start sm:items-center gap-3 text-emerald-300">
          <ServerOff className="w-5 h-5 mt-0.5 sm:mt-0 shrink-0" />
          <p className="font-semibold text-xs sm:text-sm">
            Core Guarantee: OmniTasker operates with a zero-server-upload architecture. Your documents, PDFs, Excel sheets, and photos are processed directly in your browser and are never transmitted to or stored on our servers.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            1. Client-Side Processing Architecture
          </h2>
          <p>
            OmniTasker utilizes modern web technologies (HTML5 Canvas, WebAssembly, Web Workers, and the FileSystem/FileReader API) to execute all document and image processing locally within your browser:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong>No File Uploads:</strong> When you convert a PDF to Word, Word to PDF, or Excel to PDF, your files remain in your computer&apos;s local memory. No binary file content is uploaded across the network.</li>
            <li><strong>No Data Retention:</strong> Because we do not upload or store your files, we have zero copies of your financial reports, legal documents, candidate photos, or signatures.</li>
            <li><strong>No Account Required:</strong> You can use all tools without providing names, passwords, credit card numbers, or contact information.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            2. Google AdSense &amp; Third-Party Advertising
          </h2>
          <p>
            To keep our utility suite 100% free for everyone, OmniTasker displays advertisements served by third-party advertising partners, including <strong>Google AdSense</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>Google, as a third-party vendor, uses cookies to serve ads on OmniTasker.</li>
            <li>Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads based on your visit to OmniTasker and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline hover:text-brand-300">Google Ads Settings</a> or through the Network Advertising Initiative at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline hover:text-brand-300">aboutads.info</a>.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            3. Cookies &amp; Web Beacons
          </h2>
          <p>
            Like any modern website, OmniTasker uses cookies for essential site functionality, user theme preferences, and aggregate traffic measurements. You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this may affect how you interact with our site and other websites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            4. Log Files
          </h2>
          <p>
            OmniTasker follows a standard procedure of using log files provided by our hosting and CDN network (e.g. Vercel/Cloudflare). These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable and are used solely for analyzing trends, administering the site, and preventing DDoS attacks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            5. CCPA / CPRA &amp; GDPR Privacy Rights
          </h2>
          <p>
            Depending on your location, you may have specific data privacy rights under regulations such as the California Consumer Privacy Act (CCPA) or General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>The right to request disclosure of personal data categories collected.</li>
            <li>The right to request deletion of personal data.</li>
            <li>The right to opt-out of the sale or sharing of personal data (we never sell user data).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            6. Children&apos;s Information
          </h2>
          <p>
            OmniTasker does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe that a child has provided personal information on our website, please contact us immediately and we will promptly remove such information from our records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-100">
            7. Contact Support &amp; Privacy Officer
          </h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy, please email our support team directly at:{' '}
            <a href="mailto:omnitasker98@gmail.com" className="text-brand-400 font-mono font-semibold hover:underline">
              omnitasker98@gmail.com
            </a>{' '}
            or submit an inquiry on our <Link to="/contact" className="text-emerald-400 hover:underline">Contact Page</Link>.
          </p>
        </section>
      </div>

      <AdPlaceholder slot="leaderboard" className="mt-12" />
    </div>
  )
}
