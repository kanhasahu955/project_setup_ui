import {
  DEFAULT_TITLE,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  BASE_URL,
} from "@/constants/seo"

export interface SEOProps {
  /** Page title (e.g. "Login" → "Login | Live Bhoomi"). */
  title?: string
  /** Meta description. */
  description?: string
  /** Canonical path or full URL. */
  canonical?: string
  /** Open Graph image URL. */
  ogImage?: string
  /** Open Graph type (default: website). */
  ogType?: "website" | "article"
  /** When true, add noindex,nofollow (login, dashboard, admin). */
  noIndex?: boolean
}

const defaultOgType = "website" as const

/**
 * SEO-friendly document head using React 19 in-document metadata.
 * Renders <title>, <meta>, <link> so they are applied to the document.
 */
export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = defaultOgType,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const canonicalUrl = canonical
    ? (canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical}`)
    : undefined
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  )
}
