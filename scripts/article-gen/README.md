# Automatisation du blog — Taxi Julien

Génère **1 article de blog par jour**, le **contrôle** (cohérence avec le site de
Julien + exactitude factuelle + anti-remplissage), puis le **publie** automatiquement.
Les articles qui ratent le contrôle partent en brouillon — jamais publiés à l'aveugle.

## Le flux

```
file de sujets (topics.json)
        │  prend le 1er « pending » (priorité high → low)
        ▼
1. GÉNÉRATION  ........  Claude rédige l'article (voix + contexte du site en cache)
        ▼
2. CONTRÔLE  ..........  « double check » en 3 axes :
        │                 • Cohérence avec site-context.md (source de vérité)
        │                 • Faits vérifiés (recherche web activée)
        │                 • Anti-AI-slop (phrases interdites, remplissage)
        ▼
   verdict ?
   ├─ publish  → écrit dans src/data/articles.json + sujet marqué « published »
   ├─ revise   → Claude corrige UNIQUEMENT les problèmes (max 2 passes) puis re-contrôle
   └─ reject   → brouillon dans _drafts/ + sujet marqué « drafted » (relecture humaine)
        ▼
3. PUSH GitHub  ......  déclenche le déploiement Netlify → l'article est en ligne
```

## Fichiers

| Fichier | Rôle |
|---------|------|
| `topics.json` | File de sujets. `status`: pending / published / drafted. Ajoute des sujets à la fin. |
| `site-context.md` | **Source de vérité.** Faits du site (services, tarifs, contact). Le contrôle rejette tout ce qui le contredit. |
| `voice-profile.md` | Profil de voix : ton, structure, style des articles. |
| `banned-phrases.txt` | Tournures d'IA interdites (anti-slop). |
| `cli.mts` | Orchestrateur (`runOnce`). |
| `generate.mts` | Génération + révision ciblée. |
| `review.mts` | Le contrôle qualité 3 axes. |
| `claude-client.mts` | Appel API Anthropic (cache, recherche web, calcul de coût). |
| `lib.mts` | Store articles, file de sujets, image hero, validation, brouillons. |
| `_drafts/` | Articles recalés, en attente de relecture humaine. |
| `run-reports/` | Un rapport JSON par exécution (statut, coût, verdict). |

> La sortie réelle est `src/data/articles.json`, lu par tout le site via `src/data/taxi.ts`.

## Lancer en local

```bash
# 1. Clé API (une seule fois)
cp .env.example .env
# puis renseigne ANTHROPIC_API_KEY dans .env

# 2. Tester sans rien écrire (génère + contrôle, affiche le résultat)
npm run gen:article:dry

# 3. Pour de vrai (écrit l'article + met à jour la file de sujets)
npm run gen:article

# Forcer un sujet précis
npm run gen:article -- --topic=ski-alpes-du-sud-depuis-marseille
```

## En production (automatique)

Workflow GitHub Actions `.github/workflows/article-gen.yml` :
- **tous les jours à 07:00 UTC** (≈ 8h/9h Paris), ou à la demande (onglet *Actions* → *Run workflow*) ;
- nécessite le secret **`ANTHROPIC_API_KEY`** (Settings → Secrets and variables → Actions) ;
- commit + push → Netlify redéploie → l'article est en ligne sans intervention.

## Coût

~ **0,50 à 1,50 $ par article** (génération + contrôle + révisions éventuelles), modèle
`claude-sonnet-4-6`. À 1/jour ≈ **15–40 $/mois**. Chaque run enregistre son coût dans
`run-reports/`.

## Entretien

- **Ajouter des sujets** : éditer `topics.json` (copier un bloc, `status: "pending"`).
- **Relire un brouillon** : ouvrir `_drafts/<slug>.json`, corriger, le coller dans
  `src/data/articles.json` à la main si on veut le publier.
- **Mettre à jour les faits** : éditer `site-context.md` quand un tarif/service change —
  c'est ce qui garantit que les articles restent cohérents avec le site de Julien.
