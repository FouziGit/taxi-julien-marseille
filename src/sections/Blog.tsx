import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { articles, type Article, type ArticleBlock, destinations } from '../data/taxi'
import { ClockIcon, ChevronIcon, PinIcon } from '../components/Icons'
import Pic from '../components/Pic'

type Props = {
  onPickDestination: (id: string) => void
}

export default function Blog({ onPickDestination }: Props) {
  const [open, setOpen] = useState<Article | null>(null)

  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = orig }
    }
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <section
        id="blog"
        className="py-20 sm:py-28 bg-[var(--color-ink)]"
        aria-labelledby="blog-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Guides & idées</p>
            <h2 id="blog-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
              Où aller. Quand. Comment.
            </h2>
            <p className="mt-4 text-[var(--color-silver-deep)] text-[15px] sm:text-base max-w-2xl mx-auto">
              Nos guides locaux pour visiter Marseille, la Provence et la Côte d'Azur —
              écrits par quelqu'un qui y vit, pas par un algorithme.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {articles.map((a, i) => (
              <motion.article
                key={a.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl overflow-hidden bg-[var(--color-charcoal)] hairline flex flex-col cursor-pointer mag-btn"
                onClick={() => setOpen(a)}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-graphite)]">
                  <Pic
                    src={a.hero}
                    srcSm={a.heroSm}
                    alt={a.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/85 via-transparent to-transparent"/>
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--color-cream)] hairline-strong">
                    {a.season}
                  </span>
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md text-[10px] font-bold text-[var(--color-silver-2)] hairline-strong">
                    <ClockIcon className="w-3 h-3"/>
                    {a.readTime}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-deep)] font-bold mb-2">
                    {a.subtitle}
                  </div>
                  <h3 className="font-display font-semibold text-[19px] sm:text-[20px] text-[var(--color-cream)] tracking-tight leading-tight text-balance">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[14px] text-[var(--color-silver-deep)] leading-relaxed flex-1 line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-cream)] group-hover:gap-3 transition-all">
                    <span>Lire l'article</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL — full article */}
      <AnimatePresence>
        {open && (
          <ArticleModal
            article={open}
            onClose={() => setOpen(null)}
            onReserve={(destId) => {
              setOpen(null)
              if (destId) onPickDestination(destId)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ArticleModal({
  article,
  onClose,
  onReserve,
}: {
  article: Article
  onClose: () => void
  onReserve: (destId?: string) => void
}) {
  // Resolve destination name for CTA if linked
  const destName = article.ctaDestinationId
    ? destinations.find(d => d.id === article.ctaDestinationId)?.name
    : undefined

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-[var(--color-ink)]/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`article-title-${article.slug}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto my-6 sm:my-12 max-w-3xl bg-[var(--color-graphite)] rounded-3xl hairline overflow-hidden shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'article"
          className="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md text-[var(--color-cream)] hover:bg-[var(--color-ink)] transition hairline-strong"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        {/* Hero image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[var(--color-charcoal)] overflow-hidden">
          <Pic
            src={article.hero}
            srcSm={article.heroSm}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-graphite)] via-transparent to-transparent"/>
          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--color-cream)] hairline-strong">
              {article.season}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md text-[10px] font-bold text-[var(--color-silver-2)] hairline-strong">
              <ClockIcon className="w-3 h-3"/>
              {article.readTime} de lecture
            </span>
          </div>
        </div>

        {/* Article body */}
        <article className="p-6 sm:p-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-silver-deep)] font-bold mb-3">
            {article.subtitle}
          </div>
          <h1
            id={`article-title-${article.slug}`}
            className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-cream)] tracking-tight leading-tight text-balance"
          >
            {article.title}
          </h1>
          <p className="mt-3 text-[13px] text-[var(--color-mute)]">
            Publié le {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="mt-7 space-y-5 text-[15.5px] text-[var(--color-silver-2)] leading-relaxed">
            {article.body.map((b, i) => (
              <ArticleBlockRenderer key={i} block={b} onReserve={onReserve} />
            ))}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-wrap gap-2">
              {article.tags.map(t => (
                <span key={t} className="px-3 py-1 rounded-full hairline text-[11px] uppercase tracking-[0.16em] font-bold text-[var(--color-silver-deep)]">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Final CTA — bigger, branded */}
          {destName && (
            <div className="mt-8 rounded-2xl bg-white text-[var(--color-ink)] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-[var(--color-mute)]">Prêt à partir ?</div>
                <div className="font-display font-semibold text-xl mt-1 tracking-tight">
                  Marseille → {destName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onReserve(article.ctaDestinationId)}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[var(--color-ink)] text-white font-semibold text-[14px] mag-btn whitespace-nowrap"
              >
                <PinIcon className="w-4 h-4"/>
                Construire mon trajet
                <ChevronIcon className="w-4 h-4 -rotate-90"/>
              </button>
            </div>
          )}
        </article>
      </motion.div>
    </motion.div>
  )
}

function ArticleBlockRenderer({
  block,
  onReserve,
}: {
  block: ArticleBlock
  onReserve: (destId?: string) => void
}) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'h3':
      return (
        <h2 className="font-display font-semibold text-[22px] sm:text-2xl text-[var(--color-cream)] tracking-tight !mt-9 mb-3">
          {block.text}
        </h2>
      )
    case 'ul':
      return (
        <ul className="space-y-2 list-none pl-0">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[var(--color-cream)] shrink-0 mt-0.5" aria-hidden>›</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="border-l-2 border-[var(--color-cream)] pl-5 py-1 my-2">
          <p className="italic text-[var(--color-cream)] text-[17px] leading-relaxed">"{block.text}"</p>
          {block.author && (
            <footer className="mt-2 text-[12px] uppercase tracking-[0.2em] font-bold text-[var(--color-silver-deep)]">
              — {block.author}
            </footer>
          )}
        </blockquote>
      )
    case 'cta':
      return (
        <button
          type="button"
          onClick={() => onReserve(block.destinationId)}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-[var(--color-cream)] text-[var(--color-ink)] font-semibold text-[14px] mag-btn !mt-7"
        >
          {block.label}
          <ChevronIcon className="w-4 h-4 -rotate-90"/>
        </button>
      )
  }
}
