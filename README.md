# Calculateur Tour Infinie

Application Vue 3 (Vite), buildée en assets statiques et servie par nginx en production.

## Structure

```
tour-calculateur/
├── index.html              # point d'entrée Vite
├── src/
│   ├── main.js
│   ├── App.vue              # assemble les composants
│   ├── components/
│   │   ├── TierSwitcher.vue  # boutons Tier 1 / Tier 2
│   │   ├── StageStats.vue    # vie / ATK / cartes pour un stage
│   │   ├── StageChecker.vue  # vérification des valeurs vues en jeu
│   │   └── TierTable.vue     # table des paliers
│   ├── composables/
│   │   └── useTowerTier.js   # état du tier courant + persistance localStorage
│   ├── lib/
│   │   ├── tiers.js           # formules VIE/ATK/CARTES par tier
│   │   └── format.js          # abréviation façon jeu, parsing, comparaison
│   └── style.css              # tokens de thème (clair/sombre) et styles partagés
├── data/observations.md       # données brutes relevées en jeu
├── Dockerfile                  # build Node -> image nginx finale
├── docker-compose.yml
└── nginx.conf
```

## Prérequis

- Node.js 20+ et npm, pour le développement.
- Docker Desktop, pour lancer la version buildée.

## Développement (hot reload)

```
npm install
npm run dev
```

Ouvre l'URL affichée par Vite (http://localhost:5173 par défaut). Les modifications de fichiers `.vue`/`.js` rechargent automatiquement la page.

## Lancer en Docker (production)

```
docker compose up -d --build
```

Puis ouvrir http://localhost:8080

## Arrêter

```
docker compose down
```

## Changer de port

```
PORT=9000 docker compose up -d --build
```

## Modifier une formule

Éditer l'objet `TIERS` dans [src/lib/tiers.js](src/lib/tiers.js), sauvegarder. En dev (`npm run dev`), le navigateur se recharge automatiquement. Pour la version Docker, relancer `docker compose up -d --build`.

## Ajouter un tier

1. Ajouter une entrée `3: { ... }` dans `TIERS` ([src/lib/tiers.js](src/lib/tiers.js)).
2. Ajouter un bouton correspondant dans [src/components/TierSwitcher.vue](src/components/TierSwitcher.vue).
