const fs = require('fs');

const data = [
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

const escapeCSV = (str) => {
  if (str === null || str === undefined) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const rows = [];
// Supabase columns: id, title, phase, duration, description, days, created_at
rows.push(['id', 'title', 'phase', 'duration', 'description', 'days'].join(','));

for (const plan of data) {
  const row = [
    escapeCSV(plan.id),
    escapeCSV(plan.title),
    escapeCSV(plan.phase),
    escapeCSV(plan.duration),
    escapeCSV(plan.description),
    escapeCSV(JSON.stringify(plan.days))
  ];
  rows.push(row.join(','));
}

fs.writeFileSync('training_plans.csv', rows.join('\n'), 'utf8');
console.log('training_plans.csv generated successfully');
