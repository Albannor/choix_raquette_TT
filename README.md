# racket-recommender

Application React + TypeScript + Vite pour recommander une raquette de tennis de table (bois + plaques CD/RV) selon un questionnaire joueur.

## Fonctionnalités

- Données locales JSON (pas de backend)
- Questionnaire joueur (niveau, style, distance, physique, tolérance au risque, préférence revers)
- 3 recommandations : prudente, équilibrée, offensive
- Scoring transparent avec justifications explicites
- Alternatives proches pour chaque scénario
- Tests unitaires sur la logique de scoring

## Lancer

```bash
npm install
npm run dev
```

## Tester

```bash
npm test
```
