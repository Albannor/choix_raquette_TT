import rubbersData from '../data/rubbers.json';
import woodsData from '../data/woods.json';
import type { PlayerProfile, Recommendation, RecommendationMode, Rubber, Wood } from '../types';

const woods = woodsData as Wood[];
const rubbers = rubbersData as Rubber[];

type Combo = { wood: Wood; forehand: Rubber; backhand: Rubber; score: number; reasons: string[]; riskPoints: number };

const styleTargets = {
  control: { speed: 58, spin: 72, control: 86 },
  allround: { speed: 70, spin: 80, control: 80 },
  offensive: { speed: 84, spin: 86, control: 70 },
};

const modeWeights: Record<RecommendationMode, { speed: number; spin: number; control: number; risk: number }> = {
  prudente: { speed: 0.25, spin: 0.25, control: 0.5, risk: 1.1 },
  equilibree: { speed: 0.34, spin: 0.33, control: 0.33, risk: 0.95 },
  offensive: { speed: 0.45, spin: 0.35, control: 0.2, risk: 0.7 },
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const proximityScore = (value: number, target: number, range = 45): number => clamp(100 - (Math.abs(value - target) / range) * 100, 0, 100);

const thicknessByMode = (mode: RecommendationMode, riskTolerance: number) => {
  const safe = riskTolerance <= 2;
  if (mode === 'prudente') {
    return { forehand: safe ? '1.8 mm' : '1.9 mm', backhand: '1.8 mm' };
  }
  if (mode === 'equilibree') {
    return { forehand: safe ? '1.9 mm' : '2.0 mm', backhand: safe ? '1.8 mm' : '1.9 mm' };
  }
  return { forehand: safe ? '2.0 mm' : 'max', backhand: safe ? '1.9 mm' : '2.0 mm' };
};

const riskLabel = (riskPoints: number): Recommendation['technicalRisk'] => {
  if (riskPoints < 28) return 'faible';
  if (riskPoints < 48) return 'modere';
  return 'eleve';
};

const computeCombo = (profile: PlayerProfile, mode: RecommendationMode, wood: Wood, forehand: Rubber, backhand: Rubber): Combo => {
  const base = styleTargets[profile.playStyle];
  const weights = modeWeights[mode];

  const effectiveSpeed = wood.speed * 0.35 + forehand.speed * 0.4 + backhand.speed * 0.25;
  const effectiveSpin = forehand.spin * 0.55 + backhand.spin * 0.45;
  const effectiveControl = wood.control * 0.4 + forehand.control * 0.3 + backhand.control * 0.3;

  let score =
    proximityScore(effectiveSpeed, base.speed) * weights.speed +
    proximityScore(effectiveSpin, base.spin) * weights.spin +
    proximityScore(effectiveControl, base.control) * weights.control;

  const reasons: string[] = [];
  let riskPoints = 0;

  const avgRubberHardness = (forehand.hardness + backhand.hardness) / 2;
  if (profile.level <= 2 && avgRubberHardness > 45) {
    score -= 12;
    riskPoints += 16;
    reasons.push('Dureté élevée des plaques pour un niveau en progression.');
  }

  if (profile.physical <= 2 && wood.weight > 84) {
    score -= 7;
    riskPoints += 8;
    reasons.push('Poids total potentiellement fatigant sur longs échanges.');
  }

  if (profile.backhandPreference === 'secure' && backhand.control < 78) {
    score -= 9;
    riskPoints += 12;
    reasons.push('Revers moins tolérant que votre préférence sécurisée.');
  }

  if (mode === 'offensive' && forehand.speed >= 85) {
    score += 5;
    reasons.push('Coup droit puissant cohérent avec une recommandation offensive.');
  }

  if (mode === 'prudente' && wood.control >= 84 && backhand.control >= 80) {
    score += 6;
    reasons.push('Ensemble bois + revers très stable pour sécuriser le jeu.');
  }

  if (profile.distance === 'far' && wood.speed < 65) {
    score -= 5;
    reasons.push('Bois un peu limité pour jouer régulièrement loin de la table.');
  }

  const catapultPenalty = Math.max(forehand.catapult, backhand.catapult) - (profile.riskTolerance * 12 + 20);
  if (catapultPenalty > 0) {
    const penalty = catapultPenalty * 0.18;
    score -= penalty;
    riskPoints += penalty * 1.4;
    reasons.push('Effet catapultage marqué, exigeant dans le petit jeu.');
  }

  return { wood, forehand, backhand, score: clamp(score, 0, 100), reasons, riskPoints };
};

const buildJustification = (combo: Combo, mode: RecommendationMode): string[] => {
  const core = [
    `Bois ${combo.wood.name} pour son ratio vitesse/contrôle (${combo.wood.speed}/${combo.wood.control}).`,
    `Coup droit ${combo.forehand.name} orienté ${mode === 'prudente' ? 'sécurité et régularité' : 'initiative et rotation'}.`,
    `Revers ${combo.backhand.name} choisi pour équilibrer contrôle (${combo.backhand.control}) et dynamisme (${combo.backhand.speed}).`,
  ];

  return [...core, ...combo.reasons];
};

const generateModeRecommendation = (profile: PlayerProfile, mode: RecommendationMode): Recommendation => {
  const combos: Combo[] = [];

  woods.forEach((wood) => {
    rubbers.forEach((forehand) => {
      rubbers.forEach((backhand) => {
        combos.push(computeCombo(profile, mode, wood, forehand, backhand));
      });
    });
  });

  combos.sort((a, b) => b.score - a.score);

  const best = combos[0];
  const alternatives = combos
    .slice(1)
    .filter((c) => c.wood.id !== best.wood.id || c.forehand.id !== best.forehand.id || c.backhand.id !== best.backhand.id)
    .slice(0, 3)
    .map((c) => ({
      wood: c.wood.name,
      forehand: c.forehand.name,
      backhand: c.backhand.name,
      score: Number(c.score.toFixed(1)),
    }));

  return {
    mode,
    wood: best.wood,
    forehand: best.forehand,
    backhand: best.backhand,
    recommendedThickness: thicknessByMode(mode, profile.riskTolerance),
    score: Number(best.score.toFixed(1)),
    technicalRisk: riskLabel(best.riskPoints),
    justification: buildJustification(best, mode),
    alternatives,
  };
};

export const generateRecommendations = (profile: PlayerProfile): Recommendation[] => [
  generateModeRecommendation(profile, 'prudente'),
  generateModeRecommendation(profile, 'equilibree'),
  generateModeRecommendation(profile, 'offensive'),
];
