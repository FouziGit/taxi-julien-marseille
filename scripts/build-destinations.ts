#!/usr/bin/env tsx
/* eslint-disable no-console */
/**
 * Post-build script — generates a static HTML page per enriched destination
 * under dist/destinations/[id]/index.html.
 *
 * Why pure HTML (no React SSR / hydration):
 * - These are SEO landing pages. They don't need the trajet builder, the
 *   reservation form, or any of the interactive widgets — those live on
 *   the main / SPA. Each destination page just needs a crawlable HTML doc
 *   with strong meta + JSON-LD + content + a CTA back to the main site.
 * - Zero hydration = zero JS budget on those pages = Lighthouse 100.
 * - No risk of SSR mismatches with Motion / AnimatePresence / useScroll.
 *
 * Output structure (trailing slash on the served URL is the convention the
 * sitemap, canonical, and internal links all share):
 *   dist/destinations/cassis/index.html
 *   dist/destinations/aix-en-provence/index.html
 *   dist/destinations/saint-tropez/index.html
 *
 * The script reuses the same hashed CSS bundle and self-hosted fonts as the
 * main SPA, so the visual identity stays consistent across the site.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  destContent,
  destinations,
  fareTables,
  contact,
  business,
  type DestContent,
  type Destination,
  type DestSpot,
} from '../src/data/taxi'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

// Production URL — used for canonical, Open Graph, JSON-LD @id. Update
// when the DNS migrates to taxijulien.com.
const SITE_URL = 'https://taxi-julien-marseille.netlify.app'

// ---------------------------------------------------------------------------
// Find the hashed asset paths that Vite emitted for this build, so the
// destination pages share the exact same CSS bundle and font preloads
// as the main SPA without duplicating <link> tags.
// ---------------------------------------------------------------------------
function readMainHtml(): string {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  return html
}

function extractAssetHash(html: string, prefix: string, ext: string): string | null {
  const re = new RegExp(`/assets/${prefix}-([A-Za-z0-9_-]+)\\.${ext}`)
  const m = html.match(re)
  return m ? m[0] : null
}

// ---------------------------------------------------------------------------
// Look up the fare row for a destination in the existing fareTables.
// Returns formatted day/night strings or null.
// ---------------------------------------------------------------------------
type Fare = { day?: string; night?: string; from?: string; tableLabel: string }
function findFare(names: string[]): Fare | null {
  // Try each name candidate (e.g. ['Cassis & Calanques', 'Cassis']) — fareTables
  // index by plain city name, but destinations[] often carry composed names
  // ('Cassis & Calanques', 'Aéroport Nice Côte d\'Azur'). We try the long form
  // first then fall back to shortName.
  for (const name of names) {
    if (!name) continue
    for (const t of fareTables) {
      const row = t.rows.find(r => r.dest === name)
      if (row) return { day: row.day, night: row.night, from: row.from, tableLabel: t.title }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Small HTML escape — we never inject user input, but data has French
// punctuation (apostrophes, &, <, >) that needs encoding for clean HTML.
// ---------------------------------------------------------------------------
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---------------------------------------------------------------------------
// Pick a Lucide-ish emoji glyph per spot category. Used inline in HTML.
// ---------------------------------------------------------------------------
const SPOT_ICON: Record<DestSpot['type'], string> = {
  beach: '🏖️',
  monument: '🏛️',
  museum: '🖼️',
  viewpoint: '👁️',
  restaurant: '🍽️',
  wine: '🍷',
  market: '🛒',
  sport: '⚽',
  hike: '🥾',
  shopping: '🛍️',
  church: '⛪',
  other: '📍',
}

// ---------------------------------------------------------------------------
// JSON-LD generator — five blocks per page:
//   1. TaxiService with areaServed = this destination
//   2. TouristDestination (or Place) with geo + spots as containedInPlace
//   3. FAQPage from the destination's FAQ items
//   4. BreadcrumbList: Accueil > Destinations > [Name]
//   5. WebPage that ties them together
// All linked via @id so Google can resolve the entity graph cleanly.
// ---------------------------------------------------------------------------
function buildJsonLd(content: DestContent, dest: Destination, pageUrl: string): string {
  const taxiService = {
    '@type': 'TaxiService',
    '@id': `${pageUrl}#taxiservice`,
    name: `Taxi Julien — Marseille → ${dest.name}`,
    provider: {
      '@type': 'Organization',
      name: business.legalName,
      telephone: contact.phoneTel,
      email: contact.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Marseille',
        postalCode: business.postalCode,
        addressRegion: business.region,
        addressCountry: 'FR',
      },
    },
    areaServed: {
      '@type': 'City',
      name: dest.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: dest.name,
        addressRegion: content.deptName,
        addressCountry: 'FR',
      },
    },
    priceRange: '€€',
  }

  const place = {
    '@type': 'TouristDestination',
    '@id': `${pageUrl}#place`,
    name: dest.name,
    description: content.lead,
    address: {
      '@type': 'PostalAddress',
      addressLocality: dest.name,
      addressRegion: content.deptName,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: content.geo.lat,
      longitude: content.geo.lng,
    },
    includesAttraction: content.spots.map((s, i) => ({
      '@type': 'TouristAttraction',
      '@id': `${pageUrl}#attraction-${i}`,
      name: s.name,
      description: s.blurb,
    })),
  }

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: content.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE_URL}/#destinations` },
      { '@type': 'ListItem', position: 3, name: dest.name, item: pageUrl },
    ],
  }

  const webPage = {
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name: content.seoTitle,
    description: content.seoDescription,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    primaryImageOfPage: dest.photo ? { '@type': 'ImageObject', url: SITE_URL + dest.photo } : undefined,
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    about: { '@id': `${pageUrl}#place` },
    mainEntity: { '@id': `${pageUrl}#taxiservice` },
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [taxiService, place, faqPage, breadcrumb, webPage],
  }
  return JSON.stringify(graph)
}

// ---------------------------------------------------------------------------
// The HTML template. Everything is inlined for clarity — Tailwind classes
// match what the main SPA uses, so a visitor moving between / and
// /destinations/[id]/ gets the same look without a flash.
// ---------------------------------------------------------------------------
function buildHtml(content: DestContent, dest: Destination, assets: { css: string; preloadFonts: string[] }): string {
  const pageUrl = `${SITE_URL}/destinations/${content.id}/`
  const fare = findFare([dest.name, dest.shortName].filter(Boolean) as string[])
  const ogImage = dest.photo ? SITE_URL + dest.photo : SITE_URL + '/og-image.jpg'
  const jsonLd = buildJsonLd(content, dest, pageUrl)

  // Resolve related destinations for the internal-linking block.
  const related = content.related
    .map(id => destinations.find(d => d.id === id))
    .filter((d): d is Destination => Boolean(d))

  const fontPreloads = assets.preloadFonts
    .map(f => `<link rel="preload" as="font" href="${f}" type="font/woff2" crossorigin />`)
    .join('\n    ')

  return `<!doctype html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0a0c" />

    <title>${esc(content.seoTitle)}</title>
    <meta name="description" content="${esc(content.seoDescription)}" />

    <link rel="canonical" href="${pageUrl}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.webmanifest" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="Taxi Julien" />
    <meta property="og:title" content="${esc(content.seoTitle)}" />
    <meta property="og:description" content="${esc(content.seoDescription)}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:image" content="${ogImage}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(content.seoTitle)}" />
    <meta name="twitter:description" content="${esc(content.seoDescription)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <!-- GEO meta (used by local-search engines like Bing & some specialised crawlers) -->
    <meta name="geo.region" content="FR-${content.deptCode}" />
    <meta name="geo.placename" content="${esc(dest.name)}" />
    <meta name="geo.position" content="${content.geo.lat};${content.geo.lng}" />
    <meta name="ICBM" content="${content.geo.lat}, ${content.geo.lng}" />

    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="author" content="Taxi Julien" />

    <!-- AI engines: pointer to the markdown sibling for cleaner ingestion -->
    <link rel="alternate" type="text/markdown" href="/destinations/${content.id}/index.md" />

    <!-- Shared CSS bundle (same one the SPA uses) -->
    <link rel="stylesheet" href="${assets.css}" />

    <!-- Self-hosted fonts (preload the latin subsets) -->
    ${fontPreloads}

    <!-- JSON-LD entity graph -->
    <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
    <a href="/#contenu" class="skip-link">Aller au contenu</a>

    <!-- Top bar — static version, links back to the SPA -->
    <header class="sticky top-0 z-50 bg-[var(--color-ink)]/85 backdrop-blur-md border-b border-white/[0.06]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5" aria-label="Taxi Julien — accueil">
                <span class="grid place-items-center w-9 h-9 rounded-lg bg-white text-[var(--color-ink)] font-bold text-sm font-display">TJ</span>
                <div class="leading-tight">
                    <div class="font-display font-semibold text-[var(--color-cream)] text-[15px] tracking-tight">Taxi Julien</div>
                    <div class="text-[11px] text-[var(--color-mute)] -mt-0.5 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span>Disponible · Marseille</span>
                    </div>
                </div>
            </a>
            <a href="tel:${contact.phoneTel}" class="flex items-center gap-2 px-4 h-10 rounded-full bg-white text-[var(--color-ink)] font-semibold text-sm">
                📞 ${contact.phoneDisplay}
            </a>
        </div>
    </header>

    <main id="contenu" class="bg-[var(--color-ink)]">
        <!-- Breadcrumb -->
        <nav aria-label="Fil d'ariane" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-[12px] text-[var(--color-silver-deep)]">
            <a href="/" class="hover:text-[var(--color-cream)] transition">Accueil</a>
            <span aria-hidden> › </span>
            <a href="/#destinations" class="hover:text-[var(--color-cream)] transition">Destinations</a>
            <span aria-hidden> › </span>
            <span class="text-[var(--color-cream)]">${esc(dest.name)}</span>
        </nav>

        <!-- Hero -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:py-16">
            <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
                <div>
                    <p class="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Destination · ${esc(content.deptName)}</p>
                    <h1 class="font-display font-semibold tracking-tight text-balance text-[clamp(2rem,6vw,4rem)] leading-[1.05] mt-4 text-[var(--color-cream)]">
                        ${esc(content.h1)}
                    </h1>
                    <p class="mt-3 text-[var(--color-silver-2)] text-[15px] sm:text-base">${esc(content.heroSubtitle)}</p>

                    <p class="mt-6 text-[var(--color-silver-2)] text-[15.5px] leading-relaxed max-w-2xl">${esc(content.lead)}</p>

                    <!-- Quick facts -->
                    <div class="mt-6 grid grid-cols-3 gap-2 max-w-md">
                        <div class="rounded-xl bg-[var(--color-graphite)] hairline p-3">
                            <div class="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Distance</div>
                            <div class="font-display font-semibold text-[var(--color-cream)] text-base mt-0.5 tabular-nums">${content.distanceKm} km</div>
                        </div>
                        <div class="rounded-xl bg-[var(--color-graphite)] hairline p-3">
                            <div class="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Durée</div>
                            <div class="font-display font-semibold text-[var(--color-cream)] text-base mt-0.5">${esc(content.durationReal)}</div>
                        </div>
                        <div class="rounded-xl bg-[var(--color-graphite)] hairline p-3">
                            <div class="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Capacité</div>
                            <div class="font-display font-semibold text-[var(--color-cream)] text-base mt-0.5">7 pax</div>
                        </div>
                    </div>

                    ${fare ? `
                    <!-- Fare card -->
                    <div class="mt-5 rounded-2xl bg-white text-[var(--color-ink)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-md">
                        <div>
                            <div class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">Forfait taxi</div>
                            <div class="font-display font-semibold text-lg mt-0.5">${fare.day && fare.night ? `${fare.day} jour · ${fare.night} nuit` : fare.from ? `À partir de ${fare.from}` : 'Sur devis'}</div>
                        </div>
                        <a href="/#reservation" class="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-[var(--color-ink)] text-white font-semibold text-[13.5px]">Réserver →</a>
                    </div>
                    ` : `
                    <div class="mt-5 rounded-2xl bg-white text-[var(--color-ink)] p-4 sm:p-5 max-w-md">
                        <div class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">Tarif</div>
                        <div class="font-display font-semibold text-lg mt-0.5">Forfait sur devis</div>
                        <a href="/#reservation" class="inline-flex items-center justify-center h-11 px-5 mt-3 rounded-xl bg-[var(--color-ink)] text-white font-semibold text-[13.5px]">Demander un devis →</a>
                    </div>
                    `}

                    <!-- CTAs -->
                    <div class="mt-5 flex flex-wrap gap-3">
                        <a href="tel:${contact.phoneTel}" class="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white text-[var(--color-ink)] font-semibold text-[14px]">
                            📞 Appeler ${contact.phoneDisplay}
                        </a>
                        <a href="https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappBaseText + ' Je voudrais aller à ' + dest.name + '.')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-[var(--color-whatsapp)] text-[var(--color-ink)] font-semibold text-[14px]">
                            💬 WhatsApp
                        </a>
                    </div>
                </div>

                <!-- Hero image -->
                ${dest.photo ? `
                <div class="relative rounded-3xl overflow-hidden hairline aspect-[5/4] sm:aspect-[16/11] bg-[var(--color-graphite)]">
                    <picture>
                        <source type="image/avif" media="(min-width: 768px)" srcset="${dest.photo.replace(/\.jpg$/, '.avif')}" />
                        <source type="image/webp" media="(min-width: 768px)" srcset="${dest.photo.replace(/\.jpg$/, '.webp')}" />
                        ${dest.photoSm ? `<source type="image/webp" srcset="${dest.photoSm.replace(/\.jpg$/, '.webp')}" />` : ''}
                        <img
                            src="${dest.photoSm || dest.photo}"
                            alt="${esc(dest.name)} — destination Taxi Julien"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                            width="1200"
                            height="900"
                            class="w-full h-full object-cover"
                        />
                    </picture>
                    <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 via-transparent to-transparent"></div>
                </div>
                ` : ''}
            </div>
        </section>

        ${content.tripNotes ? `
        <!-- Trip notes -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/[0.05]">
            <div class="max-w-3xl">
                <h2 class="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-cream)] tracking-tight">Le trajet</h2>
                <p class="mt-4 text-[var(--color-silver-2)] text-[15.5px] leading-relaxed">${esc(content.tripNotes)}</p>
            </div>
        </section>
        ` : ''}

        <!-- Spots / POIs -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.05]">
            <div class="mb-8">
                <h2 class="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-cream)] tracking-tight">Que faire à ${esc(dest.name)}</h2>
                <p class="mt-2 text-[var(--color-silver-deep)] text-[14.5px]">${content.spots.length} spots vérifiés. Nous vous déposons et vous récupérons à l'heure de votre choix.</p>
            </div>
            <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                ${content.spots.map(s => `
                <li class="rounded-2xl bg-[var(--color-charcoal)] hairline p-5 flex flex-col gap-2">
                    <span class="text-2xl" aria-hidden>${SPOT_ICON[s.type] || '📍'}</span>
                    <h3 class="font-display font-semibold text-[var(--color-cream)] text-[16px] tracking-tight">${esc(s.name)}</h3>
                    <p class="text-[14px] text-[var(--color-silver-2)] leading-relaxed">${esc(s.blurb)}</p>
                </li>
                `).join('')}
            </ul>
        </section>

        ${content.useCases?.length ? `
        <!-- Use cases -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.05]">
            <h2 class="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-cream)] tracking-tight">Pour qui · Pour quoi</h2>
            <ul class="mt-6 space-y-2 max-w-3xl">
                ${content.useCases.map(u => `
                <li class="flex items-start gap-3 text-[var(--color-silver-2)] text-[15px]">
                    <span class="text-[var(--color-cream)] shrink-0 mt-0.5" aria-hidden>›</span>
                    <span>${esc(u)}</span>
                </li>
                `).join('')}
            </ul>
        </section>
        ` : ''}

        <!-- FAQ -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.05]">
            <h2 class="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-cream)] tracking-tight">Questions fréquentes</h2>
            <ul class="mt-6 space-y-3 max-w-3xl">
                ${content.faq.map((item, i) => `
                <li class="rounded-2xl bg-[var(--color-charcoal)] hairline p-5 sm:p-6">
                    <h3 class="font-display font-semibold text-[var(--color-cream)] text-[16px] sm:text-[17px] tracking-tight">${esc(item.q)}</h3>
                    <p class="mt-2 text-[var(--color-silver-2)] text-[14.5px] leading-relaxed">${esc(item.a)}</p>
                </li>
                `).join('')}
            </ul>
        </section>

        <!-- Related destinations -->
        ${related.length ? `
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.05]">
            <h2 class="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-cream)] tracking-tight">Destinations proches</h2>
            <ul class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                ${related.map(r => `
                <li>
                    <a href="/destinations/${r.id}/" class="block rounded-2xl bg-[var(--color-charcoal)] hairline p-5 hover:bg-[var(--color-line-soft)] transition">
                        <div class="text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--color-mute)]">${esc(r.category)}</div>
                        <div class="font-display font-semibold text-[var(--color-cream)] text-[16px] tracking-tight mt-1">Marseille → ${esc(r.shortName || r.name)}</div>
                        <div class="text-[13px] text-[var(--color-silver-deep)] mt-1 flex items-center gap-1">Voir le forfait <span aria-hidden>→</span></div>
                    </a>
                </li>
                `).join('')}
            </ul>
        </section>
        ` : ''}

        <!-- Final CTA -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="rounded-3xl bg-white text-[var(--color-ink)] p-8 sm:p-10 text-center">
                <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-600">— Réservation immédiate</p>
                <h2 class="font-display font-semibold text-2xl sm:text-3xl mt-3 tracking-tight">Prêt à partir vers ${esc(dest.name)} ?</h2>
                <p class="mt-3 text-gray-700 text-[15px] max-w-md mx-auto">Tarif annoncé fermement à la réservation. Mercedes Classe V jusqu'à 7 passagers. 24h/24, 7j/7.</p>
                <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a href="tel:${contact.phoneTel}" class="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[var(--color-ink)] text-white font-semibold text-[14px]">📞 Appeler ${contact.phoneDisplay}</a>
                    <a href="https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappBaseText + ' Je voudrais aller à ' + dest.name + '.')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[var(--color-whatsapp)] text-[var(--color-ink)] font-semibold text-[14px]">💬 WhatsApp</a>
                    <a href="/#reservation" class="inline-flex items-center gap-2 h-12 px-6 rounded-xl hairline-strong bg-transparent text-[var(--color-ink)] font-semibold text-[14px]">Formulaire en ligne</a>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer link -->
    <footer class="bg-[var(--color-ink)] border-t border-white/[0.05] py-8 text-center text-[12px] text-[var(--color-mute)]">
        <a href="/" class="text-[var(--color-cream)] font-semibold hover:underline">← Retour à l'accueil Taxi Julien</a>
        <p class="mt-3">SIRET ${business.siret} · ${business.legalName}, ${business.streetAddress} · Conventionné CPAM · 24h/24, 7j/7</p>
    </footer>
</body>
</html>
`
}

// ---------------------------------------------------------------------------
// Markdown sibling for AI engines — same pattern as /index.md on the home.
// ---------------------------------------------------------------------------
function buildMarkdown(content: DestContent, dest: Destination): string {
  const pageUrl = `${SITE_URL}/destinations/${content.id}/`
  const fare = findFare([dest.name, dest.shortName].filter(Boolean) as string[])
  return `---
title: ${content.seoTitle}
description: ${content.seoDescription}
canonical: ${pageUrl}
lang: fr-FR
geo: ${content.geo.lat},${content.geo.lng}
deptCode: FR-${content.deptCode}
---

# ${content.h1}

${content.heroSubtitle}

📞 **${contact.phoneDisplay}** · 💬 wa.me/${contact.whatsappNumber} · ✉️ ${contact.email}

## Trajet

- **Distance** : ${content.distanceKm} km
- **Durée** : ${content.durationReal}
- **Capacité** : Mercedes Classe V, 1 à 7 passagers
${fare ? `- **Tarif** : ${fare.day && fare.night ? `${fare.day} jour · ${fare.night} nuit` : fare.from ? `À partir de ${fare.from}` : 'Sur devis'}` : '- **Tarif** : Sur devis'}

${content.lead}

${content.tripNotes ? `## Le trajet\n\n${content.tripNotes}\n` : ''}

## Que faire à ${dest.name}

${content.spots.map(s => `- **${s.name}** — ${s.blurb}`).join('\n')}

${content.useCases?.length ? `## Cas d'usage\n\n${content.useCases.map(u => `- ${u}`).join('\n')}\n` : ''}

## FAQ

${content.faq.map(f => `**Q : ${f.q}**\nR : ${f.a}`).join('\n\n')}

## Réservation

- [Appeler maintenant](tel:${contact.phoneTel}) : ${contact.phoneDisplay}
- [WhatsApp](https://wa.me/${contact.whatsappNumber})
- [Formulaire en ligne](${SITE_URL}/#reservation)

---

[← Retour à l'accueil Taxi Julien](${SITE_URL}/)
`
}

// ---------------------------------------------------------------------------
// Main: walk through enriched destinations, write HTML + MD to dist.
// ---------------------------------------------------------------------------
function main() {
  const mainHtml = readMainHtml()
  const cssHref = extractAssetHash(mainHtml, 'index', 'css')
  if (!cssHref) {
    console.error('❌ Could not find /assets/index-*.css in dist/index.html')
    process.exit(1)
  }

  // Preload the same self-hosted fonts the SPA preloads.
  const fonts = ['/fonts/inter-latin.woff2', '/fonts/spacegrotesk-latin.woff2']

  let count = 0
  let pageOnly = 0
  for (const content of destContent) {
    // First try to use the matching destinations[] entry (full data), otherwise
    // synthesize one from destContent's own page-only fields. This lets us add
    // dedicated SEO pages without polluting the SPA's UI (trajet builder, etc.).
    const existing = destinations.find(d => d.id === content.id)
    const dest: Destination = existing ?? {
      id: content.id,
      name: content.destName ?? 'Destination',
      category: content.destCategory ?? 'Ville',
      photo: content.destPhoto,
      photoSm: content.destPhotoSm,
    }
    if (!existing) pageOnly++

    const html = buildHtml(content, dest, { css: cssHref, preloadFonts: fonts })
    const md = buildMarkdown(content, dest)

    const outDir = path.join(DIST, 'destinations', content.id)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')
    fs.writeFileSync(path.join(outDir, 'index.md'), md, 'utf8')

    count++
    console.log(`  ✓ /destinations/${content.id}/ (HTML ${(html.length / 1024).toFixed(1)} KB · MD ${(md.length / 1024).toFixed(1)} KB)`)
  }

  console.log(`\n✅ Generated ${count} destination page${count > 1 ? 's' : ''} under dist/destinations/`)
  if (pageOnly) console.log(`   (${pageOnly} of them are page-only — no entry in destinations[])`)
}

main()
