-- Yazy Game Database Schema for Supabase

-- Create the games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- 'waiting', 'active', 'completed'
  current_turn UUID, -- Player ID whose turn it is
  players JSONB NOT NULL DEFAULT '[]', -- Array of player objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);

-- Create an index on created_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at);

-- Enable Row Level Security (RLS) for the games table
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated and anonymous users
-- In a production app, you'd want more restrictive policies
CREATE POLICY "Allow all operations on games" ON games
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a function to clean up old games (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_games()
RETURNS void AS $$
BEGIN
    DELETE FROM games 
    WHERE created_at < NOW() - INTERVAL '24 hours'
    AND status IN ('waiting', 'completed');
END;
$$ LANGUAGE plpgsql;

-- You can set up a cron job in Supabase to run this cleanup function periodically
-- SELECT cron.schedule('cleanup-old-games', '0 2 * * *', 'SELECT cleanup_old_games();'); 
