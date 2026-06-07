/**
 * Génération et révision d'un article via Claude.
 * Le prompt système (voix + contexte du site + schéma + phrases interdites) est
 * mis en cache pour économiser les tokens entre la génération et la révision.
 */
import { callClaude, extractJson } from './claude-client.mts'
import {
  validateGenerated,
  type GeneratedArticle,
  type Topic,
} from './lib.mts'

export interface Knowledge {
  siteContext: string
  voiceProfile: string
  bannedPhrases: string[]
}

const SCHEMA_DOC = `FORMAT DE SORTIE — réponds UNIQUEMENT avec un objet JSON valide, rien avant ni après.

{
  "title": "Titre court et concret (≤ 70 caractères, sans superlatif vide)",
  "subtitle": "Sous-titre d'une ligne qui précise l'angle",
  "excerpt": "Résumé accrocheur de 1 à 2 phrases (140–200 caractères) pour la carte du blog",
  "season": "Hiver | Printemps | Été | Automne | Toute l'année",
  "tags": ["2 à 4 tags courts", "ex: Aéroport", "Pratique"],
  "ctaDestinationId": "id de destination lié OU à omettre si aucun ne correspond",
  "body": [
    { "type": "p", "text": "Paragraphe d'accroche (2–3 phrases)." },
    { "type": "h3", "text": "Titre de section qui répond à une vraie question" },
    { "type": "p", "text": "Paragraphe court." },
    { "type": "ul", "items": ["conseil concret 1", "conseil concret 2", "conseil concret 3"] },
    { "type": "quote", "text": "Citation utile et plausible", "author": "optionnel" },
    { "type": "cta", "label": "Réserver — appel ou WhatsApp", "destinationId": "optionnel" }
  ]
}

RÈGLES DE FORMAT :
- 600 à 1000 mots au total dans le body.
- 3 à 5 sections h3, dont AU MOINS une liste ul de conseils pratiques.
- Au plus UNE citation quote, et seulement si elle apporte une vraie voix.
- Le DERNIER bloc doit être un cta qui invite à réserver (appel ou WhatsApp).
- Le ctaDestinationId, s'il est présent, doit être un id de destination réel du site.`

function buildSystemPrompt(k: Knowledge): string {
  return [
    k.voiceProfile,
    '\n---\n',
    'CONTEXTE DU SITE — SOURCE DE VÉRITÉ. Ne jamais contredire, inventer ni exagérer ce qui suit :',
    k.siteContext,
    '\n---\n',
    SCHEMA_DOC,
    '\n---\n',
    "TOURNURES INTERDITES (n'en utilise AUCUNE, ce sont des tics d'IA) :",
    k.bannedPhrases.map((p) => `- « ${p} »`).join('\n'),
  ].join('\n')
}

const GEN_MODEL = process.env.ARTICLE_GEN_MODEL || 'claude-sonnet-4-6'

export interface GenResult {
  article: GeneratedArticle
  costUsd: number
}

export async function generateArticle(topic: Topic, k: Knowledge): Promise<GenResult> {
  const system = buildSystemPrompt(k)
  const ctaHint = topic.ctaDestinationId
    ? `Destination liée suggérée (utilise-la comme ctaDestinationId si pertinent) : ${topic.ctaDestinationId}`
    : "Aucune destination précise imposée — n'ajoute ctaDestinationId que si un id réel colle vraiment."

  const userMessage = [
    `Rédige l'article de blog suivant pour Taxi Julien.`,
    ``,
    `Titre de travail : ${topic.title}`,
    `Brief : ${topic.brief}`,
    `Saison : ${topic.season}`,
    ctaHint,
    ``,
    `Produis l'article complet au format JSON décrit dans le prompt système.`,
  ].join('\n')

  const res = await callClaude({
    model: GEN_MODEL,
    systemPrompt: system,
    userMessage,
    cacheSystem: true,
    temperature: 0.75,
    maxTokens: 8000,
  })

  const parsed = extractJson<GeneratedArticle>(res.text)
  const check = validateGenerated(parsed)
  if (!check.ok) {
    throw new Error(`Article généré invalide : ${check.errors.join(' ; ')}`)
  }
  return { article: check.value!, costUsd: res.costUsd }
}

/**
 * Révise un article en corrigeant UNIQUEMENT les problèmes signalés.
 * Renvoie l'objet complet corrigé.
 */
export async function reviseArticle(
  previous: GeneratedArticle,
  problems: string[],
  k: Knowledge,
): Promise<GenResult> {
  const system = buildSystemPrompt(k)
  const userMessage = [
    `Voici un article déjà rédigé qui contient des problèmes à corriger.`,
    ``,
    `PROBLÈMES À CORRIGER (et seulement ceux-là) :`,
    ...problems.map((p) => `- ${p}`),
    ``,
    `Article actuel (JSON) :`,
    JSON.stringify(previous, null, 2),
    ``,
    `Renvoie l'article ENTIER corrigé au même format JSON. Ne change que ce qui est`,
    `nécessaire pour résoudre les problèmes ci-dessus. Garde le reste intact.`,
  ].join('\n')

  const res = await callClaude({
    model: GEN_MODEL,
    systemPrompt: system,
    userMessage,
    cacheSystem: true,
    temperature: 0.4,
    maxTokens: 8000,
  })

  const parsed = extractJson<GeneratedArticle>(res.text)
  const check = validateGenerated(parsed)
  if (!check.ok) {
    throw new Error(`Article révisé invalide : ${check.errors.join(' ; ')}`)
  }
  return { article: check.value!, costUsd: res.costUsd }
}
