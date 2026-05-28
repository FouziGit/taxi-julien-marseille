import type { ImgHTMLAttributes } from 'react'

type Props = {
  /** Large source path (e.g. /photos/v8.jpg) — used on desktop ≥ 768px */
  src: string
  /** Small source path (e.g. /photos/v8-sm.jpg) — used on mobile */
  srcSm?: string
  /** Eager-load this image (use for above-the-fold LCP candidate) */
  eager?: boolean
  /** Fetchpriority hint — set to "high" for hero LCP image */
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Set if AVIF is available next to the JPEG. Only used for the hero — most
   *  destination photos ship as WebP + JPEG to keep the build size manageable. */
  withAvif?: boolean
  /** Intrinsic width — improves LCP and prevents CLS by reserving space. */
  width?: number
  /** Intrinsic height — improves LCP and prevents CLS by reserving space. */
  height?: number
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'fetchPriority' | 'width' | 'height'>

const ext = (p: string, e: string) => p.replace(/\.(jpe?g|png)$/i, e)
const webp = (p: string) => ext(p, '.webp')
const avif = (p: string) => ext(p, '.avif')

/**
 * Responsive <picture> with format negotiation (AVIF → WebP → JPEG).
 *
 * Why this matters
 * - AVIF cuts ~55% off JPEG weight in our tests; WebP cuts ~45%.
 * - Browsers pick the first <source> they can decode, so order matters.
 * - The final <img src=...> is the JPEG fallback for very old clients.
 *
 * Why split desktop / mobile sources
 * - Desktop loads a higher-res 1200-1400px image; mobile loads a 700px one.
 * - The `media="(min-width: 768px)"` source wins on desktop, then we fall
 *   through to the unprefixed source on mobile.
 */
export default function Pic({
  src,
  srcSm,
  eager,
  fetchPriority,
  withAvif,
  width,
  height,
  alt = '',
  className,
  ...rest
}: Props) {
  const small = srcSm ?? src
  return (
    <picture>
      {/* AVIF — only for hero where the .avif files were generated. */}
      {withAvif && (
        <>
          <source type="image/avif" media="(min-width: 768px)" srcSet={avif(src)} />
          <source type="image/avif" srcSet={avif(small)} />
        </>
      )}
      {/* WebP — generated for every photo via cwebp during the asset pipeline. */}
      <source type="image/webp" media="(min-width: 768px)" srcSet={webp(src)} />
      <source type="image/webp" srcSet={webp(small)} />
      {/* Desktop JPEG — last fallback for browsers without WebP support. */}
      <source type="image/jpeg" media="(min-width: 768px)" srcSet={src} />
      {/* Mobile JPEG — the <img> renders here on legacy mobile clients. */}
      <img
        src={small}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={fetchPriority ?? (eager ? 'high' : 'auto')}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    </picture>
  )
}
