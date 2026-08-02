const INITIAL_TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 'p1',
    title: 'Bloco de Pré-temporada (Acumulação)',
    phase: 'Pré-temporada',
    duration: '4 Semanas',
    description: 'Foco no desenvolvimento de força máxima e base pliométrica. Essencial para preparar as estruturas teciduais para a temporada competitiva.',
    days: [
      {
        dayName: 'Dia 1',
        focus: 'Força Máxima & Pliometria Vertical',
        exercises: [
          { exerciseId: 'e2', notes: 'Foco na aterrissagem suave.' },
          { exerciseId: 'e5', notes: 'Carga pesada (80-85% 1RM).' },
          { exerciseId: 'e1', notes: 'Manter estabilidade do joelho.' },
          { exerciseId: 'e4', notes: 'Fase excêntrica controlada.' }
        ]
      },
      {
        dayName: 'Dia 2',
        focus: 'Potência, Core & Prevenção',
        exercises: [
          { exerciseId: 'e3', notes: 'Velocidade na execução.' },
          { exerciseId: 'e6', notes: 'Máxima distância lateral.' },
          { exerciseId: 'e7', notes: 'Travar o abdômen intensamente.' }
        ]
      }
    ]
  },
  {
    id: 'p2',
    title: 'Manutenção Competitiva (In-Season)',
    phase: 'Competitivo',
    duration: 'Contínuo',
    description: 'Volume reduzido e alta intensidade. Focado em manter a potência e força adquiridas, mitigando riscos de lesão sem gerar fadiga para os jogos.',
    days: [
      {
        dayName: 'Dia 1',
        focus: 'Ativação e Potência Pura',
        exercises: [
          { exerciseId: 'e3', notes: 'Baixo volume (3 séries de 3).' },
          { exerciseId: 'e2', notes: 'Saltos sub-máximos.' },
          { exerciseId: 'e7', notes: 'Prevenção.' }
        ]
      }
    ]
  }
];

// --- Components ---

function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'outline' | 'accent', className?: string }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest";
  const variants = {
    default: "bg-zinc-800/50 text-zinc-100",
    outline: "border border-zinc-700 text-zinc-300",
    accent: "bg-lime-400/10 text-lime-400"
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'plans' | 'exercises'>('plans');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
