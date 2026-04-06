-- Fan suggestions / interaction with Loranne
-- Users propose song themes, share lyrics inspiration, suggest ideas

CREATE TABLE IF NOT EXISTS music_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text,
  type text NOT NULL DEFAULT 'theme', -- 'theme', 'lyrics', 'collab', 'message'
  content text NOT NULL,
  status text DEFAULT 'new', -- 'new', 'read', 'inspired', 'archived'
  admin_note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE music_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can suggest" ON music_suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users see own" ON music_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin sees all" ON music_suggestions FOR SELECT USING (auth.email() = 'viv.saraiva@gmail.com');
CREATE POLICY "Admin updates" ON music_suggestions FOR UPDATE USING (auth.email() = 'viv.saraiva@gmail.com');
