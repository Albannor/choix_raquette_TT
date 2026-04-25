export type PlayStyle = 'control' | 'allround' | 'offensive';

export interface Wood {
  id: string;
  name: string;
  speed: number;
  control: number;
  stiffness: number;
  weight: number;
  feel: 'soft' | 'medium' | 'hard';
  tags: string[];
}

export interface Rubber {
  id: string;
  name: string;
  speed: number;
  spin: number;
  control: number;
  hardness: number;
  catapult: number;
  style: 'linear' | 'dynamic';
  tags: string[];
}

export interface PlayerProfile {
  level: 1 | 2 | 3 | 4 | 5;
  playStyle: PlayStyle;
  distance: 'table' | 'mid' | 'far';
  physical: 1 | 2 | 3 | 4 | 5;
  riskTolerance: 1 | 2 | 3 | 4 | 5;
  backhandPreference: 'secure' | 'balanced' | 'aggressive';
}

export type RecommendationMode = 'prudente' | 'equilibree' | 'offensive';

export interface Recommendation {
  mode: RecommendationMode;
  wood: Wood;
  forehand: Rubber;
  backhand: Rubber;
  recommendedThickness: {
    forehand: string;
    backhand: string;
  };
  score: number;
  technicalRisk: 'faible' | 'modere' | 'eleve';
  justification: string[];
  alternatives: Array<{ wood: string; forehand: string; backhand: string; score: number }>;
}
