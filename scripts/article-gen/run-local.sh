#!/bin/bash
# ============================================================================
# Lancé automatiquement chaque jour par launchd (com.taxijulien.blog).
# Génère l'article du jour, le contrôle, le publie, déploie sur Netlify,
# puis sauvegarde le source sur GitHub. Tout est journalisé.
#
# Test manuel :  bash scripts/article-gen/run-local.sh
# Journal     :  ~/Library/Logs/taxijulien-blog.log
# ============================================================================

# launchd démarre avec un PATH minimal — on le reconstruit explicitement.
export PATH="/Users/fouzi/.nvm/versions/node/v22.22.0/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

PROJECT="/Users/fouzi/testfront"
SITE_ID="40947860-1bf4-46cf-8c44-7f5b579f2c09"
LOG="$HOME/Library/Logs/taxijulien-blog.log"
mkdir -p "$(dirname "$LOG")"

stamp() { date '+%Y-%m-%d %H:%M:%S'; }
say()   { echo "[$(stamp)] $*" | tee -a "$LOG"; }

say "════════ Démarrage article du jour ════════"
cd "$PROJECT" || { say "❌ Projet introuvable : $PROJECT"; exit 1; }

# --- Garde-fou : clé API présente et renseignée ? ---
if [ ! -f "$PROJECT/.env" ] || grep -qE 'sk-ant-xxx|COLLE_TA_CLE' "$PROJECT/.env"; then
  say "⚠️  Clé API manquante. Édite $PROJECT/.env et mets ta vraie ANTHROPIC_API_KEY, puis réessaie."
  exit 0
fi

# --- 1) Génération + contrôle + écriture du store ---
say "▶ Génération…"
npm run gen:article >>"$LOG" 2>&1
GEN_EXIT=$?
say "▶ Génération terminée (exit=$GEN_EXIT)"

# --- 2) Quelque chose a-t-il changé ? ---
if [ -z "$(git status --porcelain)" ]; then
  say "ℹ️  Aucun changement (file de sujets vide ?). Fin."
  say "════════ Fin ════════"
  exit 0
fi

# Un nouvel article publié = articles.json modifié → build + déploiement.
PUBLISHED=0
if ! git diff --quiet -- src/data/articles.json 2>/dev/null; then PUBLISHED=1; fi

# --- 3) Déploiement si un article a réellement été publié ---
if [ "$PUBLISHED" = "1" ]; then
  say "▶ Build du site…"
  if npm run build >>"$LOG" 2>&1; then
    say "▶ Déploiement Netlify (prod)…"
    if netlify deploy --prod --dir=dist --no-build --site "$SITE_ID" >>"$LOG" 2>&1; then
      say "✅ Déployé — l'article est en ligne sur taxijulien.com"
    else
      say "⚠️  Déploiement Netlify échoué (voir le journal). Le source sera quand même sauvegardé."
    fi
  else
    say "❌ Build échoué — on ne déploie pas. Le source sera sauvegardé pour debug."
  fi
else
  say "ℹ️  Pas de nouvel article publié (brouillon ou maj de la file). Pas de déploiement."
fi

# --- 4) Sauvegarde du source sur GitHub (backup + historique) ---
git add src/data/articles.json scripts/article-gen/topics.json scripts/article-gen/_drafts 2>/dev/null
LAST=$(ls -t scripts/article-gen/run-reports/*.json 2>/dev/null | head -1)
if [ "$PUBLISHED" = "1" ] && [ -n "$LAST" ]; then
  SLUG=$(grep -o '"slug": "[^"]*"' "$LAST" | head -1 | cut -d'"' -f4)
  MSG="content(blog): nouvel article « ${SLUG:-du jour} »"
else
  MSG="chore(blog): mise à jour file de sujets / brouillon"
fi
if git diff --cached --quiet; then
  say "ℹ️  Rien à committer."
else
  git commit -m "$MSG" >>"$LOG" 2>&1
  if git push origin main >>"$LOG" 2>&1; then
    say "✅ Source poussé sur GitHub."
  else
    say "⚠️  git push échoué — commit gardé en local, à pousser à la main."
  fi
fi

say "════════ Fin ════════"
