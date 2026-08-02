-- Tabela de exercícios
CREATE TABLE IF NOT EXISTS public.exercises (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  sets text NOT NULL,
  reps text NOT NULL,
  rest text NOT NULL,
  "videoPlaceholder" text NOT NULL,
  instructions text[] NOT NULL,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Permissões para a tabela de exercícios
GRANT ALL ON TABLE public.exercises TO anon;
GRANT ALL ON TABLE public.exercises TO authenticated;
GRANT ALL ON TABLE public.exercises TO service_role;

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on exercises" ON public.exercises;
CREATE POLICY "Allow public read access on exercises" ON public.exercises FOR SELECT USING (true);


-- Tabela para salvar os planos de treino
CREATE TABLE IF NOT EXISTS public.training_plans (
  id text PRIMARY KEY,
  title text NOT NULL,
  phase text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  days jsonb NOT NULL,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Permissões para a tabela de planos
GRANT ALL ON TABLE public.training_plans TO anon;
GRANT ALL ON TABLE public.training_plans TO authenticated;
GRANT ALL ON TABLE public.training_plans TO service_role;

ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on training_plans" ON public.training_plans;
CREATE POLICY "Allow public read access on training_plans" ON public.training_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access on training_plans" ON public.training_plans;
CREATE POLICY "Allow public insert access on training_plans" ON public.training_plans FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on training_plans" ON public.training_plans;
CREATE POLICY "Allow public update access on training_plans" ON public.training_plans FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access on training_plans" ON public.training_plans;
CREATE POLICY "Allow public delete access on training_plans" ON public.training_plans FOR DELETE USING (true);
