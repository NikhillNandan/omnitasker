import { useEffect } from 'react'

/**
 * SEO component to dynamically manage meta tags, canonical links, and JSON-LD structured data.
 * Optimized for Google indexing of single-domain tool subfolders.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = '',
  schema = null,
}) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title.includes('OmniTasker') ? title : `${title} | OmniTasker`
    }

    // Helper to set or update meta tag
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return
      const attr = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // 2. Meta tags
    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, true)
      setMeta('twitter:description', description)
    }
    if (keywords) {
      setMeta('keywords', keywords)
    }
    if (title) {
      const fullTitle = title.includes('OmniTasker') ? title : `${title} | OmniTasker`
      setMeta('og:title', fullTitle, true)
      setMeta('twitter:title', fullTitle)
    }

    setMeta('og:type', 'website', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('robots', 'index, follow')

    // 3. Canonical link
    const currentOrigin = window.location.origin
    const fullCanonical = `${currentOrigin}${canonicalPath || window.location.pathname}`
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', fullCanonical)
    setMeta('og:url', fullCanonical, true)

    // 4. Schema.org JSON-LD
    let scriptTag = document.getElementById('json-ld-schema')
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = 'json-ld-schema'
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }
      scriptTag.text = JSON.stringify(schema)
    } else if (scriptTag) {
      scriptTag.remove()
    }
  }, [title, description, keywords, canonicalPath, schema])

  return null
}
