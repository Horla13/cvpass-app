-- CVpass — Table analyses
-- Stocke uniquement les métadonnées d'analyse (jamais le contenu des CVs)

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  score_avant INTEGER,
  score_apres INTEGER,
  nb_suggestions INTEGER,
  nb_acceptees INTEGER
);

-- Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne voient que leurs propres analyses
CREATE POLICY "Users can read own analyses"
  ON analyses
  FOR SELECT
  USING (user_id = current_setting('app.user_id', TRUE));

CREATE POLICY "Users can insert own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', TRUE));
