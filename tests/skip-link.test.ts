// Lien d'évitement (« Aller au contenu ») des pages générées par
// build-destinations : il doit viser un élément de la page même. Un
// href="/#contenu" a renvoyé les utilisateurs clavier vers l'accueil sur
// 79 pages. Lancer : npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildHtml, resolveDest } from '../scripts/build-destinations.ts'
import { destContent } from '../src/data/taxi.ts'

test("le lien d'évitement de chaque page générée vise sa propre page", () => {
  for (const content of destContent) {
    const html = buildHtml(content, resolveDest(content), { css: '/assets/index.css', preloadFonts: [] })
    const href = html.match(/<a href="([^"]*)" class="skip-link"/)?.[1] ?? ''
    assert.match(href, /^#./, `${content.id} : lien d'évitement « ${href} »`)
    assert.ok(html.includes(`id="${href.slice(1)}"`), `${content.id} : cible ${href} absente de la page`)
  }
})
