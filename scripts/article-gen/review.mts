/**
 * Contrôle qualité d'un article généré — le « double check » demandé :
 *   1. Cohérence avec le site de Julien (source de vérité = site-context.md).
 *   2. Exactitude factuelle (recherche web activée pour vérifier lieux/durées/faits).
 *   3. Anti-AI-slop (pas de remplissage générique, pas de tournures interdites).
 *
 * Combine des contrôles locaux déterministes (phrases interdites, longueur) et
 * le jugement de Claude. Renvoie un verdict : publish | revise | reject.
 */
import { callClaude, extractJson } from './claude-client.mts'
import {
  bodyToPlainText,
  scanBannedPhrases,
  wordCount,
  type GeneratedArticle,
} from './lib.mts'
import type { Knowledge } from './generate.mts'

const REVIEW_MODEL = process.env.ARTICLE_REVIEW_MODEL || 'claude-sonnet-4-6'

export interface ReviewResult {
  verdict: 'publish' | 'revise' | 'reject'
  coherent: boolean
  factual: boolean
  distinctive: boolean
  /** Problèmes corrigeables à transmettre à reviseArticle(). */
  fixableProblems: string[]
  /** Problèmes de fond (incohérence grave) qui justifient un reject. */
  blockingProblems: string[]
  costUsd: number
}

interface ClaudeVerdict {
  coherent: boolean
  coherenceIssues: string[]
  factual: boolean
  factIssues: string[]
  distinctive: boolean
  slopIssues: string[]
  verdict: 'publish' | 'revise' | 'reject'
  fixableProblems: string[]
}

function fullText(a: GeneratedArticle): string {
  return [a.title, a.subtitle, a.excerpt, bodyToPlainText(a.body)].join('\n')
}

export async function reviewArticle(
  article: GeneratedArticle,
  k: Knowledge,
): Promise<ReviewResult> {
  // ---- 1. Contrôles locaux déterministes ----
  const text = fullText(article)
  const bannedHits = scanBannedPhrases(text, k.bannedPhrases)
  const words = wordCount(article.body)

  const localProblems: string[] = []
  if (bannedHits.length) {
    localProblems.push(
      `Tournures interdites à reformuler : ${bannedHits.map((p) => `« ${p} »`).join(', ')}`,
    )
  }
  if (words < 450) localProblems.push(`Article trop court (${words} mots, vise 600–1000).`)
  if (words > 1300) localProblems.push(`Article trop long (${words} mots, vise 600–1000).`)

  // ---- 2. Jugement de Claude (cohérence + faits + slop) ----
  const system = [
    "Tu es l'éditeur en chef sceptique du blog de Taxi Julien (taxi à Marseille).",
    'Ton rôle : vérifier un article AVANT publication selon trois axes, sans complaisance.',
    '',
    '== AXE 1 — COHÉRENCE AVEC LE SITE (le plus important) ==',
    'Le contexte ci-dessous est la SOURCE DE VÉRITÉ. Signale toute affirmation de',
    "l'article qui : contredit ces faits ; invente un service, un prix ou une",
    'promesse absents ; exagère (ex : « le moins cher », « réservation en ligne »,',
    "ancienneté fausse). Un prix de trajet doit figurer dans le contexte, sinon",
    "l'article doit dire « forfait sur devis » — pas un montant inventé.",
    '',
    '== AXE 2 — EXACTITUDE FACTUELLE ==',
    'Vérifie les faits vérifiables du monde réel (lieux, terminaux, durées de trajet',
    'plausibles, noms d’hôpitaux, périodes de saison). Utilise la recherche web si',
    'un doute existe. Signale toute affirmation factuellement fausse ou douteuse.',
    '',
    '== AXE 3 — ANTI-REMPLISSAGE (AI-slop) ==',
    'L’article doit être concret et utile (détails de terrain, conseils actionnables).',
    'Signale : intro/conclusion creuses, généralités sans valeur, superlatifs vides,',
    'listes inutiles, ton « article SEO » impersonnel.',
    '',
    '== CONTEXTE DU SITE (source de vérité) ==',
    k.siteContext,
    '',
    '== FORMAT DE RÉPONSE — UNIQUEMENT ce JSON ==',
    `{
  "coherent": true/false,
  "coherenceIssues": ["..."],
  "factual": true/false,
  "factIssues": ["..."],
  "distinctive": true/false,
  "slopIssues": ["..."],
  "verdict": "publish" | "revise" | "reject",
  "fixableProblems": ["liste d'instructions de correction concrètes si verdict=revise"]
}`,
    '',
    'RÈGLE DE VERDICT :',
    '- "publish" : aligné, factuel, utile. Aucun problème bloquant.',
    '- "revise" : problèmes réels mais corrigeables sans tout réécrire (formulation,',
    '  prix à remplacer par « sur devis », fait à corriger, passage générique à étoffer).',
    '- "reject" : sujet hors périmètre, incohérence de fond, ou article inutilisable.',
  ].join('\n')

  const userMessage = [
    'Voici l’article à contrôler (JSON). Analyse-le selon les trois axes et rends ton verdict.',
    '',
    JSON.stringify(article, null, 2),
  ].join('\n')

  const res = await callClaude({
    model: REVIEW_MODEL,
    systemPrompt: system,
    userMessage,
    cacheSystem: true,
    enableWebSearch: true,
    temperature: 0.2,
    maxTokens: 4000,
  })

  let v: ClaudeVerdict
  try {
    v = extractJson<ClaudeVerdict>(res.text)
  } catch {
    // Si le juge ne renvoie pas de JSON exploitable, on draft par prudence.
    return {
      verdict: 'reject',
      coherent: false,
      factual: false,
      distinctive: false,
      fixableProblems: [],
      blockingProblems: ['Le contrôle qualité n’a pas renvoyé de verdict exploitable.'],
      costUsd: res.costUsd,
    }
  }

  // ---- 3. Fusion local + Claude ----
  const fixableProblems = [
    ...localProblems,
    ...(v.fixableProblems ?? []),
    ...(v.factIssues ?? []),
    ...(v.slopIssues ?? []),
  ]
  // Les incohérences avec le site sont prioritaires : corrigeables mais critiques.
  const coherenceProblems = v.coherenceIssues ?? []

  const coherent = v.coherent !== false && coherenceProblems.length === 0
  const factual = v.factual !== false
  const distinctive = v.distinctive !== false

  // Décision finale (le plus strict entre Claude et les contrôles locaux).
  let verdict: ReviewResult['verdict'] = v.verdict ?? 'reject'
  const blockingProblems: string[] = []

  if (v.verdict === 'reject') {
    blockingProblems.push(...coherenceProblems, ...(v.factIssues ?? []))
  } else if (
    bannedHits.length ||
    localProblems.length ||
    coherenceProblems.length ||
    !factual ||
    !distinctive ||
    v.verdict === 'revise'
  ) {
    // Tout problème détecté → au minimum une révision.
    verdict = 'revise'
    fixableProblems.unshift(...coherenceProblems)
  } else {
    verdict = 'publish'
  }

  return {
    verdict,
    coherent,
    factual,
    distinctive,
    fixableProblems: [...new Set(fixableProblems)].filter(Boolean),
    blockingProblems,
    costUsd: res.costUsd,
  }
}
