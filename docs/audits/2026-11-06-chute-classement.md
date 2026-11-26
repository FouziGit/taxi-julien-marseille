# Enquête « on ne me trouve plus sur Google » — 6 novembre 2026

Plainte de Julien : il a perdu des places dans Google et ne se retrouve plus.
Sources : Google Search Console (16 mois), recherches Google et Google Maps faites depuis Marseille le 6 novembre, archive de l'ancien site (Wayback Machine, décembre 2024), registre SIRENE.

## Ce que montrent les chiffres

| Mois | Clics Google | Impressions | Position moyenne |
|---|---|---|---|
| Oct. 2025 (ancien site Jalis) | 205 | 27 347 | 16,8 |
| Juin 2026 (nouveau site) | 239 | 16 441 | 10,2 |
| Juil. 2026 | 122 | 12 812 | 11,2 |
| Août 2026 | 97 | 11 818 | 12,2 |
| Sept. 2026 | 77 | 7 565 | 11,5 |
| Oct. 2026 | 71 | 8 207 | 14,6 |

- **Perte d'un an sur l'autre : −65 % de clics** (octobre 2025 → octobre 2026).
- En juin 2026, **179 des 247 clics venaient encore des anciennes pages Jalis** (`www.taxijulien.com/...html`). Elles sont sorties de Google entre juin et septembre : 71 clics la première semaine de juin, 0 depuis septembre. Jusqu'au 9 octobre elles redirigeaient toutes vers l'accueil, ce que Google traite comme des pages supprimées.
- **« taxi marseille »** : position 8 en juin, 16 en octobre, et 1 530 → 216 impressions par mois. Le 6 novembre, recherche depuis Marseille : taxijulien.com absent des 30 premiers résultats.
- **Le nom tient** : « taxi julien marseille » reste 1er, avec liens annexes.
- Rien de cassé techniquement : aucune action manuelle, aucun problème de sécurité, site indexable, certificat valide. Les changements des 3 et 5 novembre ne sont pas en cause (la chute est antérieure et les données s'arrêtent au 3 novembre).

## Causes trouvées

| # | Cause | Preuve | Qui corrige |
|---|---|---|---|
| 1 | **Fiche Google Maps placée dans les Hautes-Alpes.** La fiche de Julien (337 avis, 5/5) n'a ni adresse ni horaires, et sa zone desservie va de Marseille au Mont-Blanc : Google la place au centre, à Ribeyret (05), à 127 km de Marseille. | Sur Google Maps centré sur Marseille, « taxi van marseille » : Julien 23ᵉ sur 36, seule fiche placée à plus de 50 km (les 35 autres sont autour de Marseille). Absent du bloc carte de « taxi marseille ». | Julien (sa fiche) |
| 2 | **H1 de l'accueil sans mot-clé** depuis la refonte de mai 2026 : « Une autre idée du transport. ». L'ancien site disait « Taxi à Marseille pour aéroport, gare, longue distance et transport médical ». | Archive décembre 2024, code source actuel. | Site, corrigé |
| 3 | **Adresse contradictoire** : le site déclarait « Marseille 13008 » (sans source) ; le registre SIRENE et la page mentions légales donnent 33 Traverse de la Baume Loubière, 13013. | recherche-entreprises.api.gouv.fr, SIRET 510 291 370 00037. | Site, corrigé |
| 4 | **Ancienne page tarifs perdue** : `tarifs.html` faisait 1 850 impressions/mois en juin, redirigée vers l'accueil depuis. L'accueil ne montre qu'une grille de tarifs à la fois (onglets) : Google ne voyait pas les grilles aéroport et ski. | Search Console, HTML prérendu. | Site, corrigé |
| 5 | **Perte de la longue traîne Jalis** (750 pages → 83). | Search Console par page. | Long terme : contenus |

## Corrigé sur le site le 6 novembre

| Commit | Correction |
|---|---|
| `78e73de` | H1 de l'accueil : « Taxi à Marseille · 24h/24 » au-dessus du slogan (inchangé). Le build échoue désormais si le H1 perd « taxi » ou « Marseille ». |
| `f77b36d` | Adresse déclarée = siège SIRENE (13013) partout : données structurées, pieds de page, fichiers pour les IA, mentions légales. Le site pointe vers la fiche Google de Julien (`hasMap`, `sameAs`). Test qui garde les deux copies alignées. |
| `4596f7b` | Nouvelle page `/tarifs/` : compteur, suppléments, forfaits, les 3 grilles (gare, aéroport, ski) avec un lien vers chaque destination, FAQ. L'ancienne `tarifs.html` y redirige. Sous-titre de l'accueil « Prix taxi Marseille. Sans surprise. » |

## À faire par Julien (fiche Google Business Profile)

1. **Zone desservie** : garder Marseille et les communes autour (20 zones au plus, à moins de 2 h de route, pas de région entière). Retirer les stations de ski et tout ce qui est loin. Règle Google : https://support.google.com/business/answer/9157481?hl=fr
2. **Adresse de l'établissement** : vérifier qu'elle est bien 33 Traverse de la Baume Loubière, 13013 Marseille (elle peut rester masquée au public).
3. **Horaires** : ouvert 24 h/24, 7 j/7 (aucun horaire n'est affiché aujourd'hui).
4. **Site web** : `https://taxijulien.com/` (aujourd'hui `http://`, sans le s).
5. Point de vigilance, sans urgence : le nom de la fiche (« Taxi van julien 1 à 5,6,7 personnes Aéroport… ») est rempli de mots-clés, ce que les règles Google interdisent (risque de suspension). Le raccourcir peut faire baisser un peu le classement au début : décision à prendre avec Julien.

Les changements de fiche mettent jusqu'à 48 h à apparaître.

## Mesure

- Fiche Maps : refaire « taxi van marseille » et « taxi marseille » sur Google Maps centré sur Marseille une semaine après les changements de Julien.
- Search Console vers le 20 novembre : position de « taxi marseille » (page `https://taxijulien.com/`), impressions de `/tarifs/`.

## Suivi au 17 novembre (données Search Console jusqu'au 16)

| Indicateur | Avant (20 oct. – 2 nov.) | Après (9 – 16 nov.) |
|---|---|---|
| Clics par semaine, tout le site | 15 à 16 | 23 |
| Accueil : clics par jour | 1,0 | 2,2 |
| Page aéroport (position) | 36,4 | 16,5 |
| Port de croisière (position) | 11,4 | 9,8 |
| Saint-Tropez (position) | 10,2 | 7,7 |
| `/tarifs/` | n'existait pas | 151 impressions, position 42,6 |
| Aix TGV (position) | ~25 | ~45 |
| Fiche Maps de Julien | Ribeyret, sans horaires | inchangée |

Aix TGV : chute nette le jour du nouveau titre (3 nov.), deux semaines sans reprise, aucune autre page ne prend le relais. Titre, description, H1 et sous-titre d'avant le 3 novembre remis le 17 (`c7dc46b`), contenu corrigé conservé ; indexation redemandée. À relire vers le 1er décembre.

## Suivi au 24 novembre (données jusqu'au 23)

| Indicateur | Avant (20 oct. – 2 nov.) | 10 – 16 nov. | 17 – 23 nov. |
|---|---|---|---|
| Clics par semaine, tout le site | 15 à 16 | 23 | 19 |
| Accueil (position) | 12,9 | 13,4 | 11,3 |
| « taxi marseille » | ~5 impr./jour, 0 clic | ~18 impr./jour | 257 impr., 3 clics, position 8,1 |
| Aix TGV (position) | ~25 | ~45 | 21,4 et 4 clics (titre d'origine remis le 17) |
| `/tarifs/` (position) | — | 42,6 | 32,1, premier clic |
| Aéroport (position) | 36,4 | 16,5 | 18,5 |
| Fiche Maps de Julien | Ribeyret, sans horaires | inchangée | inchangée |

« taxi marseille » : Google a testé l'accueil en position 4 à 6 du 16 au 19 novembre (~65 impressions/jour), puis l'a ramené vers 22 à partir du 21. Pas encore acquis. Le retour au titre d'origine d'Aix TGV est validé.

## Lot 2 — 26 novembre

En ligne le 26 novembre (`d849d54`, `fac770b`, `e4f2cd4`), indexation redemandée pour les 6 pages.

- Page aéroport : bloc « Forfait aéroport depuis votre arrondissement » avec des liens vers les 16 pages `/aeroport/130xx/` (jusqu'ici liées seulement depuis le pied de page de l'accueil).
- Titres au format Saint-Tropez (« Marseille X : N km, D en taxi ») sur 5 pages en page 1 sans clic, dont les recherches portent sur la distance. H1 inchangés. Nice et Toulon (recherches « taxi + ville », titre avec prix) non modifiées.
- Distance de Sainte-Maxime corrigée : 143 km, 1h40 (Google Maps), au lieu de 135 km copiés de Saint-Tropez. Carte « Saint-Cyr » de l'accueil : ~40 min au lieu de ~55 (Google Maps : 42,9 km, 37 min).

Positions de départ (Search Console, 27 oct. – 25 nov.) pour juger chaque page :

| Page | Impressions | Position |
|---|---|---|
| Carqueiranne | 154 | 9,1 |
| Pra Loup | 245 | 9,0 |
| Le Pradet | 68 | 9,5 |
| Sainte-Maxime | 60 | 13,4 |
| Saint-Cyr-sur-Mer | 235 | 15,0 |
| Aéroport (17 – 23 nov.) | 280 | 18,5 |

Règle : une page qui perd plus de 5 places pendant deux semaines reprend son ancien titre (comme Aix TGV). Bilan vers le 10 décembre.
