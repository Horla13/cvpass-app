-- =============================================
-- Migration 006: Refonte systeme credits
-- Nouveaux plans: free, starter, pro, early_access
-- =============================================

-- 1. Renommer beta_whitelist → early_access
ALTER TABLE IF EXISTS beta_whitelist RENAME TO early_access;

-- 2. Refonte table subscriptions
-- Sauvegarder les donnees existantes
CREATE TABLE IF NOT EXISTS _subscriptions_backup AS SELECT * FROM subscriptions;

-- Supprimer l'ancienne table
DROP TABLE IF EXISTS subscriptions;

-- Creer la nouvelle table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  credits_remaining INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: service_role can do everything
CREATE POLICY "Service role full access"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Migrer les donnees existantes vers le nouveau schema
INSERT INTO subscriptions (user_id, plan, status, credits_remaining, stripe_customer_id, stripe_subscription_id, subscription_expires_at, created_at, updated_at)
SELECT
  user_id,
  CASE
    WHEN plan = 'pass48h' THEN 'starter'
    WHEN plan = 'monthly' THEN 'pro'
    ELSE 'free'
  END AS plan,
  COALESCE(status, 'active'),
  0, -- credits will be synced from user_credits
  stripe_customer_id,
  stripe_subscription_id,
  pass_expires_at, -- maps to subscription_expires_at
  created_at,
  updated_at
FROM _subscriptions_backup
ON CONFLICT (user_id) DO NOTHING;

-- 4. Migrer les credits depuis user_credits vers subscriptions
UPDATE subscriptions s
SET credits_remaining = COALESCE(uc.balance, 0)
FROM user_credits uc
WHERE s.user_id = uc.user_id;

-- 5. Supprimer l'ancienne table user_credits (plus necessaire)
DROP TABLE IF EXISTS user_credits;

-- 6. Supprimer la backup
DROP TABLE IF EXISTS _subscriptions_backup;

-- 7. Ajouter cv_json a analyses si pas deja present
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS cv_json JSONB;
