// Lancer : npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { eventForHref } from '../src/lib/track'

test('un lien tel: compte comme un Appel', () => {
  assert.equal(eventForHref('tel:+33635582472'), 'Appel')
})

test('un lien wa.me compte comme WhatsApp', () => {
  assert.equal(eventForHref('https://wa.me/33635582472?text=Bonjour'), 'WhatsApp')
})

test('un lien ordinaire ne compte pas', () => {
  assert.equal(eventForHref('https://taxijulien.com/destinations/cassis/'), null)
  assert.equal(eventForHref('mailto:taxijulien13@gmail.com'), null)
})
