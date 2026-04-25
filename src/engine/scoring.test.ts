import { describe, expect, it } from 'vitest';
import { generateRecommendations } from './scoring';
import type { PlayerProfile } from '../types';

const beginnerProfile: PlayerProfile = {
  level: 1,
  playStyle: 'control',
  distance: 'table',
  physical: 2,
  riskTolerance: 1,
  backhandPreference: 'secure',
};

const offensiveProfile: PlayerProfile = {
  level: 4,
  playStyle: 'offensive',
  distance: 'mid',
  physical: 4,
  riskTolerance: 5,
  backhandPreference: 'aggressive',
};

describe('generateRecommendations', () => {
  it('returns the three expected recommendation modes in fixed order', () => {
    const output = generateRecommendations(beginnerProfile);
    expect(output.map((r) => r.mode)).toEqual(['prudente', 'equilibree', 'offensive']);
  });

  it('keeps prudent setup technically safer than offensive for beginner profile', () => {
    const [prudente, , offensive] = generateRecommendations(beginnerProfile);
    const riskToNumber = { faible: 1, modere: 2, eleve: 3 } as const;

    expect(riskToNumber[prudente.technicalRisk]).toBeLessThanOrEqual(riskToNumber[offensive.technicalRisk]);
  });

  it('offers thicker offensive forehand option for high risk tolerance', () => {
    const recommendations = generateRecommendations(offensiveProfile);
    const offensive = recommendations.find((r) => r.mode === 'offensive');

    expect(offensive).toBeDefined();
    expect(offensive?.recommendedThickness.forehand).toBe('max');
  });

  it('always returns alternatives for each recommendation', () => {
    const output = generateRecommendations(offensiveProfile);

    output.forEach((recommendation) => {
      expect(recommendation.alternatives.length).toBeGreaterThan(0);
    });
  });
});
