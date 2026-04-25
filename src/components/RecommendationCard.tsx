import type { Recommendation } from '../types';

interface Props {
  recommendation: Recommendation;
}

const modeTitle: Record<Recommendation['mode'], string> = {
  prudente: 'Option prudente',
  equilibree: 'Option équilibrée',
  offensive: 'Option offensive',
};

export function RecommendationCard({ recommendation }: Props) {
  return (
    <article className="card recommendation">
      <header>
        <h3>{modeTitle[recommendation.mode]}</h3>
        <span className="badge">Score {recommendation.score}/100</span>
      </header>

      <ul className="config-list">
        <li>
          <strong>Bois :</strong> {recommendation.wood.name}
        </li>
        <li>
          <strong>Coup droit :</strong> {recommendation.forehand.name} ({recommendation.recommendedThickness.forehand})
        </li>
        <li>
          <strong>Revers :</strong> {recommendation.backhand.name} ({recommendation.recommendedThickness.backhand})
        </li>
        <li>
          <strong>Risque technique :</strong> {recommendation.technicalRisk}
        </li>
      </ul>

      <div>
        <h4>Justification</h4>
        <ul>
          {recommendation.justification.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Alternatives proches</h4>
        <ul>
          {recommendation.alternatives.map((alt) => (
            <li key={`${alt.wood}-${alt.forehand}-${alt.backhand}`}>
              {alt.wood} + {alt.forehand} + {alt.backhand} ({alt.score}/100)
            </li>
          ))}
        </ul>
      </div>

      <p className="muted footnote">
        Conseil indicatif : valider idéalement en essai réel, sensations et technique pouvant varier selon chaque joueur.
      </p>
    </article>
  );
}
