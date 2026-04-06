-- Subscribers to new album/release notifications via WhatsApp.
-- Users give their WhatsApp number via "Receber novidades" button.
-- Admin sends broadcast manually with the collected numbers.

CREATE TABLE IF NOT EXISTS music_album_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp text NOT NULL,
  name text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  active boolean DEFAULT true,
  UNIQUE(whatsapp)
);

ALTER TABLE music_album_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON music_album_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can manage own"
  ON music_album_subscribers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can read all"
  ON music_album_subscribers FOR SELECT
  USING (auth.email() = 'viv.saraiva@gmail.com');

CREATE POLICY "Users can read own"
  ON music_album_subscribers FOR SELECT
  USING (auth.uid() = user_id);
