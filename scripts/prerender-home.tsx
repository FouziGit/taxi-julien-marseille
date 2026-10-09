#!/usr/bin/env tsx
/**
 * Post-build : prérend l'accueil dans dist/index.html.
 *
 * Pourquoi : la page d'accueil (la plus forte du domaine) ne contenait que
 * 17 mots visibles sans JavaScript. Googlebot rend le JS, mais tard et sans
 * garantie ; un HTML complet est indexé dès le premier crawl et porte les
 * liens internes vers toutes les destinations.
 *
 * `prerender` (react-dom/static) attend la résolution des `lazy()` et des
 * Suspense avant de produire le HTML : toutes les sections sont rendues.
 * Le client hydrate ensuite (src/main.tsx).
 *
 * Lancer avec : tsx --tsconfig tsconfig.app.json scripts/prerender-home.tsx
 * (le tsconfig de l'app fournit jsx: react-jsx aux composants).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { prerender } from 'react-dom/static'
import { Root } from '../src/root'

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const file = path.join(DIST, 'index.html')
const html = fs.readFileSync(file, 'utf8')
const mount = '<div id="root"></div>'
if (!html.includes(mount)) throw new Error('dist/index.html : #root vide introuvable (déjà prérendu ?)')

const { prelude } = await prerender(createElement(Root))
const body = await new Response(prelude).text()
const out = html.replace(mount, `<div id="root">${body}</div>`)
fs.writeFileSync(file, out, 'utf8')

// Auto-contrôle : l'accueil doit porter du vrai texte et la FAQ.
const text = out.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')
const words = text.split(/\s+/).filter(Boolean).length
const links = new Set(out.match(/href="\/destinations\/[a-z0-9-]+\/"/g) ?? []).size
console.log(`  ✓ / prérendu (${words} mots visibles, ${links} liens destinations uniques)`)
if (words < 1500) throw new Error(`Prérendu trop court : ${words} mots (< 1500)`)
if (!text.includes('Questions fréquentes')) throw new Error("Prérendu sans la FAQ : une section lazy n'a pas été résolue")
if (links < 43) throw new Error(`Accueil : ${links} liens destinations (< 43) — le pied de page ne liste pas tout`)
