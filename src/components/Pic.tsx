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
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'fetchPriority'>

const webp = (p: string) => p.replace(/\.(jpe?g|png)$/i, '.webp')

/**
 * Responsive <picture> with WebP preferred + JPEG fallback.
 * - WebP cuts ~46% off the JPEG weight in our build.
 * - Mobile gets a smaller `srcSm` if provided, desktop gets `src`.
 * - Old browsers / WebP-unsupported clients fall back to the JPEG `<img>`.
 */
export default function Pic({
  src,
  srcSm,
  eager,
  fetchPriority,
  alt = '',
  className,
  ...rest
}: Props) {
  const small = srcSm ?? src
  return (
    <picture>
      {/* Desktop WebP */}
      <source type="image/webp" media="(min-width: 768px)" srcSet={webp(src)} />
      {/* Mobile WebP */}
      <source type="image/webp" srcSet={webp(small)} />
      {/* Desktop JPEG fallback */}
      <source type="image/jpeg" media="(min-width: 768px)" srcSet={src} />
      {/* Mobile JPEG fallback (rendered if no other source matches) */}
      <img
        src={small}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={fetchPriority ?? (eager ? 'high' : 'auto')}
        className={className}
        {...rest}
      />
    </picture>
  )
}
