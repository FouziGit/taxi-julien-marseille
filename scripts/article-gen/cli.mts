/**
 * Orchestrateur — génère UN article de blog pour Taxi Julien, le contrôle, puis
 * le publie (src/data/articles.json) ou le met en brouillon (_drafts/) s'il échoue.
 *
 * Usage :
 *   npm run gen:article            # un article : génère → contrôle → publie/draft
 *   npm run gen:article -- --dry-run   # génère + contrôle, n'écrit rien
 *   npm run gen:article -- --topic=<id>  # force un sujet précis
 *
 * Prérequis : ANTHROPIC_API_KEY (dans .env en local, en secret GitHub en prod).
 */
import {
  loadKnowledge,
  pickNextTopic,
  readTopicsFile,
  updateTopic,
  prependArticle,
  pickHero,
  slugify,
  uniqueSlug,
  estimateReadTime,
  saveDraft,
  saveReport,
  log,
  type Article,
  type Topic,
  type GeneratedArticle,
} from './lib.mts'
import { generateArticle, reviseArticle, type Knowledge } from './generate.mts'
import { reviewArticle } from './review.mts'

const MAX_GEN_RETRIES = 3
const BACKOFF_MS = [1000, 5000, 25000]
const MAX_REVISE_PASSES = 2

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface RunResult {
  status: 'published' | 'drafted' | 'failed' | 'skipped'
  topicId?: string
  slug?: string
  costUsd: number
  reason?: string
  problems?: string[]
}

function parseArgs(argv: string[]) {
  const dryRun = argv.includes('--dry-run')
  const topicArg = argv.find((a) => a.startsWith('--topic='))
  const forcedTopicId = topicArg ? topicArg.split('=')[1] : undefined
  return { dryRun, forcedTopicId }
}

function resolveTopic(forcedId?: string): Topic | null {
  if (forcedId) {
    const t = readTopicsFile().topics.find((x) => x.id === forcedId)
    if (!t) throw new Error(`Sujet introuvable : ${forcedId}`)
    return t
  }
  return pickNextTopic()
}

function assembleArticle(gen: GeneratedArticle, isoDate: string): Article {
  const { hero, heroSm } = pickHero(gen.ctaDestinationId)
  const slug = uniqueSlug(slugify(gen.title))
  const article: Article = {
    slug,
    title: gen.title,
    subtitle: gen.subtitle,
    excerpt: gen.excerpt,
    hero,
    heroSm,
    date: isoDate,
    season: gen.season,
    readTime: estimateReadTime(gen.body),
    tags: gen.tags,
    body: gen.body,
  }
  if (gen.ctaDestinationId) article.ctaDestinationId = gen.ctaDestinationId
  return article
}

async function generateWithRetries(topic: Topic, k: Knowledge) {
  let lastErr: unknown
  for (let attempt = 0; attempt < MAX_GEN_RETRIES; attempt++) {
    try {
      return await generateArticle(topic, k)
    } catch (err) {
      lastErr = err
      log(`génération échouée (essai ${attempt + 1}/${MAX_GEN_RETRIES})`, {
        error: err instanceof Error ? err.message : String(err),
      })
      if (attempt < MAX_GEN_RETRIES - 1) await sleep(BACKOFF_MS[attempt])
    }
  }
  throw lastErr
}

export async function runOnce(argv: string[] = []): Promise<RunResult> {
  const { dryRun, forcedTopicId } = parseArgs(argv)
  const k = loadKnowledge()
  let costUsd = 0

  const topic = resolveTopic(forcedTopicId)
  if (!topic) {
    log('Aucun sujet « pending » dans la file. Rien à faire.')
    return { status: 'skipped', costUsd, reason: 'file de sujets vide' }
  }
  log(`Sujet retenu : ${topic.id}`, { titre: topic.title, priorité: topic.priority })

  // 1) Génération
  const gen = await generateWithRetries(topic, k)
  costUsd += gen.costUsd
  let current: GeneratedArticle = gen.article
  log('Article généré', { titre: current.title })

  // 2) Contrôle + révisions ciblées
  let review = await reviewArticle(current, k)
  costUsd += review.costUsd
  log('Contrôle qualité', {
    verdict: review.verdict,
    cohérent: review.coherent,
    factuel: review.factual,
    distinctif: review.distinctive,
  })

  let pass = 0
  while (review.verdict === 'revise' && pass < MAX_REVISE_PASSES) {
    pass++
    log(`Révision ${pass}/${MAX_REVISE_PASSES}`, { problèmes: review.fixableProblems.length })
    const revised = await reviseArticle(current, review.fixableProblems, k)
    costUsd += revised.costUsd
    current = revised.article
    review = await reviewArticle(current, k)
    costUsd += review.costUsd
    log('Re-contrôle', { verdict: review.verdict })
  }

  const isoDate = new Date().toISOString().slice(0, 10)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')

  // 3) Décision finale
  if (review.verdict === 'publish') {
    const article = assembleArticle(current, isoDate)
    if (dryRun) {
      log('[dry-run] Article VALIDÉ (non écrit)', { slug: article.slug })
      console.log(JSON.stringify(article, null, 2))
      return { status: 'published', topicId: topic.id, slug: article.slug, costUsd, reason: 'dry-run' }
    }
    prependArticle(article)
    updateTopic(topic.id, {
      status: 'published',
      publishedSlug: article.slug,
      publishedAt: isoDate,
    })
    saveReport(
      { stamp, status: 'published', topic: topic.id, slug: article.slug, costUsd, review },
      stamp,
    )
    log('✅ PUBLIÉ', { slug: article.slug, coûtUsd: Number(costUsd.toFixed(4)) })
    return { status: 'published', topicId: topic.id, slug: article.slug, costUsd }
  }

  // Échec du contrôle → brouillon pour relecture humaine, sujet remis de côté.
  const problems = [...review.blockingProblems, ...review.fixableProblems]
  const slugBase = slugify(current.title)
  if (dryRun) {
    log('[dry-run] Article REJETÉ (non écrit)', { verdict: review.verdict, problèmes: problems })
    return { status: 'drafted', topicId: topic.id, costUsd, reason: review.verdict, problems }
  }
  const draftFile = saveDraft({ topic: topic.id, article: current, review }, slugBase, review.verdict)
  updateTopic(topic.id, { status: 'drafted' })
  saveReport({ stamp, status: 'drafted', topic: topic.id, costUsd, review, draftFile }, stamp)
  log('📝 MIS EN BROUILLON (relecture humaine)', { fichier: draftFile, problèmes: problems.length })
  return { status: 'drafted', topicId: topic.id, costUsd, reason: review.verdict, problems }
}

async function main() {
  // Charge .env en local ; en CI la clé vient des variables d'environnement.
  try {
    process.loadEnvFile()
  } catch {
    /* pas de .env (CI) — on compte sur process.env */
  }
  try {
    const result = await runOnce(process.argv.slice(2))
    log('Terminé', {
      statut: result.status,
      slug: result.slug ?? '—',
      coûtUsd: Number(result.costUsd.toFixed(4)),
    })
    // published / drafted / skipped sont des issues normales → succès CI.
    process.exit(0)
  } catch (err) {
    console.error('❌ Échec dur du pipeline :', err instanceof Error ? err.stack : String(err))
    process.exit(1)
  }
}

main()
