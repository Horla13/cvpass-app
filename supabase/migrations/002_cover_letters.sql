-- CVpass Sprint 2 — Table cover_letters + colonne job_title sur analyses

-- Ajout de job_title sur analyses pour l'affichage dans /history
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS job_title TEXT;

-- Table cover_letters liée à analyses
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  analyse_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL
);

-- Row Level Security
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cover letters"
  ON cover_letters
  FOR SELECT
  USING (user_id = current_setting('app.user_id', TRUE));

CREATE POLICY "Users can insert own cover letters"
  ON cover_letters
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', TRUE));

CREATE POLICY "Users can update own cover letters"
  ON cover_letters
  FOR UPDATE
  USING (user_id = current_setting('app.user_id', TRUE));
