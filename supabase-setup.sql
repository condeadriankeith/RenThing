-- Create the notes table
CREATE TABLE IF NOT EXISTS notes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL
);

-- Insert some sample data into the table
INSERT INTO notes (title) VALUES
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "public can read notes"
ON public.notes
FOR SELECT TO anon
USING (true);
