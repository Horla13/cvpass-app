-- CVpass Sprint 3 — Table subscriptions
-- Stocke le plan payant d'un utilisateur (une ligne par user_id au maximum)

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,                    -- 'pass48h' | 'monthly'
  pass_expires_at TIMESTAMPTZ,           -- NULL pour monthly, timestamp pour pass48h
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'canceled' | 'past_due'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne voient que leur propre subscription
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = current_setting('app.user_id', TRUE));
