/**
 * Client Anthropic minimal et autonome pour la génération d'articles.
 * Gère : prompt caching (système), web_search (fact-check), calcul de coût.
 * Adapté du pipeline portfolio — aucune dépendance externe au projet.
 */
import Anthropic from '@anthropic-ai/sdk'

export interface ClaudeCallInput {
  model: string
  systemPrompt: string
  userMessage: string
  /** Active le cache de prompt sur le bloc système (économise les répétitions). */
  cacheSystem?: boolean
  /** Active l'outil de recherche web (utilisé au fact-check). */
  enableWebSearch?: boolean
  maxTokens?: number
  temperature?: number
}

export interface ClaudeCallResult {
  text: string
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  costUsd: number
  model: string
  stopReason: string | null
}

// Tarifs par million de tokens (USD). À mettre à jour si Anthropic change ses prix.
const PRICING: Record<
  string,
  { input: number; output: number; cacheRead: number; cacheWrite: number }
> = {
  'claude-opus-4-7': { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
  'claude-sonnet-4-6': { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  'claude-haiku-4-5': { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
}

function redact(s: string): string {
  return s.replace(/sk-ant-[A-Za-z0-9_-]+/g, 'sk-ant-***')
}

let client: Anthropic | null = null
function getClient(): Anthropic {
  if (client) return client
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY manquante. La définir dans .env (local) ou dans les secrets ' +
        'GitHub Actions (prod). Ne jamais la coller dans le chat ni la committer.',
    )
  }
  client = new Anthropic({ apiKey })
  return client
}

export async function callClaude(input: ClaudeCallInput): Promise<ClaudeCallResult> {
  const c = getClient()

  const system = input.cacheSystem
    ? [
        {
          type: 'text' as const,
          text: input.systemPrompt,
          cache_control: { type: 'ephemeral' as const },
        },
      ]
    : input.systemPrompt

  const tools: Anthropic.ToolUnion[] | undefined = input.enableWebSearch
    ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }]
    : undefined

  const response = await c.messages.create({
    model: input.model,
    max_tokens: input.maxTokens ?? 8000,
    temperature: input.temperature ?? 0.7,
    system,
    messages: [{ role: 'user', content: input.userMessage }],
    tools,
  })

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')

  const usage = response.usage
  const pricing = PRICING[input.model] ?? PRICING['claude-sonnet-4-6']
  const costUsd =
    (usage.input_tokens * pricing.input) / 1_000_000 +
    (usage.output_tokens * pricing.output) / 1_000_000 +
    ((usage.cache_read_input_tokens ?? 0) * pricing.cacheRead) / 1_000_000 +
    ((usage.cache_creation_input_tokens ?? 0) * pricing.cacheWrite) / 1_000_000

  return {
    text,
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheReadTokens: usage.cache_read_input_tokens ?? 0,
    cacheWriteTokens: usage.cache_creation_input_tokens ?? 0,
    costUsd,
    model: input.model,
    stopReason: response.stop_reason,
  }
}

/**
 * Extrait le premier objet/tableau JSON d'une chaîne. Tolère le texte avant/après
 * et équilibre les accolades/crochets en ignorant ce qui est entre guillemets.
 */
export function extractJson<T = unknown>(raw: string): T {
  const start = raw.search(/[{[]/)
  if (start < 0) throw new Error('Aucun JSON trouvé dans la réponse Claude.')
  let depth = 0
  let end = -1
  let inString = false
  let escape = false
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i]
    if (escape) {
      escape = false
      continue
    }
    if (ch === '\\') {
      escape = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (ch === '{' || ch === '[') depth++
    if (ch === '}' || ch === ']') {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  if (end < 0) throw new Error('JSON non équilibré dans la réponse Claude.')
  const slice = raw.slice(start, end)
  try {
    return JSON.parse(slice) as T
  } catch (err) {
    throw new Error(
      `Échec du parsing JSON : ${err instanceof Error ? err.message : String(err)}\n` +
        `Extrait : ${redact(slice.slice(0, 200))}`,
    )
  }
}
