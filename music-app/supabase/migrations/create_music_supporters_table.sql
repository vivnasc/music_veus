-- music_supporters: tracks users who have donated/supported Loranne
-- Admin marks users as supporters manually after confirming donation

CREATE TABLE IF NOT EXISTS public.music_supporters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text DEFAULT 'supporter' CHECK (tier IN ('supporter', 'patron', 'founding')),
  amount numeric,
  currency text DEFAULT 'USD',
  notes text,
  show_name boolean DEFAULT false,
  display_name text,
  created_at timestamptz DEFAULT now(),
  confirmed_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.music_supporters ENABLE ROW LEVEL SECURITY;

-- Users can read their own supporter status
CREATE POLICY "Users can read own supporter status"
  ON public.music_supporters FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can do everything (via service role or user_roles)
CREATE POLICY "Admin full access to supporters"
  ON public.music_supporters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_music_supporters_user_id ON public.music_supporters(user_id);
