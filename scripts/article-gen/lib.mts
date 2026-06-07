/**
 * Helpers partagés du pipeline de génération d'articles Taxi Julien.
 * Store d'articles (src/data/articles.json), file de sujets, sélection d'image,
 * validation de schéma, scan de phrases interdites, sauvegarde des brouillons.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { destinations } from '../../src/data/taxi.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
export const ROOT = join(HERE, '..', '..')
export const ARTICLES_PATH = join(ROOT, 'src', 'data', 'articles.json')
export const TOPICS_PATH = join(HERE, 'topics.json')
export const DRAFTS_DIR = join(HERE, '_drafts')
export const REPORTS_DIR = join(HERE, 'run-reports')
export const PUBLIC_PHOTOS = join(ROOT, 'public', 'photos')

export const SEASONS = ['Hiver', 'Printemps', 'Été', 'Automne', "Toute l'année"] as const
export type Season = (typeof SEASONS)[number]

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'cta'; label: string; destinationId?: string }

export interface Article {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  hero: string
  heroSm: string
  date: string
  season: Season
  readTime: string
  tags: string[]
  body: ArticleBlock[]
  ctaDestinationId?: string
}

/** Ce que le modèle DOIT produire (le script complète slug/date/readTime/hero). */
export interface GeneratedArticle {
  title: string
  subtitle: string
  excerpt: string
  season: Season
  tags: string[]
  body: ArticleBlock[]
  ctaDestinationId?: string
}

export interface Topic {
  id: string
  title: string
  brief: string
  ctaDestinationId: string | null
  season: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'published' | 'drafted'
  publishedSlug: string | null
  publishedAt: string | null
}

// ---------- IO JSON ----------

export function readArticles(): Article[] {
  return JSON.parse(readFileSync(ARTICLES_PATH, 'utf8')) as Article[]
}

/** Ajoute l'article EN TÊTE (plus récent d'abord) et réécrit le store. */
export function prependArticle(article: Article): void {
  const all = readArticles()
  all.unshift(article)
  writeFileSync(ARTICLES_PATH, JSON.stringify(all, null, 2) + '\n')
}

export function slugExists(slug: string): boolean {
  return readArticles().some((a) => a.slug === slug)
}

interface TopicsFile {
  _comment?: string
  topics: Topic[]
}

export function readTopicsFile(): TopicsFile {
  return JSON.parse(readFileSync(TOPICS_PATH, 'utf8')) as TopicsFile
}

/** 1er sujet 'pending', priorité high > medium > low, ordre du fichier ensuite. */
export function pickNextTopic(): Topic | null {
  const { topics } = readTopicsFile()
  const rank = { high: 0, medium: 1, low: 2 } as const
  const pending = topics
    .filter((t) => t.status === 'pending')
    .sort((a, b) => rank[a.priority] - rank[b.priority])
  return pending[0] ?? null
}

export function updateTopic(id: string, patch: Partial<Topic>): void {
  const file = readTopicsFile()
  const t = file.topics.find((x) => x.id === id)
  if (!t) return
  Object.assign(t, patch)
  writeFileSync(TOPICS_PATH, JSON.stringify(file, null, 2) + '\n')
}

// ---------- Fichiers de connaissance ----------

export function loadKnowledge(): {
  siteContext: string
  voiceProfile: string
  bannedPhrases: string[]
} {
  const siteContext = readFileSync(join(HERE, 'site-context.md'), 'utf8')
  const voiceProfile = readFileSync(join(HERE, 'voice-profile.md'), 'utf8')
  const bannedRaw = readFileSync(join(HERE, 'banned-phrases.txt'), 'utf8')
  const bannedPhrases = bannedRaw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  return { siteContext, voiceProfile, bannedPhrases }
}

// ---------- Texte & validation ----------

export function bodyToPlainText(body: ArticleBlock[]): string {
  return body
    .map((b) => {
      if (b.type === 'p' || b.type === 'h3') return b.text
      if (b.type === 'ul') return b.items.join(' ')
      if (b.type === 'quote') return b.text
      if (b.type === 'cta') return b.label
      return ''
    })
    .join('\n')
}

export function wordCount(body: ArticleBlock[]): number {
  return bodyToPlainText(body).split(/\s+/).filter(Boolean).length
}

export function estimateReadTime(body: ArticleBlock[]): string {
  const minutes = Math.max(2, Math.round(wordCount(body) / 200))
  return `${minutes} min`
}

/** Retourne la liste des phrases interdites présentes (insensible à la casse). */
export function scanBannedPhrases(text: string, banned: string[]): string[] {
  const lower = text.toLowerCase()
  return banned.filter((p) => lower.includes(p.toLowerCase()))
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // enlève les accents
    .toLowerCase()
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 70)
    .replace(/-+$/g, '')
}

/** Garantit un slug unique vis-à-vis du store (suffixe -2, -3… si collision). */
export function uniqueSlug(base: string): string {
  let slug = base
  let n = 2
  while (slugExists(slug)) {
    slug = `${base}-${n++}`
  }
  return slug
}

// ---------- Sélection de l'image hero ----------

function smVariant(photo: string): string {
  // /photos/dest-cassis.jpg -> /photos/dest-cassis-sm.jpg si le fichier existe
  const sm = photo.replace(/(\.[a-z]+)$/i, '-sm$1')
  const rel = sm.replace(/^\//, '')
  if (existsSync(join(ROOT, 'public', rel.replace(/^public\//, '')))) return sm
  if (existsSync(join(ROOT, rel))) return sm
  return photo
}

/**
 * Choisit l'image hero. Priorité : photo de la destination liée au CTA,
 * sinon photo générique de l'aéroport (service principal).
 */
export function pickHero(ctaDestinationId?: string | null): { hero: string; heroSm: string } {
  let hero = '/photos/hero.jpg'
  if (ctaDestinationId) {
    const d = destinations.find((x) => x.id === ctaDestinationId)
    if (d?.photo) hero = d.photo
  }
  return { hero, heroSm: smVariant(hero) }
}

/** Liste les ids de destinations valides (pour valider ctaDestinationId). */
export function validDestinationIds(): Set<string> {
  return new Set(destinations.map((d) => d.id))
}

// ---------- Validation de schéma ----------

export function validateGenerated(obj: unknown): {
  ok: boolean
  errors: string[]
  value?: GeneratedArticle
} {
  const errors: string[] = []
  const o = obj as Record<string, unknown>
  if (!o || typeof o !== 'object') return { ok: false, errors: ['réponse non-objet'] }

  const str = (k: string) => typeof o[k] === 'string' && (o[k] as string).trim().length > 0
  if (!str('title')) errors.push('title manquant/vide')
  if (!str('subtitle')) errors.push('subtitle manquant/vide')
  if (!str('excerpt')) errors.push('excerpt manquant/vide')
  if (typeof o.season !== 'string' || !SEASONS.includes(o.season as Season))
    errors.push(`season invalide (attendu : ${SEASONS.join(' | ')})`)
  if (!Array.isArray(o.tags) || o.tags.length < 2 || o.tags.length > 4)
    errors.push('tags : il en faut 2 à 4')
  if (!Array.isArray(o.body) || o.body.length < 4)
    errors.push('body : au moins 4 blocs requis')

  const validIds = validDestinationIds()
  if (o.ctaDestinationId != null && !validIds.has(o.ctaDestinationId as string))
    errors.push(`ctaDestinationId inconnu : ${String(o.ctaDestinationId)}`)

  if (Array.isArray(o.body)) {
    const types = new Set(['p', 'h3', 'ul', 'quote', 'cta'])
    o.body.forEach((b: unknown, i: number) => {
      const blk = b as Record<string, unknown>
      if (!blk || !types.has(blk.type as string)) {
        errors.push(`body[${i}] : type invalide`)
        return
      }
      if ((blk.type === 'p' || blk.type === 'h3') && typeof blk.text !== 'string')
        errors.push(`body[${i}] (${blk.type}) : text manquant`)
      if (blk.type === 'ul' && (!Array.isArray(blk.items) || blk.items.length === 0))
        errors.push(`body[${i}] (ul) : items manquant`)
      if (blk.type === 'quote' && typeof blk.text !== 'string')
        errors.push(`body[${i}] (quote) : text manquant`)
      if (blk.type === 'cta' && typeof blk.label !== 'string')
        errors.push(`body[${i}] (cta) : label manquant`)
    })
    const hasCta = o.body.some((b: unknown) => (b as { type: string }).type === 'cta')
    if (!hasCta) errors.push('body : un bloc cta final est requis')
  }

  if (errors.length) return { ok: false, errors }
  return { ok: true, errors: [], value: obj as GeneratedArticle }
}

// ---------- Brouillons & rapports ----------

export function saveDraft(payload: unknown, slugBase: string, reason: string): string {
  if (!existsSync(DRAFTS_DIR)) mkdirSync(DRAFTS_DIR, { recursive: true })
  const file = join(DRAFTS_DIR, `${slugBase || 'sans-slug'}.json`)
  writeFileSync(file, JSON.stringify({ reason, payload }, null, 2) + '\n')
  return file
}

export function listDrafts(): string[] {
  if (!existsSync(DRAFTS_DIR)) return []
  return readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.json'))
}

export function saveReport(report: unknown, stamp: string): string {
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true })
  const file = join(REPORTS_DIR, `${stamp}.json`)
  writeFileSync(file, JSON.stringify(report, null, 2) + '\n')
  return file
}

// Logger simple, horodaté par l'appelant (pas de Date.now ici).
export function log(msg: string, extra?: Record<string, unknown>): void {
  if (extra) console.log(`▸ ${msg}`, JSON.stringify(extra))
  else console.log(`▸ ${msg}`)
}
