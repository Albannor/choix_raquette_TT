import { useMemo, useState } from 'react';
import { Questionnaire } from './components/Questionnaire';
import { RecommendationCard } from './components/RecommendationCard';
import { generateRecommendations } from './engine/scoring';
import type { PlayerProfile } from './types';

const initialProfile: PlayerProfile = {
  level: 2,
  playStyle: 'allround',
  distance: 'mid',
  physical: 3,
  riskTolerance: 2,
  backhandPreference: 'balanced',
};

function App() {
  const [profile, setProfile] = useState<PlayerProfile>(initialProfile);
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);

  return (
    <main className="container">
      <h1>racket-recommender</h1>
      <p className="intro">
        Outil d’aide au choix bois + coup droit + revers pour tennis de table, avec un moteur de scoring transparent et trois
        scénarios de risque.
      </p>

      <Questionnaire profile={profile} setProfile={setProfile} />

      <section className="results-grid">
        {recommendations.map((rec) => (
          <RecommendationCard recommendation={rec} key={rec.mode} />
        ))}
      </section>
    </main>
  );
}

export default App;
