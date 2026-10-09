# Relance trafic taxijulien.com — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruire la couverture de requêtes perdue à la migration Jalis → nouveau site (accueil prérendu, clusters de pages SEO, routage des vieilles URLs vers la bonne page, mesure des appels), pour ramener appels et visites au niveau N-1 puis au-delà.

**Architecture:** Le site reste un SPA React (Vite) servi par Netlify, plus des pages HTML statiques générées après le build par `scripts/build-destinations.ts` depuis `src/data/taxi.ts`. On (1) prérend l'accueil avec `react-dom/static` et on hydrate côté client, (2) on généralise le générateur (chemin, langue, type de page) pour produire des clusters (médical, arrondissements, hôtels, van/groupes, anglais, villes, événements) depuis la même source de données, (3) on génère `sitemap.xml` depuis cette source, (4) on route chaque vieille URL Jalis vers la page la plus pertinente via l'edge function, (5) on mesure visites et clics d'appel avec Plausible.

**Tech Stack:** React 19.2.5 (`react-dom/static` `prerender`, `hydrateRoot`), Vite 8, TypeScript, `tsx` 4, Netlify Edge Functions (Deno), Plausible (cookieless, sans bannière), `node:test`.

**Spec:** pas de fichier séparé. Le diagnostic et le plan validés sont résumés ci-dessous ; les exécuteurs lisent cette section avant les tâches.

## Spec (résumé du diagnostic validé le 2026-10-09)

Symptôme : −60 % d'appels et de visites vs N-1, quatre mois après la migration (juin 2026). Jalis ne faisait pas de Google Ads (confirmé par le client).

Cause principale prouvée dans le repo :
- L'ancien site avait 750+ pages longue traîne (médical CPAM/VSL, aéroport par arrondissement 13001-13016, van 7 places / groupes, hôtels, anglais, villes secondaires, gares, ports, ski, événements). Le nouveau en a 46. Les intentions perdues n'ont aucune page d'atterrissage.
- L'accueil est une coquille JS : 17 mots visibles dans `dist/index.html` contre 738 sur `/destinations/cassis/`. Aucun lien statique accueil → destinations.
- Les vieilles URLs ont été 301 vers l'accueil pendant deux mois, puis vers des pages génériques : l'intention ne correspond pas à la page cible.
- Aucune mesure : ni analytics ni suivi des clics `tel:`/WhatsApp.
- 0 page anglaise, 0 page médicale, 0 page arrondissement, 0 page hôtels, 0 page van/groupes, villes secondaires absentes (Brignoles, Le Luc, Vidauban, Cuers, Gémenos, Carnoux, Pertuis, Saint-Maximin, Le Beausset, Ollioules, La Valette, Le Pradet, Carqueiranne).
- Le blog automatique (1 article/jour) n'a plus commité depuis juillet 2026 : signal de fraîcheur perdu.

Hors repo (à faire par Nouh / Julien, non couvert par les tâches) :
- Fiche Google Business : vérifier lien = `https://taxijulien.com`, téléphone, catégorie « Service de taxi », horaires 24/7, nouvelles photos pro, services listés, collecte d'avis après course.
- Export GSC Performance 16 mois (requêtes + pages) pour quantifier les requêtes perdues.
- Ajouter `taxijulien.com` dans le compte Plausible (sinon les événements sont ignorés).
- Après déploiement final : renvoyer le sitemap dans GSC et demander l'indexation des six nouvelles pages hub (tâche 14).

## Global Constraints

- Aucun prix inventé. Seuls les forfaits présents dans `fareTables` / `pricing` de `src/data/taxi.ts`, ou la mention « sur devis », ou le texte existant « 70 – 110 € selon véhicule et nombre de passagers ».
- Aucun lieu, établissement ou chiffre inventé : noms réels uniquement ; distances marquées « ~ » si non vérifiées ; les distances des villes secondaires sont vérifiées par WebSearch avant d'être écrites.
- Aucune dépendance npm ajoutée (`react-dom/static` et `tsx` sont déjà installés).
- Contenu en français, sauf les pages du cluster `/en/`.
- Chaque page générée : `seoTitle` ≤ 60 caractères, `seoDescription` ≤ 155, canonical, JSON-LD, un seul `h1`, FAQ ≥ 3 questions, ≥ 3 liens internes (`related`).
- Un commit par tâche. `npm run build` vert avant chaque push. Push sur `main` = déploiement production Netlify.
- Toute nouvelle origine réseau est ajoutée explicitement à la CSP dans `netlify.toml`.
- Rien n'est supprimé hors périmètre de la tâche (pas d'audit ponytail lancé ; `public/sitemap.xml` est la seule suppression prévue, tâche 4).
- Prose persistée (code, commentaires, commits, ce plan) en français normal ; pas de style caveman dans les fichiers.

## Review Focus

1. Hydratation : `src/sections/Blog.tsx:206` formate une date avec `toLocaleDateString('fr-FR')` ; Node et le navigateur peuvent différer → avertissement « Hydration failed » et re-rendu client. Test pinné en tâche 2, étape 7 (console du navigateur intégré : 0 erreur contenant « hydrat »).
2. `lazy()` + prérendu : si `prerender` ne résout pas un chunk, la section sort en `SectionFallback` (div vide) et la FAQ/les tarifs manquent du HTML. Test pinné en tâche 2, étape 4 (assertion `mots ≥ 1500` et présence de « Questions fréquentes » dans `dist/index.html`).
3. Routage legacy : une URL contenant « van » et une ville doit aller à la ville, pas à la page van ; une URL « conventionné … toulon » doit aller à la page médicale, pas à Toulon. Test pinné en tâche 10, étape 1.
4. Générateur : une page `kind: 'service'` sans `path` tomberait sous `/destinations/<id>/`. Test pinné en tâche 4, étape 3 (le builder lève une erreur).
5. CSP : Plausible bloqué en silence si `connect-src` oublie `https://plausible.io` → 0 donnée sans erreur visible. Test pinné en tâche 1, étape 6 (requête `plausible.io/api/event` en 202 dans le navigateur intégré).

---

### Task 1: Mesure — Plausible + événements Appel / WhatsApp / Formulaire

**Files:**
- Modify: `index.html:206` (avant `</head>`)
- Modify: `netlify.toml:37` (CSP)
- Modify: `src/App.tsx:1,30-33` (listener délégué)
- Modify: `scripts/build-destinations.ts:304-306` (template des pages statiques)
- Modify: `src/data/taxi.ts:1462` (`pricing.legalNote` pointe vers l'ancienne URL Jalis)

**Interfaces:**
- Consumes: rien.
- Produces: `window.plausible(name: string)` disponible sur toutes les pages ; événements nommés `Appel`, `WhatsApp`, `Formulaire`.

- [ ] **Step 1: Script Plausible + file d'attente dans `index.html`**

Insérer juste avant `</head>` (ligne 206) :

```html
    <!-- Plausible : analytics sans cookie (pas de bannière). Événements personnalisés
         via window.plausible(); la file d'attente ci-dessous absorbe les clics
         survenant avant le chargement du script. -->
    <script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>
    <script defer data-domain="taxijulien.com" src="https://plausible.io/js/script.js"></script>
```

- [ ] **Step 2: Autoriser Plausible dans la CSP**

Dans `netlify.toml` ligne 37, remplacer `script-src 'self' 'unsafe-inline';` par `script-src 'self' 'unsafe-inline' https://plausible.io;` et `connect-src 'self';` par `connect-src 'self' https://plausible.io;`. Le reste de la ligne ne change pas.

- [ ] **Step 3: Listener délégué dans `src/App.tsx`**

Ligne 1, remplacer l'import par :

```tsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
```

Après la ligne 33 (`const [prefill, setPrefill] = ...`), ajouter :

```tsx
  // Suivi des conversions : un seul listener délégué couvre tous les CTA
  // (TopBar, Hero, StickyDock, Tarifs, Contact, Footer, Réservation).
  useEffect(() => {
    const track = (name: string) => (window as unknown as { plausible?: (n: string) => void }).plausible?.(name)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest('a')
      if (!a) return
      if (a.href.startsWith('tel:')) track('Appel')
      else if (a.href.includes('wa.me')) track('WhatsApp')
    }
    const onSubmit = () => track('Formulaire')
    document.addEventListener('click', onClick)
    document.addEventListener('submit', onSubmit)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('submit', onSubmit)
    }
  }, [])
```

- [ ] **Step 4: Même suivi sur les pages statiques**

Dans `scripts/build-destinations.ts`, dans `buildHtml`, juste avant `    <!-- JSON-LD entity graph -->` (ligne 304), ajouter dans le template :

```html
    <!-- Plausible + suivi des clics d'appel (identique à l'accueil) -->
    <script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>
    <script defer data-domain="taxijulien.com" src="https://plausible.io/js/script.js"></script>
    <script>document.addEventListener('click',function(e){var a=e.target&&e.target.closest('a');if(!a)return;if(a.href.indexOf('tel:')===0)plausible('Appel');else if(a.href.indexOf('wa.me')!==-1)plausible('WhatsApp')})</script>
```

- [ ] **Step 5: Corriger la note tarifaire qui cite l'ancienne URL**

`src/data/taxi.ts:1462` : remplacer `"Tarifs réglementés Marseille — affichés sur taxijulien.com/tarifs.html"` par `"Tarifs réglementés Bouches-du-Rhône — grille complète ci-dessous"`.

- [ ] **Step 6: Vérifier**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build && grep -c "plausible.io/js/script.js" dist/index.html dist/destinations/cassis/index.html
```
Attendu : `1` pour chaque fichier. Puis `npm run preview`, ouvrir `http://localhost:4173/` dans le navigateur intégré, cliquer sur le bouton d'appel de la barre du haut, lire les requêtes réseau : une requête `POST https://plausible.io/api/event` (statut 202, ou 4xx tant que le domaine n'est pas ajouté dans Plausible — l'important est l'absence d'erreur CSP dans la console).

- [ ] **Step 7: Commit**

```bash
git add index.html netlify.toml src/App.tsx scripts/build-destinations.ts src/data/taxi.ts
git commit -m "feat(mesure): Plausible + événements Appel/WhatsApp/Formulaire sur toutes les pages"
```

---

### Task 2: Prérendu de l'accueil (SSG) + hydratation

**Files:**
- Create: `src/root.tsx`
- Create: `scripts/prerender-home.tsx`
- Modify: `src/main.tsx` (tout le fichier)
- Modify: `package.json` (script `build`)

**Interfaces:**
- Produces: `Root` (composant racine partagé dev/prod) exporté depuis `src/root.tsx` ; `dist/index.html` contient le HTML de l'accueil dans `<div id="root">…</div>` après `npm run build`.

- [ ] **Step 1: Arbre racine partagé `src/root.tsx`**

```tsx
import { StrictMode } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import App from './App'

/**
 * Arbre React racine, partagé par le client (src/main.tsx) et le prérendu
 * (scripts/prerender-home.tsx) pour garantir un HTML serveur identique à
 * l'arbre hydraté.
 *
 * LazyMotion + domAnimation retire ~20 KB gzip de fonctionnalités inutilisées ;
 * les composants utilisent `m.*` (pas `motion.*`). reducedMotion="user"
 * respecte prefers-reduced-motion.
 */
export function Root() {
  return (
    <StrictMode>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  )
}
```

- [ ] **Step 2: `src/main.tsx` — hydrater en prod, rendre en dev**

Remplacer tout le fichier par :

```tsx
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { Root } from './root'

const el = document.getElementById('root')!
// En production, dist/index.html est prérendu par scripts/prerender-home.tsx :
// on hydrate. En dev (index.html source, #root vide), on rend normalement.
if (el.hasChildNodes()) hydrateRoot(el, <Root />)
else createRoot(el).render(<Root />)
```

- [ ] **Step 3: Script de prérendu `scripts/prerender-home.tsx`**

```tsx
#!/usr/bin/env tsx
/* eslint-disable no-console */
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
if (!text.includes('Questions fréquentes')) throw new Error('Prérendu sans la FAQ : une section lazy n\'a pas été résolue')
```

- [ ] **Step 4: Chaîner dans `package.json`**

Remplacer la ligne `"build"` par :

```json
    "build": "tsc -b && vite build && tsx --tsconfig tsconfig.app.json scripts/prerender-home.tsx && tsx scripts/build-destinations.ts",
```

- [ ] **Step 5: Build et lire l'auto-contrôle**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | grep -E "prérendu|Error|error" 
```
Attendu : une ligne `✓ / prérendu (N mots visibles, …)` avec N ≥ 1500 et aucune erreur. Si le build échoue avec `ReferenceError: window is not defined` (ou `document`), la pile indique le composant fautif : entourer l'accès de `typeof window !== 'undefined'` dans ce composant, relancer.

- [ ] **Step 6: Vérifier le HTML produit**

```bash
python3 -I - <<'EOF'
import re,html
s=open('/Users/fouzi/taxi-julien-marseille/dist/index.html',encoding='utf8').read()
s=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S); t=html.unescape(re.sub(r'<[^>]+>',' ',s))
print('mots:',len(t.split()), '| Mercedes:', 'Mercedes' in t, '| FAQ:', 'Questions fréquentes' in t)
EOF
```
Attendu : `mots: ≥1500 | Mercedes: True | FAQ: True`.

- [ ] **Step 7: Vérifier l'hydratation dans le navigateur intégré**

`npm run preview` puis ouvrir `http://localhost:4173/` dans le navigateur intégré. Lire la console : aucun message contenant « hydrat » ni « did not match ». Cliquer sur une carte de destination : le formulaire de réservation se préremplit (preuve que l'arbre est interactif). Si un avertissement d'hydratation cite `Blog.tsx`, remplacer `toLocaleDateString('fr-FR', …)` par un formatage déterministe : `new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(article.date))` et relancer.

- [ ] **Step 8: Commit**

```bash
git add src/root.tsx src/main.tsx scripts/prerender-home.tsx package.json
git commit -m "feat(seo): accueil prérendu avec react-dom/static et hydraté côté client"
```

---

### Task 3: Maillage interne accueil → toutes les destinations

**Files:**
- Modify: `src/data/taxi.ts` (ajout de `destinationGroups` à la fin du fichier)
- Modify: `scripts/build-destinations.ts:601-632` (supprimer `INDEX_GROUPS`, importer `destinationGroups`)
- Modify: `src/sections/Footer.tsx:63-64` (bloc de liens)
- Modify: `scripts/prerender-home.tsx` (assertion liens ≥ 43)

**Interfaces:**
- Produces: `destinationGroups: { title: string; sub: string; ids: string[] }[]` exporté depuis `src/data/taxi.ts`.

- [ ] **Step 1: Déplacer les groupes dans les données**

À la fin de `src/data/taxi.ts`, ajouter :

```ts
// Groupes de destinations — source unique pour le hub /destinations/ (builder)
// et le maillage du pied de page (accueil). Chaque id doit exister dans destContent.
export const destinationGroups: { title: string; sub: string; ids: string[] }[] = [
  {
    title: 'Aéroports, gares & port',
    sub: 'Transferts avec suivi de vol et accueil',
    ids: ['aeroport-marseille-provence', 'aeroport-nice', 'aeroport-toulon-hyeres', 'gare-saint-charles', 'gare-aix-tgv', 'gare-avignon-tgv', 'port-croisiere-marseille'],
  },
  {
    title: 'Côte & calanques — Cassis → Toulon',
    sub: 'Le littoral des Bouches-du-Rhône et du Var ouest',
    ids: ['cassis', 'la-ciotat', 'saint-cyr', 'bandol', 'sanary', 'embiez', 'six-fours', 'la-seyne', 'toulon', 'hyeres'],
  },
  {
    title: 'Côte des Maures — Hyères → Saint-Tropez',
    sub: 'La presqu’île et le golfe de Saint-Tropez',
    ids: ['la-londe', 'bormes-les-mimosas', 'le-lavandou', 'rayol-canadel', 'cavalaire', 'la-croix-valmer', 'cogolin', 'gassin', 'ramatuelle', 'saint-tropez'],
  },
  {
    title: 'Côte d’Azur — Sainte-Maxime → Nice',
    sub: 'Longue distance vers les Alpes-Maritimes',
    ids: ['sainte-maxime', 'frejus', 'saint-raphael', 'mandelieu', 'cannes', 'antibes', 'cagnes-sur-mer', 'nice-ville'],
  },
  {
    title: 'Provence intérieure',
    sub: 'Aix, Avignon, Arles et alentours',
    ids: ['aix-en-provence', 'avignon', 'arles', 'aubagne'],
  },
  {
    title: 'Stations de ski — Hautes-Alpes',
    sub: 'Longue distance hivernale, équipement neige inclus',
    ids: ['ski-pra-loup', 'ski-vars', 'ski-risoul', 'ski-orres'],
  },
]
```

- [ ] **Step 2: Le builder consomme les données**

Dans `scripts/build-destinations.ts` : supprimer les lignes 601-632 (`const INDEX_GROUPS = [...]`), ajouter `destinationGroups` à l'import des lignes 29-38, et remplacer chaque occurrence de `INDEX_GROUPS` par `destinationGroups` (`grep -n INDEX_GROUPS scripts/build-destinations.ts` pour les localiser).

- [ ] **Step 3: Bloc de liens dans le pied de page**

Dans `src/sections/Footer.tsx`, ligne 1, remplacer l'import par :

```tsx
import { contact, business, destinationGroups, destinations, destContent } from '../data/taxi'

// Libellé court d'une page destination : nom court de destinations[], sinon
// le nom de la page seule (page-only), sinon l'id.
function pageLabel(id: string): string {
  const d = destinations.find(x => x.id === id)
  if (d) return d.shortName ?? d.name
  return destContent.find(c => c.id === id)?.destName ?? id
}
```

Entre la ligne 63 (`</div>` fermant la grille) et la ligne 65 (`<div className="mt-12 pt-6 …">`), insérer :

```tsx
        {/* Maillage interne : lien statique vers chaque page destination.
            Rendu dans le HTML prérendu de l'accueil → découverte au premier crawl. */}
        <nav aria-label="Toutes nos destinations" className="mt-12 pt-8 border-t border-white/[0.05]">
          <h3 className="font-display font-semibold text-[var(--color-cream)] mb-4 text-[13px] uppercase tracking-[0.18em]">Nos destinations depuis Marseille</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[13px]">
            {destinationGroups.map(g => (
              <div key={g.title}>
                <div className="text-[var(--color-silver-deep)] font-semibold mb-2">{g.title}</div>
                <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[var(--color-silver-2)]">
                  {g.ids.map(id => (
                    <li key={id}>
                      <a className="hover:text-[var(--color-cream)] transition" href={`/destinations/${id}/`}>{pageLabel(id)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
```

- [ ] **Step 4: Renforcer l'auto-contrôle du prérendu**

Dans `scripts/prerender-home.tsx`, après la ligne `if (!text.includes('Questions fréquentes')) …`, ajouter :

```ts
if (links < 43) throw new Error(`Accueil : ${links} liens destinations (< 43) — le pied de page ne liste pas tout`)
```

- [ ] **Step 5: Build et vérifier**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | grep -E "prérendu|Error" && grep -o 'href="/destinations/[a-z0-9-]*/"' dist/index.html | sort -u | wc -l
```
Attendu : la ligne `✓ / prérendu (… , 43 liens …)` et `43` (ou plus).

- [ ] **Step 6: Commit**

```bash
git add src/data/taxi.ts scripts/build-destinations.ts src/sections/Footer.tsx scripts/prerender-home.tsx
git commit -m "feat(seo): maillage accueil vers les 43 destinations, groupes déplacés en données"
```

---

### Task 4: Générateur de pages générique (chemin, langue, type) + sitemap généré

**Files:**
- Modify: `src/data/taxi.ts:64-114` (types `DestSpot`, `DestContent`)
- Modify: `scripts/build-destinations.ts` (fonctions `buildJsonLd`, `buildHtml`, `buildMarkdown`, `indexCard`, `main`)
- Delete: `public/sitemap.xml`

**Interfaces:**
- Produces: champs optionnels de `DestContent` : `kind`, `path`, `lang`, `kicker`, `fareLabel`, `fareNote`, `spotsTitle`, `spotsSub`, `ctaTitle`, `whatsappText`, `parent` ; types de spot `hospital` et `hotel` ; fonction `pagePath(c: DestContent): string` dans le builder ; `dist/sitemap.xml` généré.
- Consumes: `destinationGroups` (tâche 3).

- [ ] **Step 1: Types dans `src/data/taxi.ts`**

Ligne 70, remplacer l'union de `DestSpot.type` par :

```ts
  type: 'beach' | 'monument' | 'museum' | 'viewpoint' | 'restaurant' | 'wine' | 'market' | 'sport' | 'hike' | 'shopping' | 'church' | 'hospital' | 'hotel' | 'other'
```

Dans `DestContent` (ligne 75), après le champ `related: string[]` (ligne 113), ajouter :

```ts
  /** 'service' = page thématique (médical, hôtels, van, anglais, événements…) :
   *  pas de bloc TouristDestination, pas de bloc distance/durée, libellés dédiés.
   *  Défaut 'destination'. */
  kind?: 'destination' | 'service'
  /** Chemin servi, avec slash final (ex. '/hotels/'). Obligatoire si kind = 'service'.
   *  Défaut `/destinations/<id>/`. */
  path?: string
  /** Langue de la page. Défaut 'fr'. */
  lang?: 'fr' | 'en'
  /** Surtitre du hero. Défaut « — Destination · <département> ». */
  kicker?: string
  /** Tarif affiché tel quel dans la carte (ex. '70 – 110 €'). Sans lui, le
   *  builder cherche un forfait dans fareTables, sinon « Forfait sur devis ». */
  fareLabel?: string
  fareNote?: string
  /** Titre et sous-titre de la section des spots. Défaut « Que faire à <nom> ». */
  spotsTitle?: string
  spotsSub?: string
  /** Titre du bloc final. Défaut « Prêt à partir vers <nom> ? ». */
  ctaTitle?: string
  /** Texte prérempli WhatsApp. Défaut « … Je voudrais aller à <nom>. ». */
  whatsappText?: string
  /** Parent du fil d'Ariane. Défaut Destinations → /destinations/. */
  parent?: { label: string; path: string }
```

- [ ] **Step 2: Helpers dans le builder**

Dans `scripts/build-destinations.ts`, après la ligne 46 (`const SITE_URL = …`), ajouter :

```ts
// Chemin servi d'une page (slash final = convention du sitemap/canonical).
function pagePath(c: DestContent): string {
  return c.path ?? `/destinations/${c.id}/`
}

// Libellés fixes du template, par langue.
const LABELS = {
  fr: {
    htmlLang: 'fr', ogLocale: 'fr_FR', inLanguage: 'fr-FR',
    skip: 'Aller au contenu', available: 'Disponible · Marseille', home: 'Accueil', destinations: 'Destinations',
    distance: 'Distance', duration: 'Durée', capacity: 'Capacité', fares: 'Forfaits taxi', fare: 'Tarif',
    fromStation: 'Depuis la gare Saint-Charles', fromAirport: 'Depuis l\'aéroport Marseille&nbsp;Provence', fromMarseille: 'Depuis Marseille',
    day: 'jour', night: 'nuit', fromPrice: 'À partir de', quote: 'Forfait sur devis', book: 'Réserver ce trajet →', askQuote: 'Demander un devis →',
    call: 'Appeler', whatsapp: 'WhatsApp', trip: 'Le trajet', whatToDo: 'Que faire à', spotsSub: 'spots vérifiés. Nous vous déposons et vous récupérons à l\'heure de votre choix.',
    useCases: 'Pour qui · Pour quoi', faq: 'Questions fréquentes', related: 'Destinations proches', seeFare: 'Voir le forfait',
    ctaKicker: '— Réservation immédiate', readyFor: 'Prêt à partir vers', ctaSub: 'Tarif annoncé fermement à la réservation. Mercedes Classe V jusqu\'à 7 passagers. 24h/24, 7j/7.',
    form: 'Formulaire en ligne', back: '← Retour à l\'accueil Taxi Julien', legal: 'Conventionné CPAM · 24h/24, 7j/7', wantTo: 'Je voudrais aller à',
  },
  en: {
    htmlLang: 'en', ogLocale: 'en_US', inLanguage: 'en-US',
    skip: 'Skip to content', available: 'Available · Marseille', home: 'Home', destinations: 'Destinations',
    distance: 'Distance', duration: 'Duration', capacity: 'Capacity', fares: 'Taxi fares', fare: 'Fare',
    fromStation: 'From Saint-Charles station', fromAirport: 'From Marseille&nbsp;Provence airport', fromMarseille: 'From Marseille',
    day: 'day', night: 'night', fromPrice: 'From', quote: 'Fixed quote on request', book: 'Book this ride →', askQuote: 'Get a quote →',
    call: 'Call', whatsapp: 'WhatsApp', trip: 'The ride', whatToDo: 'What to do in', spotsSub: 'verified spots. We drop you off and pick you up at the time you choose.',
    useCases: 'Who · What for', faq: 'Frequently asked questions', related: 'Nearby destinations', seeFare: 'See the fare',
    ctaKicker: '— Instant booking', readyFor: 'Ready to go to', ctaSub: 'Fixed price confirmed at booking. Mercedes V-Class, up to 7 passengers. 24/7.',
    form: 'Online form', back: '← Back to Taxi Julien home', legal: 'CPAM-approved · 24/7', wantTo: 'I would like to go to',
  },
} as const
type Labels = (typeof LABELS)['fr']
function labelsFor(c: DestContent): Labels {
  return LABELS[c.lang ?? 'fr'] as Labels
}
```

Dans `SPOT_ICON` (ligne 112), ajouter deux entrées avant `other` :

```ts
  hospital: '🏥',
  hotel: '🏨',
```

- [ ] **Step 3: `main()` — chemin de sortie, garde-fou, sitemap**

Dans `main()` (ligne 986) : remplacer la ligne 1016 `const outDir = path.join(DIST, 'destinations', content.id)` par :

```ts
    if (content.kind === 'service' && !content.path) {
      throw new Error(`destContent "${content.id}" : kind 'service' exige un champ path`)
    }
    const outDir = path.join(DIST, pagePath(content))
```

Remplacer la ligne 1022 (log) par :

```ts
    console.log(`  ✓ ${pagePath(content)} (HTML ${(html.length / 1024).toFixed(1)} KB · MD ${(md.length / 1024).toFixed(1)} KB)`)
```

Avant le `console.log(\`\n✅ Generated …\`)` final, ajouter :

```ts
  // Sitemap généré depuis la même source que les pages : impossible d'oublier
  // une page ou d'en lister une qui n'existe pas. Pas de lastmod : une date
  // de build identique partout serait un signal faux pour Google.
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/destinations/`,
    ...destContent.map(c => SITE_URL + pagePath(c)),
    `${SITE_URL}/mentions-legales/`,
  ]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8')
  console.log(`  ✓ /sitemap.xml (${urls.length} URLs)`)
```

Puis supprimer le fichier statique : `git rm public/sitemap.xml`.

- [ ] **Step 4: `buildJsonLd` — pages service et langue**

Remplacer la signature et le corps aux points suivants (lignes 136-230) :

```ts
function buildJsonLd(content: DestContent, dest: Destination, pageUrl: string): string {
  const L = labelsFor(content)
  const isService = content.kind === 'service'
  const parent = content.parent ?? { label: L.destinations, path: '/destinations/' }
```

Dans `taxiService` : `name: isService ? content.h1 : \`Taxi Julien — Marseille → ${dest.name}\`,` et `areaServed.name` / `addressLocality` : `isService ? 'Marseille' : dest.name`.

Dans `breadcrumb.itemListElement` : `name: L.home` pour la position 1 ; position 2 : `{ '@type': 'ListItem', position: 2, name: parent.label, item: SITE_URL + parent.path }`.

Dans `webPage` : `inLanguage: L.inLanguage,` et `about: isService ? undefined : { '@id': \`${pageUrl}#place\` },`.

Dans `graph` : `'@graph': isService ? [taxiService, faqPage, breadcrumb, webPage] : [taxiService, place, faqPage, breadcrumb, webPage],`.

- [ ] **Step 5: `buildHtml` — chemin, libellés, blocs conditionnels**

Appliquer ces remplacements exacts dans `buildHtml` (lignes 237-534) :

| Ligne | Ancien | Nouveau |
|---|---|---|
| 238 | `` const pageUrl = `${SITE_URL}/destinations/${content.id}/` `` | `` const pageUrl = SITE_URL + pagePath(content); const L = labelsFor(content); const isService = content.kind === 'service'; const parent = content.parent ?? { label: L.destinations, path: '/destinations/' } `` |
| 248-250 | `content.related.map(id => destinations.find(d => d.id === id)).filter(…)` | `content.related.map(id => destContent.find(c => c.id === id)).filter((c): c is DestContent => Boolean(c)).map(c => ({ c, d: resolveDest(c) }))` |
| 257 | `<html lang="fr" dir="ltr">` | `<html lang="${L.htmlLang}" dir="ltr">` |
| 273 | `content="fr_FR"` | `content="${L.ogLocale}"` |
| 296 | `href="/destinations/${content.id}/index.md"` | `href="${pagePath(content)}index.md"` |
| 308 | `Aller au contenu` | `${L.skip}` |
| 319 | `Disponible · Marseille` | `${L.available}` |
| 332-334 | `>Accueil</a>` … `href="/destinations/" …>Destinations</a>` | `>${L.home}</a>` … `href="${parent.path}" …>${esc(parent.label)}</a>` |
| 343 | `— Destination · ${esc(content.deptName)}` | `${esc(content.kicker ?? `— Destination · ${content.deptName}`)}` |
| 351-365 | tout le bloc `<!-- Quick facts --> … </div>` | `${isService ? '' : `<div class="mt-6 grid grid-cols-3 gap-2 max-w-md"> … (bloc inchangé, libellés ${L.distance}/${L.duration}/${L.capacity}) … </div>`}` |
| 367 | `${gareFare \|\| airportFare \|\| skiFare ? \`` | `${content.fareLabel ? `<div class="mt-5 rounded-2xl bg-white text-[var(--color-ink)] p-4 sm:p-5 max-w-md"><div class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">${L.fare}</div><div class="font-display font-semibold text-lg mt-0.5">${esc(content.fareLabel)}</div>${content.fareNote ? `<p class="mt-1 text-[12.5px] text-gray-600">${esc(content.fareNote)}</p>` : ''}<a href="/#reservation" class="inline-flex items-center justify-center h-11 px-5 mt-3 rounded-xl bg-[var(--color-ink)] text-white font-semibold text-[13.5px]">${L.book}</a></div>` : gareFare \|\| airportFare \|\| skiFare ? \`` |
| 370, 374, 379, 384, 388, 392-394 | libellés `Forfaits taxi`, `Depuis la gare Saint-Charles`, `Depuis l'aéroport …`, `Depuis Marseille`, `Réserver ce trajet →`, `Tarif`, `Forfait sur devis`, `Demander un devis →`, `jour`, `nuit`, `À partir de` | `${L.fares}`, `${L.fromStation}`, `${L.fromAirport}`, `${L.fromMarseille}`, `${L.book}`, `${L.fare}`, `${L.quote}`, `${L.askQuote}`, `${L.day}`, `${L.night}`, `${L.fromPrice}` |
| 401, 403-404 | `Appeler`, `encodeURIComponent(contact.whatsappBaseText + ' Je voudrais aller à ' + dest.name + '.')`, `WhatsApp` | `${L.call}`, `encodeURIComponent(content.whatsappText ?? (contact.whatsappBaseText + ' ' + L.wantTo + ' ' + dest.name + '.'))`, `${L.whatsapp}` |
| 442 | `Le trajet` | `${L.trip}` |
| 451-452 | `Que faire à ${esc(dest.name)}` et `${content.spots.length} spots vérifiés. …` | `${esc(content.spotsTitle ?? `${L.whatToDo} ${dest.name}`)}` et `${esc(content.spotsSub ?? `${content.spots.length} ${L.spotsSub}`)}` |
| 468 | `Pour qui · Pour quoi` | `${L.useCases}` |
| 482 | `Questions fréquentes` | `${L.faq}` |
| 496-503 | `Destinations proches`, `href="/destinations/${r.id}/"`, `${esc(r.category)}`, `Marseille → ${esc(r.shortName \|\| r.name)}`, `Voir le forfait` | `${L.related}`, `href="${pagePath(r.c)}"`, `${esc(r.d.category)}`, `${r.c.kind === 'service' ? esc(r.d.name) : `Marseille → ${esc(r.d.shortName \|\| r.d.name)}`}`, `${L.seeFare}` |
| 514-516 | `— Réservation immédiate`, `Prêt à partir vers ${esc(dest.name)} ?`, phrase `Tarif annoncé …` | `${L.ctaKicker}`, `${esc(content.ctaTitle ?? `${L.readyFor} ${dest.name} ?`)}`, `${L.ctaSub}` |
| 518-520 | `Appeler`, WhatsApp text, `Formulaire en ligne` | `${L.call}`, même expression que ligne 403, `${L.form}` |
| 528-529 | `← Retour à l'accueil Taxi Julien`, `Conventionné CPAM · 24h/24, 7j/7` | `${L.back}`, `${L.legal}` |

Le bloc des `related` itère désormais sur `{ c, d }` : renommer la variable de boucle `r` en conséquence (`related.map(r => …)` reste, avec `r.c` / `r.d`).

- [ ] **Step 6: `buildMarkdown` — mêmes substitutions**

Dans `buildMarkdown` (ligne 539) : ligne 540 `` const pageUrl = `${SITE_URL}/destinations/${content.id}/` `` → `const pageUrl = SITE_URL + pagePath(content); const L = labelsFor(content)` ; ligne 557 `## Trajet` → n'émettre ce bloc que si `content.kind !== 'service'` ; ligne 568 `## Que faire à ${dest.name}` → `## ${content.spotsTitle ?? `${L.whatToDo} ${dest.name}`}` ; ligne 574 `## FAQ` inchangé ; ligne 578 `## Réservation` → `## ${L.ctaKicker.replace('— ', '')}` ; ligne 582 `[Formulaire en ligne](…)` → `[${L.form}](${SITE_URL}/#reservation)`.

- [ ] **Step 7: `indexCard` — chemin**

Ligne 656 : `href="/destinations/${esc(content.id)}/"` → `href="${pagePath(content)}"`.

- [ ] **Step 8: Vérifier que rien n'a changé pour les 43 pages existantes**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | tail -4 && grep -c "<loc>" dist/sitemap.xml && diff <(python3 -I -c "import re;print(len(re.findall(r'<h2',open('dist/destinations/cassis/index.html').read())))") <(echo 6) && echo "cassis: 6 h2 OK"
```
Attendu : `✅ Generated 43 destination pages…`, `46` URLs dans le sitemap, `cassis: 6 h2 OK` (trajet, spots, usages, FAQ, proches, appel final — même structure qu'avant). Ouvrir `dist/destinations/cassis/index.html` dans le navigateur intégré via `npm run preview` et comparer visuellement avec la production : identique.

- [ ] **Step 9: Commit**

```bash
git add src/data/taxi.ts scripts/build-destinations.ts && git rm -q public/sitemap.xml
git commit -m "refactor(build): générateur de pages générique (chemin, langue, type) et sitemap généré"
```

---

### Task 5: Cluster médical — `/transport-medical-conventionne/`

**Files:**
- Modify: `src/data/taxi.ts` (nouvelle entrée dans `destContent`, à insérer avant la ligne `]` qui ferme le tableau — `awk 'NR>116 && /^\]/{print NR; exit}' src/data/taxi.ts` donne la ligne)

**Interfaces:**
- Consumes: champs de la tâche 4.
- Produces: page `/transport-medical-conventionne/`, id `transport-medical-conventionne` (cible de l'edge function, tâche 10).

- [ ] **Step 1: Écrire l'entrée**

```ts
  {
    id: 'transport-medical-conventionne',
    kind: 'service',
    path: '/transport-medical-conventionne/',
    destName: 'Transport médical conventionné',
    destCategory: 'Hôpital',
    destPhoto: '/photos/v10.jpg',
    destPhotoSm: '/photos/v10-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: 'Taxi conventionné CPAM Marseille — transport médical | Taxi Julien',
    seoDescription: 'Taxi conventionné CPAM à Marseille : transport assis sur prescription médicale vers Timone, Conception, Nord, Paoli-Calmettes, cliniques. Sans avance de frais. 24h/24.',
    h1: 'Taxi conventionné CPAM à Marseille',
    kicker: '— Transport médical · Bouches-du-Rhône',
    heroSubtitle: 'Transport assis sur prescription · Hôpitaux et cliniques de Marseille · 24h/24',
    lead: 'Taxi Julien est conventionné par l\'Assurance Maladie : sur prescription médicale de transport, vos trajets vers l\'hôpital, la clinique ou le centre de soins sont pris en charge selon vos droits, sans avance de frais. Consultations, hospitalisations, séances répétées (dialyse, chimiothérapie, rééducation) : un chauffeur ponctuel, un véhicule spacieux et une facturation directe à la caisse.',
    fareLabel: 'Pris en charge CPAM',
    fareNote: 'Sur prescription médicale de transport. Hors prescription : tarif réglementé au compteur.',
    spotsTitle: 'Hôpitaux et cliniques desservis',
    spotsSub: 'Les établissements de Marseille et de la métropole où nous déposons et récupérons nos patients.',
    spots: [
      { name: 'Hôpital de la Timone (AP-HM)', blurb: 'Marseille 5e. Adultes et enfants, urgences, consultations spécialisées. Dépose devant l\'entrée demandée.', type: 'hospital' },
      { name: 'Hôpital de la Conception (AP-HM)', blurb: 'Marseille 5e. Consultations, hospitalisations de jour.', type: 'hospital' },
      { name: 'Hôpital Nord (AP-HM)', blurb: 'Marseille 15e. Accessible depuis tous les arrondissements et la métropole nord.', type: 'hospital' },
      { name: 'Hôpital Sainte-Marguerite (AP-HM)', blurb: 'Marseille 9e. Rééducation, gériatrie, consultations.', type: 'hospital' },
      { name: 'Institut Paoli-Calmettes (IPC)', blurb: 'Marseille 9e. Centre de lutte contre le cancer : séances répétées planifiées à l\'avance.', type: 'hospital' },
      { name: 'Hôpital Européen', blurb: 'Marseille 3e. Consultations et hospitalisations.', type: 'hospital' },
      { name: 'Hôpital Saint-Joseph', blurb: 'Marseille 8e. Établissement privé à but non lucratif, toutes spécialités.', type: 'hospital' },
      { name: 'Cliniques Clairval, Bouchard, Beauregard', blurb: 'Marseille 9e, 6e et 12e. Transferts vers les cliniques privées de la ville.', type: 'hospital' },
    ],
    useCases: [
      'Consultation ou examen sur prescription médicale de transport',
      'Séances répétées : dialyse, chimiothérapie, radiothérapie, rééducation — trajets réguliers planifiés',
      'Entrée ou sortie d\'hospitalisation, avec bagages',
      'Transfert depuis le Var ou les Alpes-Maritimes vers un hôpital marseillais (longue distance conventionnée)',
    ],
    faq: [
      {
        q: 'Qu\'est-ce qu\'un taxi conventionné ?',
        a: 'Un taxi ayant signé une convention avec l\'Assurance Maladie. Sur prescription médicale de transport établie par votre médecin, le trajet est pris en charge selon vos droits et nous facturons directement la caisse : vous n\'avancez pas les frais.',
      },
      {
        q: 'Que dois-je présenter au chauffeur ?',
        a: 'La prescription médicale de transport remplie par votre médecin, votre carte Vitale et, le cas échéant, votre attestation de mutuelle. Sans prescription, la course est facturée au tarif réglementé.',
      },
      {
        q: 'Pouvez-vous assurer des trajets réguliers (dialyse, chimiothérapie) ?',
        a: 'Oui. Nous planifions les séances à l\'avance avec des horaires fixes et le même chauffeur autant que possible. Appelez-nous pour mettre en place le planning.',
      },
      {
        q: 'Intervenez-vous en dehors de Marseille ?',
        a: 'Oui : toute la métropole, le Var et les Alpes-Maritimes vers les hôpitaux de Marseille, et inversement. Les longues distances conventionnées se préparent par téléphone.',
      },
      {
        q: 'Le véhicule est-il adapté ?',
        a: 'Mercedes Classe V : accès facile, espace pour un accompagnant et les bagages, climatisation. Transport assis uniquement (pas de fauteuil roulant non pliable).',
      },
    ],
    related: ['aeroport-marseille-provence', 'gare-saint-charles', 'toulon', 'aix-en-provence'],
  },
```

- [ ] **Step 2: Build et vérifier**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | grep -E "transport-medical|Error" && grep -c "conventionné" dist/transport-medical-conventionne/index.html
```
Attendu : `✓ /transport-medical-conventionne/ …` et un compte ≥ 5. Ouvrir la page via `npm run preview` : h1, carte « Pris en charge CPAM », 8 établissements, 5 questions, 4 destinations proches, aucun bloc « Distance 0 km ».

- [ ] **Step 3: Commit**

```bash
git add src/data/taxi.ts
git commit -m "content(seo): page transport médical conventionné CPAM"
```

---

### Task 6: Cluster arrondissements — 16 pages `/aeroport/13001/` … `/aeroport/13016/`

**Files:**
- Modify: `src/data/taxi.ts` (table `ARRONDISSEMENTS` + générateur `arrondissementPages`, puis `...arrondissementPages` dans `destContent`)

**Interfaces:**
- Produces: pages `/aeroport/130XX/`, ids `aeroport-130XX` (cibles de la tâche 10).

- [ ] **Step 1: Table et générateur**

Juste avant `export const destContent: DestContent[] = [` (ligne 116), ajouter :

```ts
// Aéroport Marseille Provence depuis chaque arrondissement — reconstruit le
// cluster « taxi 13008 aéroport » de l'ancien site, avec le forfait réel de la
// grille (70 – 110 € selon véhicule et passagers) et des repères réels par
// arrondissement. Aucune distance chiffrée : elle varie selon l'adresse.
type Arrondissement = { n: number; cp: string; quartiers: string[]; spots: DestSpot[] }

const ordinal = (n: number) => (n === 1 ? '1er' : `${n}e`)

const ARRONDISSEMENTS: Arrondissement[] = [
  { n: 1, cp: '13001', quartiers: ['Vieux-Port', 'Noailles', 'Belsunce', 'Opéra', 'Canebière', 'Thiers'], spots: [
    { name: 'Vieux-Port', blurb: 'Dépose quai des Belges ou quai du Port, devant votre hôtel.', type: 'monument' },
    { name: 'Gare Saint-Charles', blurb: 'Correspondance train ↔ avion : prise en charge au pied de l\'escalier monumental.', type: 'other' },
    { name: 'La Canebière', blurb: 'Hôtels et résidences du centre, de la Bourse aux Réformés.', type: 'shopping' } ] },
  { n: 2, cp: '13002', quartiers: ['La Joliette', 'Le Panier', 'Arenc', 'Grands-Carmes', 'Hôtel-de-Ville'], spots: [
    { name: 'MuCEM et cathédrale de la Major', blurb: 'Esplanade du J4, Fort Saint-Jean.', type: 'museum' },
    { name: 'Les Terrasses du Port et les Docks', blurb: 'Bureaux, hôtels et commerces d\'Euroméditerranée.', type: 'shopping' },
    { name: 'InterContinental Hôtel-Dieu', blurb: 'Dépose devant l\'hôtel, bagages pris en charge.', type: 'hotel' } ] },
  { n: 3, cp: '13003', quartiers: ['Belle-de-Mai', 'Saint-Mauront', 'Saint-Lazare', 'La Villette'], spots: [
    { name: 'Friche la Belle de Mai', blurb: 'Lieu culturel : concerts, expositions, bureaux.', type: 'museum' },
    { name: 'Hôpital Européen', blurb: 'Transferts patients et visiteurs (taxi conventionné).', type: 'hospital' },
    { name: 'Gare Saint-Charles (côté Saint-Lazare)', blurb: 'Accès par le boulevard Voltaire.', type: 'other' } ] },
  { n: 4, cp: '13004', quartiers: ['Les Chartreux', 'Cinq-Avenues', 'La Blancarde', 'Chutes-Lavie'], spots: [
    { name: 'Palais Longchamp', blurb: 'Muséum et musée des Beaux-Arts, parc.', type: 'monument' },
    { name: 'Gare de la Blancarde', blurb: 'Métro et tramway, TER.', type: 'other' },
    { name: 'Le Dôme', blurb: 'Salle de concerts et spectacles.', type: 'other' } ] },
  { n: 5, cp: '13005', quartiers: ['La Timone', 'Baille', 'Saint-Pierre', 'Le Camas'], spots: [
    { name: 'Hôpital de la Timone', blurb: 'Dépose devant l\'entrée demandée (adultes, enfants).', type: 'hospital' },
    { name: 'Hôpital de la Conception', blurb: 'Consultations et hospitalisations.', type: 'hospital' },
    { name: 'Faculté de médecine', blurb: 'Campus Timone.', type: 'other' } ] },
  { n: 6, cp: '13006', quartiers: ['Castellane', 'Vauban', 'Notre-Dame-du-Mont', 'Lodi', 'Préfecture', 'Cours Julien'], spots: [
    { name: 'Notre-Dame de la Garde', blurb: 'Basilique : dépose en haut, parking impossible.', type: 'church' },
    { name: 'Place Castellane', blurb: 'Hôtels, résidences Citadines et Ibis Styles, métro.', type: 'hotel' },
    { name: 'Clinique Bouchard', blurb: 'Transferts patients (taxi conventionné).', type: 'hospital' } ] },
  { n: 7, cp: '13007', quartiers: ['Le Pharo', 'Saint-Victor', 'Endoume', 'Roucas-Blanc', 'Bompard', 'Les Catalans'], spots: [
    { name: 'Palais du Pharo', blurb: 'Congrès et réceptions.', type: 'monument' },
    { name: 'Corniche Kennedy et vallon des Auffes', blurb: 'Hôtels nhow, Sofitel, Radisson Blu, Le Petit Nice.', type: 'hotel' },
    { name: 'Abbaye Saint-Victor', blurb: 'Quartier résidentiel au-dessus du Vieux-Port.', type: 'church' } ] },
  { n: 8, cp: '13008', quartiers: ['Le Prado', 'Périer', 'Bonneveine', 'La Pointe-Rouge', 'Montredon', 'Les Goudes', 'Sainte-Anne'], spots: [
    { name: 'Orange Vélodrome', blurb: 'Matchs et concerts : dépose aux abords, retour planifié.', type: 'sport' },
    { name: 'Parc Chanot — Palais des Congrès', blurb: 'Salons, congrès, hôtels Novotel et Golden Tulip voisins.', type: 'other' },
    { name: 'Plages du Prado et parc Borély', blurb: 'Du Rond-Point du Prado à la Pointe-Rouge.', type: 'beach' },
    { name: 'Hôpital Saint-Joseph', blurb: 'Transferts patients (taxi conventionné).', type: 'hospital' } ] },
  { n: 9, cp: '13009', quartiers: ['Mazargues', 'Sainte-Marguerite', 'Le Cabot', 'La Panouse', 'Luminy', 'Vaufrèges'], spots: [
    { name: 'Institut Paoli-Calmettes', blurb: 'Séances répétées planifiées (taxi conventionné).', type: 'hospital' },
    { name: 'Hôpital Sainte-Marguerite et clinique Clairval', blurb: 'Transferts patients et visiteurs.', type: 'hospital' },
    { name: 'Campus de Luminy et calanques', blurb: 'Sormiou, Morgiou : dépose au départ des sentiers.', type: 'hike' } ] },
  { n: 10, cp: '13010', quartiers: ['Saint-Tronc', 'Pont-de-Vivaux', 'La Capelette', 'Menpenti', 'Saint-Loup'], spots: [
    { name: 'Palais omnisports Marseille Grand-Est', blurb: 'Patinoire et événements.', type: 'sport' },
    { name: 'Kyriad Palais des Congrès', blurb: 'Hôtel desservi, dépose devant l\'entrée.', type: 'hotel' },
    { name: 'La Capelette', blurb: 'Résidences et entreprises du secteur.', type: 'other' } ] },
  { n: 11, cp: '13011', quartiers: ['La Valentine', 'Les Caillols', 'Saint-Marcel', 'La Pomme', 'Les Camoins', 'La Treille'], spots: [
    { name: 'Centre commercial La Valentine', blurb: 'Zone commerciale et hôtels de la Valentine.', type: 'shopping' },
    { name: 'Château de la Buzine', blurb: 'La « maison de ma mère » de Pagnol.', type: 'monument' },
    { name: 'Saint-Marcel et la vallée de l\'Huveaune', blurb: 'Accès rapide à l\'A50.', type: 'other' } ] },
  { n: 12, cp: '13012', quartiers: ['Saint-Barnabé', 'Les Trois-Lucs', 'Montolivet', 'Saint-Julien', 'La Fourragère', 'Bois-Luzy'], spots: [
    { name: 'Clinique Beauregard', blurb: 'Transferts patients (taxi conventionné).', type: 'hospital' },
    { name: 'Saint-Barnabé', blurb: 'Village et résidences, métro La Fourragère.', type: 'other' },
    { name: 'Parc de la Moline', blurb: 'Quartiers résidentiels de l\'est marseillais.', type: 'other' } ] },
  { n: 13, cp: '13013', quartiers: ['Château-Gombert', 'Saint-Jérôme', 'Malpassé', 'Les Olives', 'La Rose', 'Saint-Mitre'], spots: [
    { name: 'Technopôle de Château-Gombert', blurb: 'Entreprises et écoles d\'ingénieurs : déplacements professionnels.', type: 'other' },
    { name: 'Campus Saint-Jérôme', blurb: 'Université, résidences étudiantes.', type: 'other' },
    { name: 'Métro La Rose', blurb: 'Terminus nord de la ligne 1.', type: 'other' } ] },
  { n: 14, cp: '13014', quartiers: ['Sainte-Marthe', 'Le Merlan', 'Saint-Barthélemy', 'Bon-Secours', 'Le Canet', 'Les Arnavaux'], spots: [
    { name: 'Centre commercial Le Merlan', blurb: 'Zone commerciale et résidences.', type: 'shopping' },
    { name: 'Sainte-Marthe', blurb: 'Accès direct à l\'A7 vers l\'aéroport.', type: 'other' },
    { name: 'Saint-Barthélemy', blurb: 'Quartiers nord, desserte 24h/24.', type: 'other' } ] },
  { n: 15, cp: '13015', quartiers: ['Saint-Louis', 'Saint-Antoine', 'La Viste', 'La Cabucelle', 'Les Aygalades', 'La Delorme'], spots: [
    { name: 'Hôpital Nord', blurb: 'Transferts patients et visiteurs (taxi conventionné).', type: 'hospital' },
    { name: 'Terminal croisières (Môle Léon Gourret)', blurb: 'Embarquements MSC et Costa.', type: 'other' },
    { name: 'Marché aux puces', blurb: 'Les Crottes, accès A55.', type: 'market' } ] },
  { n: 16, cp: '13016', quartiers: ['L\'Estaque', 'Saint-Henri', 'Saint-André', 'Les Riaux'], spots: [
    { name: 'Port de l\'Estaque', blurb: 'Le village des peintres, les plages de Corbière.', type: 'beach' },
    { name: 'Saint-Henri et Saint-André', blurb: 'L\'arrondissement le plus proche de l\'aéroport par l\'A55.', type: 'other' },
    { name: 'Gare de l\'Estaque', blurb: 'TER vers Miramas et Marseille.', type: 'other' } ] },
]

export const arrondissementPages: DestContent[] = ARRONDISSEMENTS.map(a => {
  const name = `Marseille ${ordinal(a.n)} (${a.cp})`
  return {
    id: `aeroport-${a.cp}`,
    kind: 'service',
    path: `/aeroport/${a.cp}/`,
    destName: name,
    destCategory: 'Aéroport',
    destPhoto: '/photos/hero.jpg',
    destPhotoSm: '/photos/hero-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: `Taxi Marseille ${ordinal(a.n)} → Aéroport : forfait fixe | Taxi Julien`,
    seoDescription: `Taxi du ${ordinal(a.n)} arrondissement de Marseille (${a.cp}) vers l'aéroport Marseille Provence : forfait fixe 70 – 110 €, suivi du vol, Mercedes Classe V 7 places. 24h/24.`,
    h1: `Taxi Marseille ${ordinal(a.n)} → Aéroport Marseille Provence`,
    kicker: `— Aéroport · ${a.cp}`,
    heroSubtitle: `${a.quartiers.slice(0, 3).join(' · ')} · Forfait fixe · Suivi du vol`,
    lead: `Depuis ${a.quartiers.join(', ')} : nous venons vous chercher à votre adresse dans le ${ordinal(a.n)} arrondissement et vous déposons au terminal 1 ou 2 de l'aéroport Marseille Provence. Forfait fixe de 70 à 110 € selon le véhicule et le nombre de passagers, annoncé à la réservation. Au retour, nous suivons votre vol et vous attendons dans le hall avec une pancarte.`,
    fareLabel: '70 – 110 €',
    fareNote: 'Forfait fixe aller simple selon véhicule et nombre de passagers, péages inclus. Même tarif de l\'aéroport vers votre adresse.',
    spotsTitle: `Nos points de prise en charge dans le ${ordinal(a.n)}`,
    spotsSub: 'Repères du quartier où nous déposons et récupérons le plus souvent.',
    spots: a.spots,
    useCases: [
      'Départ tôt le matin ou retour tard le soir : réservation la veille, chauffeur à l\'heure',
      'Famille jusqu\'à 7 passagers avec valises, poussette ou siège bébé sur demande',
      'Déplacement professionnel avec facture',
      'Retour de vol avec suivi en temps réel et attente incluse en cas de retard',
    ],
    faq: [
      { q: `Combien coûte un taxi du ${ordinal(a.n)} arrondissement à l'aéroport ?`, a: 'Forfait fixe entre 70 et 110 € selon le véhicule et le nombre de passagers, péages compris. Le montant exact vous est annoncé à la réservation et ne change pas en route.' },
      { q: 'Combien de temps faut-il prévoir ?', a: 'Comptez 30 à 45 minutes selon le quartier et l\'heure ; aux heures de pointe, nous vous proposons une heure de départ adaptée pour arriver 2 h avant un vol international.' },
      { q: 'Suivez-vous les vols à l\'arrivée ?', a: 'Oui. Nous surveillons votre numéro de vol : en cas de retard, l\'attente est incluse et le chauffeur vous attend dans le hall des arrivées.' },
      { q: `Quels quartiers du ${ordinal(a.n)} desservez-vous ?`, a: `Tout l'arrondissement : ${a.quartiers.join(', ')}. Indiquez simplement votre adresse exacte à la réservation.` },
    ],
    related: ['aeroport-marseille-provence', 'gare-saint-charles', 'port-croisiere-marseille', 'transport-medical-conventionne'],
  }
})
```

Puis, dans `destContent`, juste avant le `]` de fermeture, ajouter `...arrondissementPages,`.

- [ ] **Step 2: Build et vérifier**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | grep -cE "✓ /aeroport/130" && grep -c "<loc>" dist/sitemap.xml
```
Attendu : `16` pages et `63` URLs dans le sitemap (46 + médical + 16). Ouvrir `/aeroport/13008/` : h1 « Taxi Marseille 8e → Aéroport Marseille Provence », carte « 70 – 110 € », 4 repères dont Orange Vélodrome.

- [ ] **Step 3: Commit**

```bash
git add src/data/taxi.ts
git commit -m "content(seo): 16 pages aéroport par arrondissement de Marseille"
```

---

### Task 7: Cluster van / groupes — `/van-7-places-groupes/`

**Files:**
- Modify: `src/data/taxi.ts` (entrée dans `destContent`)

- [ ] **Step 1: Écrire l'entrée**

```ts
  {
    id: 'van-7-places-groupes',
    kind: 'service',
    path: '/van-7-places-groupes/',
    destName: 'Taxi van 7 places',
    destCategory: 'Site',
    destPhoto: '/photos/v11.jpg',
    destPhotoSm: '/photos/v11-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: 'Taxi van 7 places Marseille — groupes, familles | Taxi Julien',
    seoDescription: 'Taxi van Mercedes Classe V à Marseille : jusqu\'à 7 passagers et leurs bagages, siège bébé sur demande. Aéroport, gare, port, séminaires, mariages. Prix fixe à la réservation.',
    h1: 'Taxi van 7 places à Marseille',
    kicker: '— Groupes & familles · Mercedes Classe V',
    heroSubtitle: '7 passagers · Grand coffre · Siège bébé sur demande · 24h/24',
    lead: 'Un seul véhicule pour toute la famille ou l\'équipe : la Mercedes Classe V accueille jusqu\'à 7 passagers avec leurs valises, poussettes et équipements. Un prix fixe annoncé à la réservation, quel que soit le nombre de personnes, souvent moins cher que deux taxis. Aéroport, gare Saint-Charles, port de croisière, séminaires, mariages, journées en Provence.',
    fareLabel: 'Prix fixe à la réservation',
    fareNote: 'Supplément réglementé : 4 € par passager à partir du 5e, 2 € par bagage à partir du 4e. Forfaits aéroport 70 – 110 €.',
    spotsTitle: 'Ce que le van permet',
    spotsSub: 'Capacité réelle du véhicule, sans surprise à la prise en charge.',
    spots: [
      { name: '7 passagers assis', blurb: 'Trois rangées, sièges individuels, climatisation arrière.', type: 'other' },
      { name: 'Grand volume de bagages', blurb: 'Jusqu\'à 7 valises cabine et soute, poussette ou sacs de golf.', type: 'other' },
      { name: 'Siège bébé, siège auto, rehausseur', blurb: 'Fournis sur demande à la réservation, sans supplément.', type: 'other' },
      { name: 'Portes coulissantes', blurb: 'Montée et descente faciles pour les enfants et les personnes âgées.', type: 'other' },
      { name: 'Équipements de ski', blurb: 'Transport vers les stations des Hautes-Alpes avec le matériel.', type: 'sport' },
      { name: 'Chauffeur anglophone', blurb: 'Accueil des visiteurs étrangers, pancarte nominative à l\'aéroport.', type: 'other' },
    ],
    useCases: [
      'Famille nombreuse vers l\'aéroport ou le port de croisière, sans fractionner le groupe',
      'Équipe en séminaire ou salon (Parc Chanot, Palais du Pharo) : navettes hôtel ↔ site',
      'Mariage : transport des invités ou des mariés, véhicule discret',
      'Groupe d\'amis pour une journée Cassis, Aix ou Côte d\'Azur',
    ],
    faq: [
      { q: 'Combien de passagers et de bagages ?', a: 'Jusqu\'à 7 passagers et environ 7 valises selon leur taille. Dites-nous le nombre exact de personnes et de bagages à la réservation : nous confirmons que tout tient.' },
      { q: 'Le prix dépend-il du nombre de passagers ?', a: 'Les forfaits (aéroport 70 – 110 €) sont annoncés en fonction du véhicule et du nombre de passagers. Au compteur, le tarif réglementé ajoute 4 € par passager à partir du 5e et 2 € par bagage à partir du 4e.' },
      { q: 'Avez-vous un siège bébé ?', a: 'Oui : siège bébé, siège auto ou rehausseur, fournis sur demande à la réservation, sans supplément.' },
      { q: 'Peut-on réserver plusieurs navettes pour un événement ?', a: 'Oui. Pour un mariage, un séminaire ou un salon, nous organisons les rotations à l\'avance et envoyons un devis écrit.' },
    ],
    related: ['aeroport-marseille-provence', 'port-croisiere-marseille', 'gare-saint-charles', 'cassis'],
  },
```

- [ ] **Step 2: Build, vérifier `✓ /van-7-places-groupes/`, ouvrir la page, commit**

```bash
git add src/data/taxi.ts && git commit -m "content(seo): page taxi van 7 places groupes et familles"
```

---

### Task 8: Cluster hôtels — `/hotels/`

**Files:**
- Modify: `src/data/taxi.ts` (entrée dans `destContent`)

Les hôtels listés sont ceux que l'ancien site liait (pages `lien-hotel-*`) ; tous existent à Marseille. Pas d'adresse postale (non vérifiée), seulement l'arrondissement.

- [ ] **Step 1: Écrire l'entrée**

```ts
  {
    id: 'hotels',
    kind: 'service',
    path: '/hotels/',
    destName: 'Hôtels de Marseille',
    destCategory: 'Ville',
    destPhoto: '/photos/v1.jpg',
    destPhotoSm: '/photos/v1-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: 'Taxi hôtel Marseille ↔ aéroport, port, gare | Taxi Julien',
    seoDescription: 'Transfert taxi entre votre hôtel de Marseille et l\'aéroport Marseille Provence, le port de croisière ou la gare Saint-Charles. Forfait fixe, pancarte nominative, 7 places. 24h/24.',
    h1: 'Taxi depuis et vers les hôtels de Marseille',
    kicker: '— Hôtels · Vieux-Port, Prado, Corniche',
    heroSubtitle: 'Aéroport 70 – 110 € · Port de croisière · Gare Saint-Charles · Pancarte à l\'arrivée',
    lead: 'Réservez votre transfert avant même d\'arriver : nous vous attendons à l\'aéroport ou à la gare avec une pancarte à votre nom et vous déposons devant la réception de votre hôtel. Au départ, le chauffeur est à l\'heure convenue devant l\'entrée, bagages chargés. Forfait fixe annoncé à la réservation, paiement par carte à bord.',
    fareLabel: '70 – 110 € aéroport',
    fareNote: 'Forfait fixe hôtel ↔ aéroport Marseille Provence selon véhicule et passagers. Port et gare : tarif annoncé à la réservation.',
    spotsTitle: 'Hôtels régulièrement desservis',
    spotsSub: 'Une sélection parmi les établissements où nous déposons chaque semaine ; tous les hôtels de la métropole sont desservis.',
    spots: [
      { name: 'Sofitel Marseille Vieux-Port', blurb: 'Marseille 7e, boulevard Charles Livon, face au Vieux-Port.', type: 'hotel' },
      { name: 'InterContinental Marseille – Hôtel-Dieu', blurb: 'Marseille 2e, au-dessus du Panier.', type: 'hotel' },
      { name: 'Radisson Blu Hôtel Marseille Vieux-Port', blurb: 'Marseille 7e, quai Rive Neuve.', type: 'hotel' },
      { name: 'nhow Marseille', blurb: 'Marseille 7e, sur la Corniche Kennedy.', type: 'hotel' },
      { name: 'Le Petit Nice – Passedat', blurb: 'Marseille 7e, Corniche, hôtel-restaurant.', type: 'hotel' },
      { name: 'New Hotel of Marseille – Le Pharo', blurb: 'Marseille 7e, près du Palais du Pharo.', type: 'hotel' },
      { name: 'Mercure Marseille Centre Vieux-Port', blurb: 'Marseille 1er, près de la Canebière.', type: 'hotel' },
      { name: 'Mama Shelter Marseille', blurb: 'Marseille 6e, quartier du Cours Julien.', type: 'hotel' },
      { name: 'Hôtel C2', blurb: 'Marseille 6e, près de la Préfecture.', type: 'hotel' },
      { name: 'Ibis Styles, Citadines et Odalys City Prado Castellane', blurb: 'Marseille 6e et 8e, autour de la place Castellane.', type: 'hotel' },
      { name: 'Novotel Marseille Centre Prado Vélodrome', blurb: 'Marseille 8e, à côté du stade et du Parc Chanot.', type: 'hotel' },
      { name: 'Golden Tulip Marseille Villa Massalia', blurb: 'Marseille 8e, face au parc Borély.', type: 'hotel' },
      { name: 'Hôtel Le Corbusier', blurb: 'Marseille 8e, dans la Cité Radieuse.', type: 'hotel' },
      { name: 'Kyriad Marseille Palais des Congrès', blurb: 'Marseille 10e.', type: 'hotel' },
    ],
    useCases: [
      'Arrivée en avion ou en train : accueil avec pancarte, dépose à la réception',
      'Départ en croisière : hôtel → terminal MSC ou Costa avec les bagages',
      'Séjour professionnel : navettes hôtel ↔ Parc Chanot, Palais du Pharo, bureaux d\'Euroméditerranée',
      'Journée en Provence depuis l\'hôtel : Cassis, Aix, Côte d\'Azur',
    ],
    faq: [
      { q: 'Comment nous retrouver à l\'aéroport ?', a: 'Le chauffeur vous attend dans le hall des arrivées avec une pancarte à votre nom. Nous suivons votre vol : l\'attente en cas de retard est incluse.' },
      { q: 'Combien coûte le transfert hôtel ↔ aéroport ?', a: 'Forfait fixe de 70 à 110 € selon le véhicule et le nombre de passagers, péages compris, annoncé à la réservation.' },
      { q: 'Peut-on payer par carte ?', a: 'Oui, carte bancaire et Visa à bord, espèces acceptées, facture fournie.' },
      { q: 'Mon hôtel n\'est pas dans la liste.', a: 'Nous desservons tous les hôtels et locations de Marseille et de la métropole. Indiquez l\'adresse à la réservation.' },
    ],
    related: ['aeroport-marseille-provence', 'port-croisiere-marseille', 'gare-saint-charles', 'van-7-places-groupes'],
  },
```

- [ ] **Step 2: Build, vérifier `✓ /hotels/`, ouvrir la page (14 hôtels, icône 🏨), commit**

```bash
git add src/data/taxi.ts && git commit -m "content(seo): page transferts hôtels de Marseille"
```

---

### Task 9: Cluster anglais — 3 pages `/en/…/`

**Files:**
- Modify: `src/data/taxi.ts` (3 entrées dans `destContent`, `lang: 'en'`, `parent: { label: 'Home', path: '/' }`)

**Interfaces:**
- Produces: `/en/marseille-airport-taxi/`, `/en/marseille-cruise-port-taxi/`, `/en/marseille-train-station-taxi/` (cibles des règles anglaises, tâche 10).

- [ ] **Step 1: Écrire les trois entrées**

```ts
  {
    id: 'en-airport',
    kind: 'service',
    lang: 'en',
    path: '/en/marseille-airport-taxi/',
    parent: { label: 'Home', path: '/' },
    destName: 'Marseille airport taxi',
    destCategory: 'Aéroport',
    destPhoto: '/photos/v10.jpg',
    destPhotoSm: '/photos/v10-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.4367, lng: 5.2150 },
    seoTitle: 'Marseille Airport Taxi — fixed price, 7 seats | Taxi Julien',
    seoDescription: 'Private taxi between Marseille Provence Airport (MRS) and Marseille: fixed price €70–110, flight tracking, name sign at arrivals, Mercedes V-Class up to 7 passengers. 24/7.',
    h1: 'Marseille Airport Taxi (MRS)',
    kicker: '— Airport transfer · English-speaking driver',
    heroSubtitle: 'Fixed price €70–110 · Flight tracking · Name sign at arrivals · 24/7',
    lead: 'Book before you land: your driver waits in the arrivals hall of Marseille Provence Airport with a sign bearing your name, loads your luggage and drives you to your hotel, cruise terminal or any address in Marseille. Fixed price confirmed at booking, no meter surprises, card payment on board. Mercedes V-Class for up to 7 passengers.',
    fareLabel: '€70 – €110',
    fareNote: 'Fixed one-way price between the airport and Marseille, depending on vehicle and number of passengers, tolls included.',
    spotsTitle: 'Where we take you from the airport',
    spotsSub: 'The most frequent drop-off points, plus any address in the Marseille area.',
    spots: [
      { name: 'Marseille city centre and Vieux-Port hotels', blurb: 'About 30 minutes via the A7 motorway.', type: 'hotel' },
      { name: 'Marseille cruise terminal (MSC, Costa)', blurb: 'Direct transfer to the ship, luggage handled.', type: 'other' },
      { name: 'Saint-Charles train station', blurb: 'Drop-off at the station entrance for TGV connections.', type: 'other' },
      { name: 'Cassis, Aix-en-Provence, Toulon, Saint-Tropez', blurb: 'Long-distance transfers at a fixed price quoted in advance.', type: 'other' },
    ],
    useCases: [
      'Arrival at night or on a public holiday: service runs 24/7',
      'Families with children: baby seat or booster on request, free of charge',
      'Groups up to 7 with luggage in one vehicle',
      'Business travellers: invoice provided, card payment',
    ],
    faq: [
      { q: 'How much is a taxi from Marseille airport to the city?', a: 'A fixed price between €70 and €110 depending on the vehicle and the number of passengers, tolls included. The exact amount is confirmed when you book and does not change.' },
      { q: 'Where do I meet the driver?', a: 'In the arrivals hall, holding a sign with your name. We track your flight, so waiting time caused by a delay is included.' },
      { q: 'Do you accept credit cards?', a: 'Yes: Visa and Mastercard on board, cash accepted, invoice on request.' },
      { q: 'Can you drive us to Cassis or Saint-Tropez?', a: 'Yes. Long-distance transfers are quoted at a fixed price before departure; see our destination pages for the current fares.' },
    ],
    related: ['en-cruise', 'en-station', 'aeroport-marseille-provence', 'cassis'],
  },
  {
    id: 'en-cruise',
    kind: 'service',
    lang: 'en',
    path: '/en/marseille-cruise-port-taxi/',
    parent: { label: 'Home', path: '/' },
    destName: 'Marseille cruise port taxi',
    destCategory: 'Port',
    destPhoto: '/photos/v11.jpg',
    destPhotoSm: '/photos/v11-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.3400, lng: 5.3400 },
    seoTitle: 'Marseille Cruise Port Taxi — MSC, Costa transfers | Taxi Julien',
    seoDescription: 'Taxi between Marseille cruise terminal (MSC, Costa) and the airport, train station or your hotel. Large luggage space, up to 7 passengers, fixed price confirmed at booking. 24/7.',
    h1: 'Marseille Cruise Port Taxi',
    kicker: '— Cruise transfer · MSC & Costa terminals',
    heroSubtitle: 'Airport ↔ terminal · Hotel ↔ ship · Large luggage space · 24/7',
    lead: 'Embarking or disembarking in Marseille? We drive you between the cruise terminal (Môle Léon Gourret, MSC and Costa) and the airport, Saint-Charles station or your hotel, with room for all your suitcases. Book your return in advance: on disembarkation day the driver waits at the terminal exit at the agreed time.',
    fareLabel: 'Fixed price at booking',
    fareNote: 'Terminal ↔ airport, station or hotel: the price is confirmed when you book.',
    spotsTitle: 'Cruise transfers we run every week',
    spotsSub: 'From the terminal to the places cruise passengers need most.',
    spots: [
      { name: 'Cruise terminal ↔ Marseille Provence Airport', blurb: 'About 30 minutes; flight tracking on arrival.', type: 'other' },
      { name: 'Cruise terminal ↔ Saint-Charles station', blurb: 'TGV to Paris, Lyon, Nice; drop-off at the station entrance.', type: 'other' },
      { name: 'Cruise terminal ↔ Vieux-Port hotels', blurb: 'Pre-cruise or post-cruise night in the city centre.', type: 'hotel' },
      { name: 'Shore excursion: Cassis and the Calanques', blurb: 'Private day trip with return to the ship before departure.', type: 'beach' },
      { name: 'Shore excursion: Aix-en-Provence', blurb: 'Cours Mirabeau and Cézanne, back for the all-aboard time.', type: 'monument' },
    ],
    useCases: [
      'Flight landing the morning of embarkation: airport → ship in one ride',
      'Disembarkation with early flight: driver booked at the terminal exit',
      'Family of up to 7 with all luggage in one vehicle',
      'Private shore excursion with guaranteed return to the ship',
    ],
    faq: [
      { q: 'Where does the driver wait at the terminal?', a: 'At the exit of the terminal building, with a sign bearing your name. Tell us your ship and disembarkation time when booking.' },
      { q: 'Do all our suitcases fit?', a: 'The Mercedes V-Class carries up to 7 passengers and around 7 suitcases. Tell us the exact numbers and we confirm.' },
      { q: 'Can we do a day trip during the port call?', a: 'Yes. Cassis, Aix-en-Provence or Marseille itself: we plan the day around your all-aboard time and bring you back to the ship.' },
      { q: 'How do I pay?', a: 'Card (Visa, Mastercard) on board or cash. Invoice on request.' },
    ],
    related: ['en-airport', 'en-station', 'port-croisiere-marseille', 'aix-en-provence'],
  },
  {
    id: 'en-station',
    kind: 'service',
    lang: 'en',
    path: '/en/marseille-train-station-taxi/',
    parent: { label: 'Home', path: '/' },
    destName: 'Marseille train station taxi',
    destCategory: 'Gare',
    destPhoto: '/photos/dest-gare.jpg',
    destPhotoSm: '/photos/dest-gare-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.3028, lng: 5.3806 },
    seoTitle: 'Marseille Saint-Charles Station Taxi | Taxi Julien',
    seoDescription: 'Taxi at Marseille Saint-Charles station: pick-up at the platform exit, transfer to the airport, cruise terminal, your hotel or the whole Provence coast. Up to 7 passengers. 24/7.',
    h1: 'Taxi at Marseille Saint-Charles Station',
    kicker: '— Train station transfer · Name sign at the platform',
    heroSubtitle: 'Platform pick-up · Airport · Cruise terminal · Hotels · 24/7',
    lead: 'Arriving by TGV? Your driver meets you at the platform exit with a sign bearing your name and takes you to your hotel, the airport, the cruise terminal or anywhere on the coast. Departing? We drop you at the station entrance with time to spare. Fixed prices for the main routes, confirmed when you book.',
    fareLabel: 'Fixed price at booking',
    fareNote: 'Station ↔ airport, cruise terminal or hotel: price confirmed at booking. Longer routes: see the fare table on the destination pages.',
    spotsTitle: 'Transfers from Saint-Charles',
    spotsSub: 'Where we take train passengers most often.',
    spots: [
      { name: 'Saint-Charles ↔ Marseille Provence Airport', blurb: 'About 30 minutes via the A7.', type: 'other' },
      { name: 'Saint-Charles ↔ cruise terminal', blurb: 'MSC and Costa embarkations.', type: 'other' },
      { name: 'Saint-Charles ↔ Vieux-Port and Prado hotels', blurb: 'City-centre drop-off at your reception.', type: 'hotel' },
      { name: 'Saint-Charles → Cassis, Aix, Toulon, Saint-Tropez', blurb: 'Fixed-price long-distance transfers.', type: 'other' },
    ],
    useCases: [
      'Late-night train arrival: 24/7 service, driver on the platform',
      'Connection train ↔ plane with tight timing',
      'Group of up to 7 with luggage',
      'Business trip with invoice',
    ],
    faq: [
      { q: 'Where exactly do we meet?', a: 'At the exit of your platform, inside the station, with a sign bearing your name. Give us your train number when booking.' },
      { q: 'How long to the airport?', a: 'About 30 minutes outside rush hour. We suggest a departure time so you arrive 2 hours before an international flight.' },
      { q: 'Do you speak English?', a: 'Yes. Booking by phone, WhatsApp or the online form, in English.' },
      { q: 'How much is the station-to-airport ride?', a: 'A fixed price confirmed at booking depending on the vehicle and the number of passengers.' },
    ],
    related: ['en-airport', 'en-cruise', 'gare-saint-charles', 'aix-en-provence'],
  },
```

- [ ] **Step 2: Build et vérifier la langue**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | grep -cE "✓ /en/" && grep -c 'lang="en"' dist/en/marseille-airport-taxi/index.html && grep -c "Frequently asked questions" dist/en/marseille-airport-taxi/index.html
```
Attendu : `3`, `1`, `1`. Aucune chaîne française dans la page (`grep -c "Questions fréquentes" dist/en/marseille-airport-taxi/index.html` → `0`).

- [ ] **Step 3: Commit**

```bash
git add src/data/taxi.ts && git commit -m "content(seo): three English pages (airport, cruise port, train station)"
```

---

### Task 10: Edge function — routage par intention vers les nouveaux clusters + test commité

**Files:**
- Create: `netlify/edge-functions/legacy-routing.ts` (logique pure, importable par Deno et Node)
- Create: `netlify/edge-functions/legacy-routing.test.ts`
- Modify: `netlify/edge-functions/legacy-redirects.ts` (ne garde que le handler et la config)
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces: `resolveLegacy(pathname: string): string | null` — chemin cible (avec slash final) ou `null` si l'URL n'est pas une URL Jalis.
- Consumes: chemins des tâches 5-9 et 12 (`/transport-medical-conventionne/`, `/aeroport/130XX/`, `/van-7-places-groupes/`, `/hotels/`, `/en/…/`, `/evenements/`).

- [ ] **Step 1: Test d'abord**

```ts
// netlify/edge-functions/legacy-routing.test.ts
// Lancer : npx tsx --test netlify/edge-functions/legacy-routing.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveLegacy } from './legacy-routing.ts'

const cases: [string, string | null][] = [
  // Anglais avant tout
  ['/details-taxi+1+to+5+6+7+places+from+marseille+airport-298.html', '/en/marseille-airport-taxi/'],
  ['/details-call+taxi+to+airport-268.html', '/en/marseille-airport-taxi/'],
  ['/details-marseille+airport+transfers-264.html', '/en/marseille-airport-taxi/'],
  // Médical avant les villes
  ['/taxi+conventionne+pour+urgence+medicale+toulon+dans+le+var-z40', '/transport-medical-conventionne/'],
  ['/details-taxi+medicalise+vsl+aeroport+marseille+transport+conventionne-471.html', '/transport-medical-conventionne/'],
  ['/tarif+taxi+conventionne+par+l+assurance+maladie+gare+aix+tgv-z75', '/transport-medical-conventionne/'],
  // Hôtels avant les villes (« petit nice » ne doit pas aller à Nice)
  ['/lien-hotel+le+petit+nice+passedat-151.html', '/hotels/'],
  ['/details-hotel+mama+shelter+marseille-148.html', '/hotels/'],
  // Arrondissement avant l'aéroport
  ['/details-tarif+taxi+van+de+1+a+5+6+7+personnes+de+marseille+13007+vers+l+aeroport+marseille+provence+marignane-176.html', '/aeroport/13007/'],
  ['/activites-taxi+marseille+aeroport+pour+6+personnes+avec+7+bagages+au+depart+de+marseille+8eme-65.html', '/aeroport/13008/'],
  // Événements
  ['/activites-stade+orange+velodrome+marseille-47.html', '/evenements/'],
  ['/details-taxi+aeroport+de+marseille+provence+vers+palais+des+congres+parc+chanot+marseille+13008-211.html', '/aeroport/13008/'],
  // Villes et hubs (inchangé)
  ['/saint+tropez+sur+la+cote+d+azur-y9', '/destinations/saint-tropez/'],
  ['/transport-prive-transfert-port-maritime-w1.html', '/destinations/port-croisiere-marseille/'],
  ['/reserver+un+taxi+ponctuel+pour+se+rendre+a+aeroport+nice+cote+d+azur-z122', '/destinations/aeroport-nice/'],
  // Ville avant van : « van 7 places sanary » va à Sanary
  ['/details-taxi+van+7+places+sanary-sur-mer+vers+marseille+aeroport-449.html', '/destinations/sanary/'],
  // Van sans ville
  ['/details-reserver+taxi+van+marseille+pour+1+a+7+personnes-307.html', '/van-7-places-groupes/'],
  ['/details-peut-on+reserver+un+taxi+van+a+marseille+avec+siege+bebe+ou+equipements+pour+enfants-445.html', '/van-7-places-groupes/'],
  // Villes secondaires (tâche 11)
  ['/details-tarif+taxi+van+de+1+a+5+6+7+personnes+de+l+aeroport+marseille+provence+marignane+vers+brignoles+dans+le+var+83170-135.html', '/destinations/brignoles/'],
  // Génériques et exacts
  ['/transport-prive-transfert-aeroport-w9.html', '/destinations/aeroport-marseille-provence/'],
  ['/tarifs', '/'],
  ['/-w1.html', '/'],
  // Pas legacy
  ['/', null],
  ['/destinations/cassis/', null],
  ['/mentions-legales/', null],
]

for (const [input, expected] of cases) {
  test(`${input} → ${expected}`, () => {
    assert.equal(resolveLegacy(input), expected)
  })
}
```

- [ ] **Step 2: Lancer le test, vérifier qu'il échoue**

```bash
cd /Users/fouzi/taxi-julien-marseille && npx tsx --test netlify/edge-functions/legacy-routing.test.ts 2>&1 | tail -3
```
Attendu : échec (`Cannot find module './legacy-routing.ts'`).

- [ ] **Step 3: Logique pure `netlify/edge-functions/legacy-routing.ts`**

```ts
// Routage des anciennes URLs Jalis vers la page la plus pertinente du nouveau
// site. Module sans dépendance Deno pour être testable sous Node
// (legacy-routing.test.ts) et importé par l'edge function legacy-redirects.ts.
//
// Principe : on normalise le chemin en mots, puis la PREMIÈRE règle qui
// correspond gagne. L'ordre encode les priorités d'intention :
//   anglais → médical → hôtels → arrondissement → événements → gares →
//   aéroports Nice/Toulon → port → villes → ski → aéroport Marseille →
//   van/groupes → génériques → accueil.

const D = (slug: string) => `/destinations/${slug}/`
const MEDICAL = '/transport-medical-conventionne/'
const HOTELS = '/hotels/'
const VAN = '/van-7-places-groupes/'
const EVENTS = '/evenements/'
const EN_AIRPORT = '/en/marseille-airport-taxi/'
const EN_CRUISE = '/en/marseille-cruise-port-taxi/'
const EN_STATION = '/en/marseille-train-station-taxi/'

export const RULES: [string, string][] = [
  // Anglais
  ['cruise', EN_CRUISE], ['train station', EN_STATION],
  ['airport', EN_AIRPORT], ['call taxi', EN_AIRPORT], ['transfer', EN_AIRPORT], ['transfers', EN_AIRPORT],
  // Médical
  ['conventionne', MEDICAL], ['cpam', MEDICAL], ['vsl', MEDICAL], ['medical', MEDICAL], ['medicale', MEDICAL],
  ['medicalise', MEDICAL], ['clinique', MEDICAL], ['hopital', MEDICAL], ['ipc', MEDICAL], ['timone', MEDICAL],
  ['assurance maladie', MEDICAL], ['securite sociale', MEDICAL],
  // Hôtels
  ['hotel', HOTELS], ['hotels', HOTELS], ['residhotel', HOTELS], ['appart hotel', HOTELS],
  // Événements
  ['velodrome', EVENTS], ['parc chanot', EVENTS], ['palais des congres', EVENTS], ['pharo', EVENTS], ['congres', EVENTS], ['seminaire', EVENTS], ['salon professionnel', EVENTS],
  // Gares
  ['gare aix tgv', D('gare-aix-tgv')], ['aix tgv', D('gare-aix-tgv')],
  ['gare avignon tgv', D('gare-avignon-tgv')], ['avignon tgv', D('gare-avignon-tgv')],
  ['gare saint charles', D('gare-saint-charles')], ['saint charles', D('gare-saint-charles')], ['st charles', D('gare-saint-charles')],
  // Aéroports de Nice et Toulon (avant les villes homonymes)
  ['aeroport nice', D('aeroport-nice')], ['aeroport toulon', D('aeroport-toulon-hyeres')], ['toulon hyeres', D('aeroport-toulon-hyeres')],
  // Port de croisière
  ['port de croisiere', D('port-croisiere-marseille')], ['terminal de croisiere', D('port-croisiere-marseille')], ['terminal croisiere', D('port-croisiere-marseille')],
  ['croisiere', D('port-croisiere-marseille')], ['port maritime', D('port-croisiere-marseille')],
  // Bouches-du-Rhône et Var
  ['calanques de cassis', D('cassis')], ['cassis', D('cassis')], ['la ciotat', D('la-ciotat')], ['saint cyr', D('saint-cyr')],
  ['bandol', D('bandol')], ['sanary', D('sanary')], ['embiez', D('embiez')], ['six fours', D('six-fours')], ['la seyne', D('la-seyne')],
  ['hyeres', D('hyeres')], ['toulon', D('toulon')],
  ['brignoles', D('brignoles')], ['le luc', D('le-luc')], ['vidauban', D('vidauban')], ['cuers', D('cuers')], ['gemenos', D('gemenos')],
  ['carnoux', D('carnoux')], ['pertuis', D('pertuis')], ['saint maximin', D('saint-maximin')], ['le beausset', D('le-beausset')],
  ['ollioules', D('ollioules')], ['la valette', D('la-valette')], ['le pradet', D('le-pradet')], ['carqueiranne', D('carqueiranne')],
  // Ski
  ['pra loup', D('ski-pra-loup')], ['risoul', D('ski-risoul')], ['vars', D('ski-vars')], ['orres', D('ski-orres')],
  // Golfe de Saint-Tropez et Maures
  ['saint tropez', D('saint-tropez')], ['sainte maxime', D('sainte-maxime')], ['ramatuelle', D('ramatuelle')], ['gassin', D('gassin')],
  ['cogolin', D('cogolin')], ['cavalaire', D('cavalaire')], ['la croix valmer', D('la-croix-valmer')], ['rayol', D('rayol-canadel')],
  ['lavandou', D('le-lavandou')], ['bormes', D('bormes-les-mimosas')], ['la londe', D('la-londe')],
  // Côte d'Azur
  ['saint raphael', D('saint-raphael')], ['st raphael', D('saint-raphael')], ['frejus', D('frejus')], ['mandelieu', D('mandelieu')],
  ['cannes', D('cannes')], ['antibes', D('antibes')], ['cagnes', D('cagnes-sur-mer')], ['nice', D('nice-ville')],
  // Aix / Aubagne / Avignon / Arles
  ['aix en provence', D('aix-en-provence')], ['aix', D('aix-en-provence')], ['aubagne', D('aubagne')], ['avignon', D('avignon')], ['arles', D('arles')],
  // Aéroport Marseille Provence (après les villes : « aéroport → Cassis » va à Cassis)
  ['aeroport marseille', D('aeroport-marseille-provence')], ['marseille provence', D('aeroport-marseille-provence')], ['marignane', D('aeroport-marseille-provence')],
  // Van / groupes (après les villes : une ville dans l'URL prime)
  ['7 places', VAN], ['6 places', VAN], ['6 personnes', VAN], ['7 personnes', VAN], ['groupe', VAN], ['minibus', VAN],
  ['siege bebe', VAN], ['siege auto', VAN], ['rehausseur', VAN], ['famille', VAN], ['grand van', VAN],
  // Génériques
  ['aeroport', D('aeroport-marseille-provence')], ['gare', D('gare-saint-charles')],
]

// Chemins nus exposés par l'ancien CMS.
export const EXACT: Record<string, string> = { '/accueil': '/', '/tarifs': '/', '/contact': '/' }

// Une URL Jalis : « + » pour les espaces, suffixe -z##/-y#/-w#, .html, ou
// préfixe connu. Les nouvelles URLs ne correspondent à aucun de ces motifs.
export function isLegacy(pathname: string): boolean {
  return (
    pathname.includes('+') ||
    /-[zyw]\d+(\.html)?$/i.test(pathname) ||
    /\.html$/i.test(pathname) ||
    /^\/(details|activites|archives|lien|transport-prive|nos-activites|toutes-nos-prestations|guide-local|faq-w|avis-clients|visites-touristiques)/i.test(pathname)
  )
}

function normalize(pathname: string): string {
  return ' ' + decodeURIComponent(pathname).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' '
}

// Code postal 130XX ou « 8eme arrondissement » → page aéroport de l'arrondissement.
function arrondissementOf(norm: string): string | null {
  const cp = norm.match(/ 130(0[1-9]|1[0-6]) /)
  if (cp) return `/aeroport/130${cp[1]}/`
  const ord = norm.match(/ (\d{1,2}) ?(?:er|e|eme|ieme) arrondissement /)
  if (ord) {
    const n = Number(ord[1])
    if (n >= 1 && n <= 16) return `/aeroport/130${String(n).padStart(2, '0')}/`
  }
  const glued = norm.match(/ marseille (\d{1,2})(?:er|e|eme) /)
  if (glued) {
    const n = Number(glued[1])
    if (n >= 1 && n <= 16) return `/aeroport/130${String(n).padStart(2, '0')}/`
  }
  return null
}

export function targetFor(pathname: string): string {
  const norm = normalize(pathname)
  // L'anglais, le médical et les hôtels passent avant l'arrondissement.
  for (const [needle, target] of RULES.slice(0, RULES.findIndex(r => r[1] === EVENTS))) {
    if (norm.includes(' ' + needle + ' ')) return target
  }
  const arr = arrondissementOf(norm)
  if (arr) return arr
  for (const [needle, target] of RULES) {
    if (norm.includes(' ' + needle + ' ')) return target
  }
  return '/'
}

export function resolveLegacy(pathname: string): string | null {
  const exact = EXACT[pathname]
  if (exact) return exact
  return isLegacy(pathname) ? targetFor(pathname) : null
}
```

- [ ] **Step 4: Edge function réduite au handler**

Remplacer tout `netlify/edge-functions/legacy-redirects.ts` par :

```ts
// 301 des anciennes URLs Jalis vers la page la plus pertinente. La logique
// de routage vit dans legacy-routing.ts (testée sous Node). Les edge
// functions s'exécutent avant les [[redirects]] de netlify.toml.
import type { Context } from "https://edge.netlify.com";
import { resolveLegacy } from "./legacy-routing.ts";

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const dest = resolveLegacy(url.pathname);
  if (dest === null) return; // pas une URL legacy : pipeline normal
  return new Response(null, {
    status: 301,
    headers: { Location: url.origin + dest, "Cache-Control": "public, max-age=3600" },
  });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/assets/*", "/photos/*", "/fonts/*", "/destinations/*", "/mentions-legales/*",
    "/transport-medical-conventionne/*", "/aeroport/*", "/hotels/*", "/van-7-places-groupes/*", "/en/*", "/evenements/*",
    "/og*", "/favicon.svg", "/*.txt", "/*.xml", "/*.webmanifest", "/*.md", "/*.json",
  ],
};
```

- [ ] **Step 5: Script de test et exécution**

Dans `package.json`, ajouter `"test": "tsx --test netlify/edge-functions/legacy-routing.test.ts",` dans `scripts`. Lancer `npm test`. Attendu : `pass 25`, `fail 0`. Si une ville secondaire (tâche 11) n'est pas encore créée, le test de Brignoles reste vert (le routage ne vérifie pas l'existence de la page) ; la page sera créée en tâche 11.

- [ ] **Step 6: Commit**

```bash
git add netlify/edge-functions/legacy-routing.ts netlify/edge-functions/legacy-routing.test.ts netlify/edge-functions/legacy-redirects.ts package.json
git commit -m "feat(seo): routage des URLs Jalis vers les clusters (anglais, médical, hôtels, arrondissements, van, événements) + test"
```

---

### Task 11: Villes secondaires — 13 pages destination

**Files:**
- Modify: `src/data/taxi.ts` (13 entrées `destContent`, kind destination par défaut)
- Modify: `src/data/taxi.ts` `destinationGroups` (ajouter les ids aux groupes existants)

Villes : brignoles, le-luc, vidauban, cuers, gemenos, carnoux, pertuis, saint-maximin, le-beausset, ollioules, la-valette, le-pradet, carqueiranne. Forfaits : les lignes existantes de `fareTables` sont reprises automatiquement par `findFare` pour Carnoux-en-Provence, Ollioules, La Valette-du-Var, Le Pradet, Carqueiranne (noms exacts à mettre dans `destName`). Les autres affichent « Forfait sur devis » : ne rien inventer.

- [ ] **Step 1: Vérifier les distances et durées**

Pour chaque ville, WebSearch `"distance Marseille <ville> km voiture"` (mode standard), noter km et durée hors pointe ; les écrire avec `~` dans `distanceKm` (entier) et `durationReal` (ex. `'~1h05'`). Noter la source dans un commentaire au-dessus de l'entrée (`// Distance : Google Maps, 2026-10`).

- [ ] **Step 2: Écrire les 13 entrées sur le modèle de Carnoux**

```ts
  // Distance : Google Maps, 2026-10
  {
    id: 'carnoux',
    destName: 'Carnoux-en-Provence',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-cassis.jpg',
    destPhotoSm: '/photos/dest-cassis-sm.jpg',
    distanceKm: 22,
    durationReal: '~30 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2569, lng: 5.5644 },
    seoTitle: 'Taxi Marseille → Carnoux-en-Provence | Taxi Julien',
    seoDescription: 'Taxi Marseille → Carnoux-en-Provence (22 km, 30 min). Forfait fixe depuis la gare Saint-Charles 65 € jour / 80 € nuit, depuis l\'aéroport 125 € / 145 €. Mercedes Classe V 7 places.',
    h1: 'Taxi Marseille → Carnoux-en-Provence',
    heroSubtitle: 'Entre Aubagne et Cassis · 22 km · ~30 min',
    lead: 'Carnoux-en-Provence est à 22 km de Marseille par l\'A50, entre Aubagne et Cassis. Commune résidentielle calme, elle est à dix minutes des calanques de Cassis et des plages de La Ciotat. Nous vous y déposons depuis la gare Saint-Charles, l\'aéroport ou votre adresse à Marseille, à prix fixe.',
    spots: [
      { name: 'Centre de Carnoux', blurb: 'Commerces et résidences, point de dépose habituel.', type: 'other' },
      { name: 'Cassis et ses calanques', blurb: 'À 10 minutes : port, Port-Miou, Cap Canaille.', type: 'beach' },
      { name: 'Aubagne, pays de Pagnol', blurb: 'À 8 km : santons, Garlaban.', type: 'monument' },
    ],
    useCases: [
      'Retour à domicile depuis la gare ou l\'aéroport avec bagages',
      'Transfert vers Cassis ou La Ciotat pour la journée',
      'Déplacement médical conventionné vers les hôpitaux de Marseille',
    ],
    faq: [
      { q: 'Combien coûte un taxi de la gare Saint-Charles à Carnoux ?', a: 'Forfait fixe 65 € en journée (7h–19h) et 80 € la nuit, le dimanche et les jours fériés, jusqu\'à 7 passagers.' },
      { q: 'Et depuis l\'aéroport Marseille Provence ?', a: 'Forfait fixe 125 € en journée et 145 € la nuit, péages inclus, suivi du vol.' },
      { q: 'Combien de temps depuis Marseille ?', a: 'Environ 30 minutes par l\'A50 hors heures de pointe.' },
    ],
    related: ['cassis', 'aubagne', 'la-ciotat', 'aeroport-marseille-provence'],
  },
```

Pour les villes sans forfait dans `fareTables` (Brignoles, Le Luc, Vidauban, Cuers, Gémenos, Pertuis, Saint-Maximin, Le Beausset), la FAQ tarif dit : « Forfait fixe annoncé à la réservation selon votre adresse de prise en charge et le nombre de passagers. » Photos : réutiliser une photo existante cohérente (`/photos/dest-toulon.jpg` pour le Var intérieur, `/photos/dest-aix.jpg` pour Pertuis, `/photos/dest-cassis.jpg` pour Gémenos). Noms exacts à utiliser pour `destName` quand un forfait existe : `Carnoux-en-Provence`, `Ollioules`, `La Valette-du-Var`, `Le Pradet`, `Carqueiranne`.

- [ ] **Step 3: Ajouter les ids aux groupes**

Dans `destinationGroups` : `carnoux`, `gemenos` → « Provence intérieure » ; `ollioules`, `la-valette`, `le-pradet`, `carqueiranne`, `le-beausset`, `cuers`, `brignoles`, `le-luc`, `vidauban`, `saint-maximin` → nouveau groupe `{ title: 'Var intérieur et agglomération toulonnaise', sub: 'De la Sainte-Baume au centre Var', ids: [...] }` ; `pertuis` → « Provence intérieure ».

- [ ] **Step 4: Build, vérifier `✓ /destinations/brignoles/` … (13 lignes), sitemap +13, accueil ≥ 56 liens, commit**

```bash
git add src/data/taxi.ts && git commit -m "content(seo): 13 villes secondaires (Var intérieur, Sainte-Baume, Pertuis)"
```

---

### Task 12: Événements — `/evenements/`

**Files:**
- Modify: `src/data/taxi.ts` (entrée `destContent`)

- [ ] **Step 1: Écrire l'entrée**

```ts
  {
    id: 'evenements',
    kind: 'service',
    path: '/evenements/',
    destName: 'Événements à Marseille',
    destCategory: 'Site',
    destPhoto: '/photos/v6.jpg',
    destPhotoSm: '/photos/v6-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2700, lng: 5.3960 },
    seoTitle: 'Taxi Vélodrome, Parc Chanot, Pharo — événements Marseille | Taxi Julien',
    seoDescription: 'Taxi pour vos événements à Marseille : matchs à l\'Orange Vélodrome, salons et congrès au Parc Chanot, réceptions au Palais du Pharo, concerts au Dôme. Dépose et retour planifiés, 7 places.',
    h1: 'Taxi pour vos événements à Marseille',
    kicker: '— Événements · Stade, congrès, concerts',
    heroSubtitle: 'Orange Vélodrome · Parc Chanot · Palais du Pharo · Le Dôme · Retour planifié',
    lead: 'Un match, un salon, un concert, un mariage : nous vous déposons au plus près de l\'entrée et nous revenons vous chercher à l\'heure convenue, sans attendre un taxi à la sortie. Pour les congrès et séminaires, nous organisons des rotations entre l\'hôtel et le site, avec facture pour l\'entreprise.',
    fareLabel: 'Tarif réglementé ou forfait',
    fareNote: 'Course au compteur (2,24 €/km jour, 2,88 €/km nuit) ou forfait annoncé à la réservation pour les mises à disposition et les navettes.',
    spotsTitle: 'Lieux d\'événements desservis',
    spotsSub: 'Les sites où nous déposons et récupérons le plus souvent.',
    spots: [
      { name: 'Orange Vélodrome', blurb: 'Marseille 8e. Matchs de l\'OM, concerts : dépose aux abords, point de retour convenu à l\'avance.', type: 'sport' },
      { name: 'Parc Chanot — Palais des Congrès et des Expositions', blurb: 'Marseille 8e. Salons, congrès, Foire de Marseille.', type: 'other' },
      { name: 'Palais du Pharo', blurb: 'Marseille 7e. Congrès, galas, mariages, face au Vieux-Port.', type: 'monument' },
      { name: 'Le Dôme', blurb: 'Marseille 4e. Concerts et spectacles.', type: 'other' },
      { name: 'Friche la Belle de Mai', blurb: 'Marseille 3e. Concerts, expositions, soirées.', type: 'museum' },
      { name: 'MuCEM et esplanade du J4', blurb: 'Marseille 2e. Expositions et événements en plein air.', type: 'museum' },
    ],
    useCases: [
      'Soir de match : dépose avant le coup d\'envoi, retour à la sortie du stade',
      'Congrès ou salon : navettes hôtel ↔ Parc Chanot ou Pharo pour une équipe, facture entreprise',
      'Mariage ou réception : transport des mariés et des invités, véhicule discret, chauffeur en tenue',
      'Concert au Dôme ou à la Friche : retour tardif garanti, 24h/24',
    ],
    faq: [
      { q: 'Pouvez-vous revenir nous chercher après le match ?', a: 'Oui. Nous fixons ensemble un point et une heure de retour à l\'écart de la foule ; le chauffeur vous y attend.' },
      { q: 'Comment réserver pour un congrès de plusieurs jours ?', a: 'Appelez-nous avec les horaires des sessions : nous proposons un planning de navettes et un devis écrit, facturé à l\'entreprise.' },
      { q: 'Combien coûte une course vers le Vélodrome ?', a: 'Au tarif réglementé des taxis marseillais : 2,24 € par km en journée, 2,88 € la nuit, prise en charge 2,35 €. Pour une mise à disposition, forfait annoncé à la réservation.' },
      { q: 'Transportez-vous des groupes ?', a: 'Jusqu\'à 7 passagers par véhicule. Au-delà, nous organisons plusieurs rotations.' },
    ],
    related: ['van-7-places-groupes', 'hotels', 'aeroport-marseille-provence', 'gare-saint-charles'],
  },
```

- [ ] **Step 2: Lier les pages services et arrondissements depuis le pied de page**

Toutes les pages des tâches 5 à 9 et 12 existent maintenant : on les rend atteignables depuis l'accueil prérendu. Dans `src/sections/Footer.tsx`, après la ligne `<li><a … href="#faq">FAQ</a></li>` de la colonne « Navigation », ajouter :

```tsx
              <li><a className="hover:text-[var(--color-cream)] transition" href="/transport-medical-conventionne/">Taxi conventionné CPAM</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/van-7-places-groupes/">Van 7 places & groupes</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/hotels/">Hôtels de Marseille</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/evenements/">Événements</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/en/marseille-airport-taxi/" hrefLang="en">English</a></li>
```

Et dans le `<nav aria-label="Toutes nos destinations">` ajouté en tâche 3, après la grille des groupes, ajouter :

```tsx
          <div className="mt-6 text-[13px]">
            <div className="text-[var(--color-silver-deep)] font-semibold mb-2">Aéroport Marseille Provence depuis votre arrondissement</div>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[var(--color-silver-2)]">
              {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
                <li key={n}>
                  <a className="hover:text-[var(--color-cream)] transition" href={`/aeroport/130${String(n).padStart(2, '0')}/`}>{n === 1 ? '1er' : `${n}e`}</a>
                </li>
              ))}
            </ul>
          </div>
```

- [ ] **Step 3: Build, vérifier, commit**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run build 2>&1 | grep -E "evenements|prérendu|Error" && grep -c 'href="/aeroport/130' dist/index.html
```
Attendu : `✓ /evenements/`, la ligne du prérendu sans erreur, `16`.

```bash
git add src/data/taxi.ts src/sections/Footer.tsx && git commit -m "content(seo): page événements + maillage des pages services et arrondissements"
```

---

### Task 13: Blog automatique — constater l'arrêt et le signaler

**Files:** aucun fichier modifié par cette tâche (diagnostic uniquement).

- [ ] **Step 1: Dater le dernier article et lire les derniers runs**

```bash
cd /Users/fouzi/taxi-julien-marseille && git log -1 --format='%ci %s' -- src/data/articles.json && gh run list --workflow=article-gen.yml -L 5 2>&1 | head -8
```

- [ ] **Step 2: Rapporter**

Si les runs sont en échec ou absents, écrire dans le message de fin de plan la date du dernier article, le statut des runs et la première ligne d'erreur du dernier run (`gh run view <id> --log-failed | head -20`). Ne pas corriger ici : la remise en route du pipeline (clé API, crédits, workflow) est un chantier séparé à valider avec Nouh.

---

### Task 14: Vérification finale, déploiement, GSC

**Files:** aucun nouveau fichier.

- [ ] **Step 1: Build complet, lint, test**

```bash
cd /Users/fouzi/taxi-julien-marseille && npm run lint && npm test && npm run build 2>&1 | tail -6
```
Attendu : lint sans erreur, `pass 25`, build : `✓ / prérendu`, 43 + 13 destinations, 16 arrondissements, médical, van, hôtels, 3 anglais, événements, `sitemap.xml (82 URLs)` = 79 entrées de `destContent` + accueil + hub + mentions légales.

- [ ] **Step 2: Pousser et attendre le déploiement**

```bash
git push origin main
```
Attendre ~2 minutes puis :

```bash
for u in "https://taxijulien.com/" "https://taxijulien.com/transport-medical-conventionne/" "https://taxijulien.com/aeroport/13008/" "https://taxijulien.com/hotels/" "https://taxijulien.com/en/marseille-airport-taxi/" "https://taxijulien.com/evenements/" "https://taxijulien.com/sitemap.xml"; do printf "%s %s\n" "$(curl -sI -o /dev/null -w '%{http_code}' "$u")" "$u"; done
```
Attendu : `200` partout.

- [ ] **Step 3: Matrice de redirections en production**

```bash
for u in \
"https://www.taxijulien.com/taxi+conventionne+pour+urgence+medicale+toulon+dans+le+var-z40" \
"https://www.taxijulien.com/lien-hotel+le+petit+nice+passedat-151.html" \
"https://www.taxijulien.com/details-tarif+taxi+van+de+1+a+5+6+7+personnes+de+marseille+13007+vers+l+aeroport+marseille+provence+marignane-176.html" \
"https://www.taxijulien.com/details-call+taxi+to+airport-268.html" \
"https://www.taxijulien.com/activites-stade+orange+velodrome+marseille-47.html" \
"https://www.taxijulien.com/details-reserver+taxi+van+marseille+pour+1+a+7+personnes-307.html" \
"https://www.taxijulien.com/saint+tropez+sur+la+cote+d+azur-y9" \
"https://www.taxijulien.com/accueil" ; do printf "%s → %s\n" "${u#https://www.taxijulien.com}" "$(curl -sIL -o /dev/null -w '%{http_code} %{url_effective}' "$u")"; done
```
Attendu : chaque ligne finit en `200 https://taxijulien.com/<page attendue par le test de la tâche 10>`.

- [ ] **Step 4: Accueil prérendu en production**

```bash
curl -s https://taxijulien.com/ | python3 -I -c "import sys,re,html;s=sys.stdin.read();s=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S);t=html.unescape(re.sub(r'<[^>]+>',' ',s));print('mots:',len(t.split()),'| liens destinations:',len(set(re.findall(r'href=\"/destinations/[a-z0-9-]+/\"',s))))"
```
Attendu : `mots: ≥1500 | liens destinations: ≥56`.

- [ ] **Step 5: GSC (navigateur, compte Google de Nouh)**

Dans Search Console, propriété `taxijulien.com` : Sitemaps → renvoyer `https://taxijulien.com/sitemap.xml` (attendu : 82 URLs découvertes). Inspection d'URL → « Demander l'indexation » pour, dans l'ordre : `/`, `/transport-medical-conventionne/`, `/aeroport/13008/`, `/hotels/`, `/en/marseille-airport-taxi/`, `/evenements/`, `/van-7-places-groupes/`, `/aeroport/13001/`, `/en/marseille-cruise-port-taxi/`, `/destinations/brignoles/` (quota ~10/jour).

- [ ] **Step 6: Suivi à J+14 et J+30**

Lire dans Plausible : visites, événements `Appel`, `WhatsApp`, `Formulaire` ; dans GSC Performance : clics par page sur `/aeroport/*`, `/transport-medical-conventionne/`, `/hotels/`, `/en/*`. Objectif J+30 : nouvelles pages indexées ≥ 80 %, clics organiques en hausse sur quatre semaines glissantes. Si une famille de pages reste « crawlée non indexée » à J+30, renforcer son maillage depuis l'accueil (section Services) avant d'ajouter des pages.
