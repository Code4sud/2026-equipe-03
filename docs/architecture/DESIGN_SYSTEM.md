# MonBilan+ — Design System

> **Version :** 1.0 — 18 novembre 2026  
> **Statut :** Proposition à valider avec l'équipe 03 et le Centre des Possibles  
> **Périmètre :** Application jeune, interface conseiller, démonstration du Hackathon Azuréen #3  
> **Références :** `docs/architecture/charte-graphique-palette-centre-des-possibles.pdf`, logo MonBilan+ fourni par l'équipe.

## 1. Positionnement et principes

**Promesse :** « Comprends ton bilan. Explore tes possibles. »

MonBilan+ rend compréhensibles les rapports d'orientation sans se substituer à un psychologue ou conseiller. L'interface doit être **rassurante, inclusive, claire, engageante et crédible**, pour les 15–25 ans et les professionnels.

Principes UX :

1. **Comprendre avant d'explorer :** phrases simples, une idée par écran, hiérarchie nette.
2. **Jamais de verdict :** préférer « pistes à explorer » à « métiers faits pour toi ».
3. **Toujours sourcer :** lien explicite vers la page du rapport pour toute affirmation personnelle.
4. **Accessible sans audio :** transcription intégrale, contrôle de lecture, sous-titres si vidéo.
5. **Contrôle humain :** brouillons, validation du conseiller et statut de publication visibles.
6. **Confidentialité :** ne pas afficher de données personnelles dans les aperçus publics, les notifications ou les URL.

## 2. Identité de marque et cohabitation avec le Centre

Le Centre des Possibles possède une identité **bleu nuit / bleu lumineux / rose néon**. MonBilan+ conserve cette filiation visuelle mais adopte une interface **claire par défaut**, avec des accents bleu-violet. Le mode sombre est prévu pour les séquences immersives (audio, découverte), jamais imposé.

**Important :** la palette du Centre est une référence visuelle ; son usage ne signifie pas que MonBilan+ est une identité officielle du Centre ou bénéficie de son approbation. Vérifier les droits d'utilisation des logos et des polices.

### 2.1 Couleurs provenant de la charte fournie

| Nom dans la charte du Centre | HEX | Usage dans la charte source |
|---|---|---|
| Bleu Nuit | `#1B1B62` | Fond principal sombre |
| Lumière Bleue | `#5D62EA` | Boutons et éléments mis en avant |
| Rose Néon | `#E0349B` | Ombres, filets, états actifs |
| Violet Cosmique | `#9940C4` | Halos et survols |
| Lavande Stardust | `#E7E8FB` | Titres et textes sur fond sombre |
| Blanc Pur | `#FFFFFF` | Corps et titres sur fond sombre |
| Bleu Texte | `#262B61` | Couleur secondaire |
| Vert Succès | `#38A678` | Sémantique positive |
| Orange Avertie | `#E37636` | Avertissement |
| Orange Attentive | `#EB614C` | Attention |

La charte source mentionne également des dégradés de cartes, des halos, du glassmorphism, les polices Greycliff CF et Visby CF Heavy, et des boutons pilules. **Ces effets ne doivent pas être reproduits systématiquement** dans les écrans de lecture.

### 2.2 Couleurs proposées pour MonBilan+ (non officielles)

| Token | HEX | Rôle |
|---|---|---|
| `brand.navy` | `#1B1B62` | Titres et navigation |
| `brand.primary` | `#5D62EA` | CTA principal, liens visuellement distincts |
| `brand.violet` | `#7935F5` | Accent propre à MonBilan+ |
| `brand.pink` | `#E0349B` | Accent décoratif ponctuel |
| `surface.canvas` | `#F8FAFF` | Fond clair |
| `surface.card` | `#FFFFFF` | Cartes et formulaires |
| `surface.soft` | `#E7E8FB` | Fonds secondaires |
| `text.primary` | `#1B1B62` | Texte principal |
| `text.secondary` | `#42466B` | Descriptions |
| `border.default` | `#D8DCF0` | Bordures |
| `focus.ring` | `#1B1B62` | Anneau de focus sur fond clair |

Les couleurs d'état (succès, erreur, avertissement) doivent être **validées sur leurs fonds réels** : les couleurs du Centre sont des points de départ, pas une garantie de contraste suffisant.

### 2.3 Tokens CSS de départ

```css
:root {
  color-scheme: light;
  --mb-brand-navy: #1b1b62;
  --mb-brand-primary: #5d62ea;
  --mb-brand-violet: #7935f5;
  --mb-brand-pink: #e0349b;
  --mb-bg: #f8faff;
  --mb-surface: #ffffff;
  --mb-surface-soft: #e7e8fb;
  --mb-text: #1b1b62;
  --mb-text-secondary: #42466b;
  --mb-border: #d8dcf0;
  --mb-focus: #1b1b62;
  --mb-radius-sm: 8px;
  --mb-radius-md: 12px;
  --mb-radius-lg: 20px;
  --mb-radius-xl: 28px;
  --mb-shadow-card: 0 8px 30px rgb(27 27 98 / 7%);
  --mb-font-sans: "Plus Jakarta Sans", Arial, sans-serif;
}

[data-theme="dark"] {
  color-scheme: dark;
  --mb-bg: #11113a;
  --mb-surface: #1b1b62;
  --mb-surface-soft: #262b61;
  --mb-text: #ffffff;
  --mb-text-secondary: #e7e8fb;
  --mb-border: #5156a0;
  --mb-focus: #ffffff;
}
```

> Le contraste des combinaisons réelles doit être testé en CI et manuellement. En mode sombre, un CTA `#5D62EA` exige un texte blanc vérifié ; ne pas appliquer aveuglément la même paire de couleurs à tous les états.

## 3. Typographie

**Source Centre :** Greycliff CF (référencée via Adobe Typekit), Visby CF Heavy, et alternatives Arial / Plus Jakarta Sans.

**Proposition MonBilan+ :** `Plus Jakarta Sans` comme police principale **si la licence et le mode de chargement sont validés**, avec repli `Arial, sans-serif`. Ne pas distribuer les fichiers Greycliff/Visby sans licence appropriée. Prévoir une police système en cas de chargement indisponible.

| Élément | Taille de base | Graisse | Interligne |
|---|---:|---:|---:|
| H1 | 36 px (mobile 30 px) | 700–800 | 1.15 |
| H2 | 28 px (mobile 24 px) | 700 | 1.25 |
| H3 | 22 px | 700 | 1.3 |
| Texte courant | 16–18 px | 400 | 1.6 |
| Texte secondaire | 14–16 px | 400 | 1.5 |
| Boutons | 16 px | 600 | 1.25 |
| Légendes | 14 px min. si possible | 400 | 1.4 |

Limiter la longueur des paragraphes (environ 60–75 caractères par ligne sur desktop), éviter les longues capitales et les ombres sur les textes informatifs. Le zoom à 200 % ne doit pas masquer de contenu.

## 4. Grille, espacements et responsive

- **Échelle d'espacement :** `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px`.
- **Largeur de lecture :** environ `720–800 px` ; tableaux de bord jusqu'à `1200–1280 px`.
- **Mobile-first :** 1 colonne sur mobile, 2 colonnes selon le contenu sur tablette, grille flexible sur desktop.
- **Zones tactiles :** viser au moins `44 × 44 px` pour les commandes principales.
- **Coins :** 12 px pour champs, 16–20 px pour cartes, pilules uniquement pour les CTA pertinents.
- **Ombres :** discrètes ; le glow néon est réservé aux zones promotionnelles ou immersives.
- **Animations :** courtes, fonctionnelles et désactivables via `prefers-reduced-motion`.

## 5. Bibliothèque de composants

| Composant | Variantes / états requis | Règle d'usage |
|---|---|---|
| `MbButton` | primary, secondary, text, danger ; hover, focus, loading, disabled | Une action principale par zone |
| `MbCard` | standard, interactive, highlighted | Pas de dégradé sur de longs paragraphes |
| `MbBadge` | draft, pending, approved, published | État explicite en texte, pas uniquement par couleur |
| `MbAudioPlayer` | play/pause, vitesse, progression, transcription | Utilisable au clavier et sans son |
| `MbSourceLink` | page, document, extrait | Affiche une preuve vérifiable du rapport |
| `MbCareerCard` | métier, zone, source, action explorer | Jamais « compatibilité garantie » |
| `MbProgress` | étapes nommées, pourcentage facultatif | Ne pas simuler un score d'orientation |
| `MbEmptyState` | attente, aucun rapport, erreur | Message compréhensible et action suivante |
| `MbDialog` | confirmation, avertissement | Gestion du focus et retour du focus |
| `MbFormField` | normal, erreur, aide, requis | Libellé toujours visible, erreur descriptive |

**États obligatoires** pour les écrans de données : `loading`, `empty`, `error`, `success`, `unauthorized` ; ne jamais afficher des données d'un autre tenant pendant un changement de contexte.

## 6. Écrans et parcours

### 6.1 Espace jeune

1. **Accueil :** « Ton bilan, expliqué simplement » ; bouton « Écouter mon bilan ».
2. **Restitution :** audio + transcription synchronisée si disponible ; sections courtes.
3. **Ce que dit mon rapport :** centres d'intérêt, aptitudes et personnalité présentés avec précautions, références visibles.
4. **Métiers à explorer :** métiers déjà présents dans le rapport, regroupés par zone, sans classement nouveau.
5. **Mes questions :** carnet privé de questions pour le prochain échange avec un professionnel.

Ne pas ajouter d'espace parent par défaut.

### 6.2 Espace conseiller

1. Liste des dossiers autorisés.
2. Import du PDF avec statut et contrôle de confidentialité.
3. Vérification des faits extraits, avec pages sources.
4. Relecture du script généré et des références.
5. Validation explicite, puis génération audio et publication.

Les états `BROUILLON → À VÉRIFIER → VALIDÉ → PUBLIÉ` doivent être lisibles, avec historique des modifications.

### 6.3 Administration tenant

Gérer les membres, rôles, paramètres de l'établissement et journaux d'audit autorisés. Aucun accès inter-établissements implicite.

## 7. Graphiques et restitution des résultats

- Conserver **les noms et ordres** du rapport source (RIASEC, dimensions cognitives, HEXACO) sans créer de valeurs non extraites.
- Une légende textuelle doit accompagner chaque graphique.
- Ne jamais coder les résultats uniquement par couleur.
- Proposer un mode « lire sous forme de liste ».
- Afficher une note : « Ces résultats sont des pistes de réflexion, pas une définition de qui tu es. »
- Ne pas représenter une aptitude comme une probabilité de réussite.
- Pour les zones de métiers, expliquer le **niveau de préparation ou de formation** selon la méthodologie du Centre, pas une hiérarchie de valeur.

## 8. Accessibilité et inclusion

**Objectif :** WCAG 2.2 AA et RGAA applicable ; conformité à vérifier, non présumée.

Checklist de conception :

- Contraste texte normal ≥ 4,5:1 ; grand texte ≥ 3:1 ; composants et focus visibles ≥ 3:1 selon les critères applicables.
- Navigation clavier complète, ordre de focus logique et indication visible.
- Libellés de champs persistants, erreurs associées au champ.
- Pas d'animation automatique essentielle ; prise en compte de `prefers-reduced-motion`.
- Aucun audio automatique ; transcription complète disponible.
- Contrôles de vitesse audio et pause ; pas de limite de temps injustifiée.
- Langue de page `fr`, titres hiérarchiques, noms accessibles des icônes.
- Tests sur mobile, zoom 200 %, lecteur d'écran et navigation sans souris.
- Langage clair, sans infantiliser les jeunes adultes.

## 9. Logo et iconographie

Le logo fourni associe un **M bleu-violet**, une flèche ascendante, un mortier et le mot-symbole « MonBilan+ ».

Prévoir, après validation graphique :

- **Version complète :** logo + nom + signature pour présentation / landing.
- **Version horizontale compacte :** symbole + nom, sans signature pour navbar.
- **Icône :** symbole simplifié, sans texte, pour favicon / PWA.
- **Version monochrome :** pour impressions et petits formats.

Ne pas redessiner ou modifier le logo de l'équipe sans accord. Préférer des SVG originaux exportés depuis le fichier source ; ne pas vectoriser approximativement une image raster en production.

Iconographie : pictogrammes simples, traits cohérents, toujours associés à des libellés lorsque l'action pourrait être ambiguë.

## 10. Angular + Tailwind : conventions d'intégration

- Centraliser les tokens dans `apps/web/src/styles/tokens.css` (chemin à adapter à l'application réellement créée).
- Utiliser les variables CSS dans Tailwind plutôt que dupliquer les HEX dans chaque composant.
- Créer les composants partagés dans `apps/web/src/app/shared/ui/` ou dans une bibliothèque UI dédiée **seulement si la structure du monorepo le justifie**.
- Éviter les styles globaux pour les composants métier ; privilégier classes utilitaires et encapsulation Angular.
- Définir `light` par défaut et `dark` par attribut `data-theme`, avec persistance de préférence uniquement après décision produit.
- Tester chaque composant sur mobile, clavier, zoom et états de chargement.

Exemple de bouton (à ajuster après contrôle de contraste et tests) :

```html
<button
  type="button"
  class="min-h-11 rounded-xl bg-[var(--mb-brand-primary)] px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mb-focus)] disabled:opacity-50"
>
  Écouter mon bilan
</button>
```

## 11. Confidentialité dans l'interface

- Ne pas exposer les PDF personnels sur GitHub Pages ou dans `assets/` publics.
- Ne pas afficher les noms complets de jeunes dans les captures publiques sans autorisation appropriée.
- Utiliser des comptes et données fictifs pour la démo.
- Prévoir un indicateur explicite du tenant actif dans l'espace conseiller.
- Toujours masquer les informations privées lors des erreurs, journaux et écrans partagés.

## 12. Critères d'acceptation UI

Un écran est prêt à fusionner si :

- [ ] Il utilise les tokens et composants communs.
- [ ] Il fonctionne sur mobile et desktop.
- [ ] Les contrastes, le focus et les états sont testés.
- [ ] Les informations personnelles sont sourcées ou clairement indiquées comme non vérifiées.
- [ ] Les états vides, erreurs et chargements sont prévus.
- [ ] L'audio a une transcription et n'est pas lancé automatiquement.
- [ ] Aucun texte ne présente une orientation comme une certitude.
- [ ] Les ressources ne sont pas accessibles hors du tenant et des permissions du dossier.
- [ ] La démonstration GitHub Pages conserve le bandeau officiel Code4Sud.

## 13. Décisions à valider avec l'équipe

1. Confirmation du **nom MonBilan+**, du logo et des droits d'utilisation des éléments graphiques du Centre.
2. Choix de la police finale et vérification de sa licence.
3. Validation des couleurs adaptées et tests de contraste des couples fond/texte.
4. Choix de la présentation des résultats (liste accessible + graphique facultatif).
5. Emplacement définitif de ce fichier et des assets dans le dépôt.

---

**Traçabilité :** les HEX, la palette nocturne, les dégradés et les polices de la section 2.1 proviennent du PDF « Centre des Possibles — Palette & Charte Graphique ». Les tokens MonBilan+, les règles UX, composants, tailles et parcours sont des **propositions de conception** de ce document, à faire approuver par l'équipe.
