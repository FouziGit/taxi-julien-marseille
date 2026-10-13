// Fusion des avis Google en direct avec les avis embarqués. Lancer : npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergeReviews, type LiveReview } from '../src/lib/reviews.ts'
import type { Testimonial } from '../src/data/taxi.ts'

const embedded: Testimonial[] = [
  { author: 'Amelie Lesueur', context: 'Hôtel → bateau → gare', rating: 5, text: 'Au top.' },
  { author: 'Patrice Duchan', context: 'Van 6 personnes', rating: 5, text: 'Parfait.' },
]

const live: LiveReview[] = [
  { name: 'Amélie LESUEUR', initial: 'A', date: 'il y a 2 semaines', rating: 5, text: 'Au top du top.' },
  { name: 'Nouveau Client', initial: 'N', date: 'il y a 3 jours', rating: 4, text: 'Très bien.' },
  { name: 'Sans Texte', initial: 'S', date: 'il y a 1 jour', rating: 5, text: '' },
]

test('les avis en direct passent en tête, datés et marqués Google', () => {
  const out = mergeReviews(live, embedded)
  assert.equal(out[0].author, 'Amélie LESUEUR')
  assert.equal(out[0].context, 'il y a 2 semaines · Google')
  assert.equal(out[0].rating, 5)
  assert.equal(out[1].author, 'Nouveau Client')
  assert.equal(out[1].rating, 4)
})

test('un avis embarqué du même auteur (accents, casse) est retiré, les autres restent', () => {
  const authors = mergeReviews(live, embedded).map(r => r.author)
  assert.deepEqual(authors, ['Amélie LESUEUR', 'Nouveau Client', 'Patrice Duchan'])
})

test('un avis en direct sans texte est ignoré ; sans avis en direct, les embarqués sont rendus tels quels', () => {
  assert.equal(mergeReviews(live, embedded).some(r => r.author === 'Sans Texte'), false)
  assert.deepEqual(mergeReviews([], embedded), embedded)
})
