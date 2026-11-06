// Adresse déclarée à Google (JSON-LD, pieds de page) : elle doit être celle du
// siège inscrit au registre SIRENE, et l'accueil statique doit la répéter à
// l'identique. Un 13008 sans source a contredit le 13013 officiel pendant
// des mois. Lancer : npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { business } from '../src/data/taxi.ts'

test("le code postal déclaré est celui du siège", () => {
  assert.ok(
    business.registeredOffice.includes(business.postalCode),
    `${business.postalCode} absent du siège « ${business.registeredOffice} »`,
  )
})

test("le JSON-LD de l'accueil reprend l'adresse et la position de business", () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const local = blocks.map(m => JSON.parse(m[1])).find(x => x['@type'] === 'LocalBusiness')
  assert.equal(local.address.postalCode, business.postalCode)
  assert.deepEqual([local.geo.latitude, local.geo.longitude], [business.geo.lat, business.geo.lng])
})
