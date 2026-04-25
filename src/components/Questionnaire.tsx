import type { Dispatch, SetStateAction } from 'react';
import type { PlayerProfile } from '../types';

interface Props {
  profile: PlayerProfile;
  setProfile: Dispatch<SetStateAction<PlayerProfile>>;
}

const labels = {
  level: 'Niveau (1 débutant → 5 avancé)',
  physical: 'Condition physique (1 faible → 5 élevée)',
  riskTolerance: 'Tolérance au risque matériel (1 prudent → 5 audacieux)',
};

export function Questionnaire({ profile, setProfile }: Props) {
  return (
    <section className="card">
      <h2>Questionnaire joueur</h2>
      <p className="muted">Répondez franchement : plus les réponses sont réalistes, plus la recommandation sera utile.</p>

      <div className="grid two-col">
        <label>
          Style principal
          <select
            value={profile.playStyle}
            onChange={(e) => setProfile((p) => ({ ...p, playStyle: e.target.value as PlayerProfile['playStyle'] }))}
          >
            <option value="control">Contrôle</option>
            <option value="allround">Allround</option>
            <option value="offensive">Offensif</option>
          </select>
        </label>

        <label>
          Distance de jeu
          <select
            value={profile.distance}
            onChange={(e) => setProfile((p) => ({ ...p, distance: e.target.value as PlayerProfile['distance'] }))}
          >
            <option value="table">Près de la table</option>
            <option value="mid">Mi-distance</option>
            <option value="far">Loin de la table</option>
          </select>
        </label>

        <label>
          Préférence revers
          <select
            value={profile.backhandPreference}
            onChange={(e) =>
              setProfile((p) => ({ ...p, backhandPreference: e.target.value as PlayerProfile['backhandPreference'] }))
            }
          >
            <option value="secure">Sécuriser</option>
            <option value="balanced">Équilibrer</option>
            <option value="aggressive">Agressif</option>
          </select>
        </label>

        {(['level', 'physical', 'riskTolerance'] as const).map((field) => (
          <label key={field}>
            {labels[field]}
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={profile[field]}
              onChange={(e) => setProfile((p) => ({ ...p, [field]: Number(e.target.value) as never }))}
            />
            <span className="range-value">Valeur : {profile[field]}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
