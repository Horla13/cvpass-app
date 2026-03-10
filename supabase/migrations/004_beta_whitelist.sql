-- CVpass — Table beta_whitelist
-- Liste blanche des emails autorisés pendant la phase bêta

CREATE TABLE IF NOT EXISTS beta_whitelist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pas de RLS : accès uniquement via service_role (côté serveur)
