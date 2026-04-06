-- Music Subscriptions table
-- Stores Veus Music subscription status per user

CREATE TABLE IF NOT EXISTS public.music_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'monthly' CHECK (plan IN ('monthly', 'yearly')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT music_subscriptions_user_id_key UNIQUE (user_id)
);

-- RLS
ALTER TABLE public.music_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON public.music_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscription
CREATE POLICY "Users can insert own subscription"
  ON public.music_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription"
  ON public.music_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can see all (via service role, no policy needed)

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER music_subscriptions_updated_at
  BEFORE UPDATE ON public.music_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
