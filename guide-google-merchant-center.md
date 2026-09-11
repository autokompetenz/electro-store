# Guide : Préparer un site e-commerce pour réussir sur Google Merchant Center & Google Ads Shopping

Ce guide couvre tout ce qu'un site e-commerce (React/Node, WooCommerce, Shopify, etc.) doit avoir en place pour être accepté et bien performer sur Google Merchant Center et les campagnes Google Ads Shopping / Performance Max.

---

## 1. Prérequis techniques du site

### 1.1 Site web
- [ ] Site accessible en HTTPS (obligatoire, sinon rejet immédiat)
- [ ] Site vérifié et revendiqué dans Google Search Console / Merchant Center
- [ ] Politique de retour clairement affichée (page dédiée, lien accessible)
- [ ] Coordonnées de contact visibles (email, téléphone, adresse légale)
- [ ] Mentions légales / CGV conformes au pays ciblé (impressum obligatoire en Allemagne)
- [ ] Processus de paiement sécurisé et fonctionnel jusqu'à la confirmation de commande
- [ ] Temps de chargement correct (Google pénalise les sites lents dans le classement Shopping)

### 1.2 Base de données produit
Chaque produit doit avoir, en base (table `Product` ou équivalent) :

| Champ | Obligatoire | Description |
|---|---|---|
| `id` / `sku` | Oui | Identifiant unique et stable du produit |
| `title` | Oui | Titre clair, sans majuscules abusives ni mots promo ("PROMO", "!!!") |
| `description` | Oui | Description factuelle, sans HTML, 500-5000 caractères recommandé |
| `link` | Oui | URL de la fiche produit (doit correspondre exactement au produit) |
| `image_link` | Oui | Image produit haute résolution, fond neutre, sans texte superposé |
| `price` | Oui | Doit être identique au prix affiché sur le site au moment du scan |
| `availability` | Oui | `in stock`, `out of stock`, `preorder` — doit refléter le stock réel |
| `condition` | Oui | `new`, `used`, `refurbished` |
| `brand` | Recommandé | Marque du produit |
| `gtin` | Recommandé | Code-barres international (EAN/UPC) — voir section 2 |
| `mpn` | Recommandé | Référence fabricant |
| `google_product_category` | Recommandé | Catégorie officielle Google (taxonomie) |
| `shipping` | Selon config | Peut être géré dans le flux ou dans les paramètres du compte |

---

## 2. Identifiants produit (GTIN / MPN)

- **GTIN** = code-barres international (EAN en Europe, UPC en Amérique). Obligatoire pour les produits de marques reconnues.
- **MPN** = référence catalogue du fabricant.
- Si le produit est sans marque ou fabriqué en interne sans code-barres : déclarer `identifier_exists: false` dans le flux plutôt que de laisser les champs simplement vides.
- Source de ces données : fiches techniques fournisseurs, catalogues grossistes, ou site officiel du fabricant.

---

## 3. Construction du flux produit (feed)

### Options
1. **Flux dynamique généré par le site** (recommandé pour un site React/Node) : une route backend qui génère un XML (format RSS 2.0 avec namespace `g:`) à partir de la base de données, mis à jour automatiquement.
2. **Fichier statique CSV/XML** : à uploader manuellement — viable seulement pour un petit catalogue stable.
3. **Plugin natif** : WooCommerce, Shopify et PrestaShop ont des extensions dédiées qui génèrent le flux automatiquement.

### Bonnes pratiques
- Régénérer le flux au moins une fois par jour (idéalement en temps réel pour le stock).
- Configurer une **récupération planifiée** dans Merchant Center (Produits > Flux > Ajouter un flux) pointant vers l'URL du flux.
- Vérifier qu'aucun produit interdit par les [règles Google Merchant](https://support.google.com/merchants/answer/6150127) n'est inclus.

---

## 4. Cohérence prix et disponibilité

C'est l'une des causes principales de rejet ou de suspension de compte :
- Le prix dans le flux doit être **strictement identique** au prix affiché sur la page produit au moment où Google visite la page.
- Préciser si le prix est HT ou TTC selon la réglementation du pays cible (important pour l'Allemagne : prix TTC obligatoire pour le grand public, HT accepté en B2B strict avec mention claire).
- La disponibilité (stock) doit être synchronisée en quasi temps réel — un produit affiché "en stock" dans le flux mais épuisé sur le site nuit à la confiance du compte.

---

## 5. Compte Google Ads & Merchant Center

- [ ] Lier le compte Merchant Center au compte Google Ads (Merchant Center > Paramètres > Comptes liés)
- [ ] Vérifier que le pays de vente et la devise déclarés correspondent à la réalité du site
- [ ] Configurer les zones de livraison et délais dans Merchant Center (doivent correspondre au site)
- [ ] Activer le suivi des conversions (Google Ads + Google Analytics/GA4) pour mesurer les ventes issues des campagnes
- [ ] Respecter le [Programme Politiques Merchant Center](https://support.google.com/merchants/answer/6149970) (pas de produits contrefaits, pas de contenu trompeur, etc.)

---

## 6. Erreurs fréquentes à éviter

- Images avec filigrane, texte promo ("-20%") ou logo trop imposant sur l'image produit.
- Titres de produits en majuscules ou bourrés de mots-clés non pertinents.
- Descriptions dupliquées mot pour mot entre plusieurs produits.
- Absence de page de retour/remboursement ou lien cassé.
- Incohérence entre le nombre de produits dans le flux et ceux réellement disponibles à l'achat.
- Oublier de mettre à jour le flux après une rupture de stock.

---

## 7. Check-list de lancement rapide

1. Site en HTTPS, vérifié dans Merchant Center
2. Table produit complète (titre, description, prix, image, stock, GTIN/MPN si applicable)
3. Flux XML/CSV généré et connecté (récupération planifiée)
4. Merchant Center et Google Ads liés
5. Politique de retour et mentions légales en place
6. Premiers produits validés sans erreur dans l'onglet "Diagnostics"
7. Suivi des conversions activé
8. Campagne Shopping ou Performance Max créée avec budget test

---

*Document rédigé pour servir de référence lors de la mise en place de Google Merchant Center sur les sites e-commerce gérés (Power Tools GmbH, Container-Welt, etc.).*
