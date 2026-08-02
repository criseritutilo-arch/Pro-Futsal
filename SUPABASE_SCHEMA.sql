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

-- Inserindo os exercícios iniciais
INSERT INTO public.exercises (id, title, category, description, sets, reps, rest, "videoPlaceholder", instructions) VALUES
('e1', 'Agachamento Búlgaro', 'Força Máxima', 'Excelente para corrigir assimetrias, construir força unilateral e melhorar estabilidade.', '3', '8 a 10', '90s', 'https://picsum.photos/seed/bulgarian/800/450', ARRAY['Fique de costas para um banco e apoie o peito do pé de trás nele.', 'Mantenha o tronco reto e desça dobrando o joelho da perna da frente.', 'Desça até que a coxa da perna da frente fique paralela ao chão.', 'Empurre o chão com o calcanhar da perna da frente para voltar à posição inicial.']),
('e2', 'Drop Jump', 'Pliometria', 'Foco na rápida transição entre aterrissagem e salto (RSI), essencial para mudanças de direção rápidas.', '4', '4 a 6', '2 min', 'https://picsum.photos/seed/dropjump/800/450', ARRAY['Fique em cima de uma caixa de 30-40cm.', 'Dê um passo para fora da caixa (não salte para cima).', 'Ao tocar o chão, imediatamente salte o mais alto possível.', 'Aterrisse de forma controlada com os joelhos flexionados.']),
('e3', 'Prancha Abdominal', 'Core', 'Fortalece a musculatura profunda do abdômen, responsável pela estabilização da coluna durante os movimentos.', '3', '45 a 60s', '60s', 'https://picsum.photos/seed/plank/800/450', ARRAY['Apoie os antebraços e os pés no chão.', 'Mantenha o corpo em uma linha reta da cabeça aos calcanhares.', 'Contraia os glúteos e o abdômen.', 'Evite deixar o quadril cair ou levantar muito.']),
('e4', 'Nordic Hamstring Curl', 'Prevenção', 'Previne lesões nos isquiotibiais, comuns em esportes de aceleração.', '3', '5 a 8', '90s', 'https://picsum.photos/seed/nordic/800/450', ARRAY['Ajoelhe-se com alguém segurando seus calcanhares firmemente.', 'Mantenha o corpo alinhado do joelho à cabeça.', 'Desça o tronco em direção ao chão da maneira mais lenta e controlada possível.', 'Use as mãos para amortecer a queda e empurrar de volta para a posição inicial.']),
('e5', 'Levantamento Terra Hex Bar', 'Força Máxima', 'Menos tensão na lombar que a barra reta e ótima transferência de força para velocidade de sprint.', '4', '3 a 5', '2.5 min', 'https://picsum.photos/seed/hexbar/800/450', ARRAY['Fique no centro da barra hexagonal com os pés na largura dos ombros.', 'Agache e segure as alças, mantendo a coluna neutra e peito alto.', 'Estenda o quadril e os joelhos simultaneamente para levantar a carga.', 'Aperte os glúteos no topo do movimento antes de retornar com controle.']),
('e6', 'Ponte de Glúteos Unilateral', 'Prevenção', 'Ativa os glúteos de forma isolada, fundamental para aceleração e proteção da lombar.', '3', '10 a 12 (cada lado)', '60s', 'https://picsum.photos/seed/glutebridge/800/450', ARRAY['Deite de costas, flexione um joelho mantendo o pé no chão, estenda a outra perna no ar.', 'Pressione o calcanhar do pé de apoio e eleve o quadril o mais alto possível.', 'Contraia forte o glúteo da perna de apoio no topo do movimento.', 'Desça controladamente, sem encostar completamente o quadril no chão antes da próxima repetição.'])
ON CONFLICT (id) DO NOTHING;
