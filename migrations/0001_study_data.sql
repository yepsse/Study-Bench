CREATE TABLE IF NOT EXISTS study_bench_data (
  id TEXT PRIMARY KEY CHECK (id = 'single-user'),
  progress JSONB NOT NULL DEFAULT '{"lessons":[],"known":[],"tests":[]}'::jsonb,
  spelling_words JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
