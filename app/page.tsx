'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  Dumbbell,
  Calendar,
  PlayCircle,
  ArrowLeft,
  Clock,
  Repeat,
  ShieldAlert,
  Zap,
  ChevronRight, ChevronUp, ChevronDown, GripVertical,
  Activity,
  Move,
  Wand2,
  Loader2,
  X,
  Trash2,
  Edit3,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- Types ---
type Category = 'Força Máxima' | 'Força' | 'Potência' | 'Pliometria' | 'Core' | 'Prevenção' | 'Mobilidade' | 'Aquecimento';

type Exercise = {
  id: string;
  title: string;
  category: Category;
  description: string;
  instructions: string[];
  sets?: string;
  reps?: string;
  rest?: string;
  load?: string;
  duration?: string;
  videoPlaceholder: string;
  videoUrl?: string;
};

type WorkoutDay = {
  dayName: string;
  focus: string;
  exercises: {
    exerciseId: string;
    notes?: string;
    sets?: string;
    reps?: string;
    rest?: string;
    load?: string;
    duration?: string;
    weeklyParams?: {
      sets: string;
      reps: string;
      load: string;
    }[];
  }[];
};

type TrainingPlan = {
  id: string;
  title: string;
  phase: 'Pré-temporada' | 'Competitivo' | 'Transição';
  duration: string;
  description: string;
  days: WorkoutDay[];
};

// --- Data ---
const EXERCISES: Exercise[] = [
  {
    id: 'e1',
    title: 'Agachamento Búlgaro com Halteres',
    category: 'Força Máxima',
    description: 'Excelente para força unilateral e estabilidade do joelho e quadril, fundamentais para a mudança de direção no futsal.',
    instructions: [
      'Posicione um pé no banco atrás de você.',
      'Segure um haltere em cada mão com os braços estendidos.',
      'Desça o quadril até que a coxa da frente fique paralela ao chão.',
      'Empurre o chão com o pé da frente para retornar à posição inicial.'
    ],
    sets: '3 a 4',
    reps: '6 a 8 (cada perna)',
    rest: '90 a 120s',
    videoPlaceholder: 'https://img.youtube.com/vi/2C-uNgKwPLE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE'
  },
  {
    id: 'e2',
    title: 'Salto na Caixa (Box Jump)',
    category: 'Pliometria',
    description: 'Desenvolve potência explosiva concêntrica, simulando o arranque de sprints curtos.',
    instructions: [
      'Posicione-se de frente para uma caixa pliométrica (45-60cm).',
      'Faça um balanço com os braços e desça o quadril rapidamente.',
      'Salte de forma explosiva, aterrissando suavemente sobre a caixa.',
      'Desça da caixa um pé de cada vez (não pule de costas).'
    ],
    sets: '4',
    reps: '4 a 5',
    rest: '2 a 3 min',
    videoPlaceholder: 'https://img.youtube.com/vi/52r_Ul5k03g/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=52r_Ul5k03g'
  },
  {
    id: 'e3',
    title: 'Puxada de Arranco (Snatch Pull)',
    category: 'Potência',
    description: 'Exercício derivado de LPO para maximizar a tripla extensão (tornozelo, joelho e quadril).',
    instructions: [
      'Posicione os pés na largura dos ombros com pegada aberta na barra.',
      'Inicie a puxada do chão, mantendo a barra próxima ao corpo.',
      'Ao passar dos joelhos, estenda explosivamente o quadril e fique nas pontas dos pés.',
      'Encolha os ombros no final do movimento, sem flexionar os cotovelos.'
    ],
    sets: '4',
    reps: '3 a 5',
    rest: '3 min',
    videoPlaceholder: 'https://img.youtube.com/vi/TIZ0JZDSqYM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=TIZ0JZDSqYM'
  },
  {
    id: 'e4',
    title: 'Flexão Nórdica',
    category: 'Prevenção',
    description: 'Essencial para a prevenção de lesões nos isquiotibiais, muito comuns devido às frenagens bruscas.',
    instructions: [
      'Ajoelhe-se em uma superfície macia com alguém (ou um equipamento) segurando seus calcanhares.',
      'Mantenha o corpo alinhado do joelho aos ombros.',
      'Deixe-se cair para a frente de forma controlada o mais lento possível.',
      'Use as mãos para amortecer a queda ao final e empurre-se de volta ao início.'
    ],
    sets: '3',
    reps: '5 a 6',
    rest: '90s',
    videoPlaceholder: 'https://img.youtube.com/vi/6-whtNg0lKg/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6-whtNg0lKg'
  },
  {
    id: 'e5',
    title: 'Levantamento Terra com Trap Bar',
    category: 'Força Máxima',
    description: 'Constrói força geral nas pernas e core com menor tensão na lombar que a barra reta.',
    instructions: [
      'Fique dentro da barra hexagonal.',
      'Desça o quadril e segure as alças, mantendo a coluna neutra e o peito estufado.',
      'Empurre o chão com os pés para levantar o peso.',
      'Estenda o quadril completamente no topo e retorne com controle.'
    ],
    sets: '4',
    reps: '4 a 6',
    rest: '3 min',
    videoPlaceholder: 'https://img.youtube.com/vi/6h60HP97Ssc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6h60HP97Ssc'
  },
  {
    id: 'e6',
    title: 'Skater Jumps (Saltos Laterais)',
    category: 'Pliometria',
    description: 'Trabalha potência no plano frontal, replicando movimentos defensivos e mudanças de direção laterais.',
    instructions: [
      'Inicie apoiado em uma perna só, com o joelho ligeiramente flexionado.',
      'Salte lateralmente para a outra perna de forma explosiva.',
      'Aterrisse estabilizando o corpo rapidamente.',
      'Imediatamente repita o salto de volta para a perna inicial.'
    ],
    sets: '3',
    reps: '6 a 8 (cada lado)',
    rest: '90s',
    videoPlaceholder: 'https://img.youtube.com/vi/qM5jviFhw9U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=qM5jviFhw9U'
  },
  {
    id: 'e7',
    title: 'Pallof Press Dinâmico',
    category: 'Core',
    description: 'Treinamento anti-rotacional do core, vital para estabilizar o tronco durante chutes e disputas de bola.',
    instructions: [
      'Prenda um elástico ou cabo na altura do peito, ao lado do corpo.',
      'Segure a alça com ambas as mãos no centro do peito.',
      'Empurre os braços para frente, resistindo à tração que tenta rodar seu tronco.',
      'Retorne ao centro de forma controlada.'
    ],
    sets: '3',
    reps: '10 a 12 (cada lado)',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/5aZ0IhJS8O8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=5aZ0IhJS8O8'
  },
  {
    id: 'e8',
    title: 'Mobilidade de Tornozelo na Parede',
    category: 'Mobilidade',
    description: 'Melhora a dorsiflexão do tornozelo, crucial para agachamentos profundos e prevenção de lesões na aterrissagem.',
    instructions: [
      'Fique de frente para uma parede com um pé à frente do outro.',
      'Mantenha o calcanhar da frente no chão.',
      'Dobre o joelho da frente tentando encostar na parede.',
      'Retorne à posição inicial.'
    ],
    sets: '2',
    reps: '10 (cada perna)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/qh7KaN8FRZk/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=qh7KaN8FRZk'
  },
  {
    id: 'e9',
    title: 'Rotação 90/90 de Quadril',
    category: 'Mobilidade',
    description: 'Aumenta a amplitude de rotação interna e externa do quadril, fundamental para a mudança rápida de direção.',
    instructions: [
      'Sente-se no chão com ambas as pernas flexionadas a 90 graus, uma à frente e outra ao lado.',
      'Mantenha o tronco ereto e o peito aberto.',
      'Gire o tronco em direção à perna da frente e desça levemente.',
      'Troque o lado das pernas girando sobre os calcanhares.'
    ],
    sets: '2',
    reps: '60s (cada lado)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/m51AZSXMvEA/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=m51AZSXMvEA'
  },
  {
    id: 'e10',
    title: 'Rotação Torácica em 4 Apoios',
    category: 'Mobilidade',
    description: 'Libera a coluna torácica para permitir melhor rotação do tronco, essencial para passes e chutes.',
    instructions: [
      'Fique na posição de 4 apoios (mãos e joelhos no chão).',
      'Coloque uma mão atrás da cabeça.',
      'Gire o cotovelo dobrado em direção ao braço de apoio.',
      'Abra o peito e aponte o cotovelo para o teto, seguindo com o olhar.'
    ],
    sets: '2',
    reps: '8 (cada lado)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/1NCcTlR17rs/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=1NCcTlR17rs'
  },
  {
    id: 'e11',
    title: 'Mobilidade Ativa de Isquiotibiais',
    category: 'Mobilidade',
    description: 'Alongamento dinâmico para os isquiotibiais, preparando a musculatura para sprints e estiramentos.',
    instructions: [
      'Deite-se de costas com uma perna estendida no chão.',
      'Levante a outra perna o mais alto possível, mantendo-a reta.',
      'Segure levemente atrás do joelho ou panturrilha e puxe suavemente.',
      'Retorne a perna ao chão de forma controlada.'
    ],
    sets: '2',
    reps: '10 (cada perna)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/XqsyxTXpei0/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=XqsyxTXpei0'
  },
  {
    id: 'e12',
    title: 'Mobilidade de Adutores (Rockback)',
    category: 'Mobilidade',
    description: 'Aumenta a flexibilidade na parte interna das coxas, permitindo passadas mais largas e laterais mais eficientes.',
    instructions: [
      'Fique em 4 apoios e estenda uma perna lateralmente com o pé inteiro no chão.',
      'Mantenha a coluna neutra.',
      'Empurre o quadril para trás, em direção ao calcanhar da perna dobrada.',
      'Retorne à posição inicial e sinta o alongamento na perna estendida.'
    ],
    sets: '2',
    reps: '8 (cada lado)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/FkxBaLFrlSE/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=FkxBaLFrlSE'
  },
  {
    id: 'e13',
    title: 'Alongamento de Flexores do Quadril',
    category: 'Mobilidade',
    description: 'Previne o encurtamento dos flexores do quadril e melhora a extensão do quadril durante a corrida.',
    instructions: [
      'Fique na posição de afundo com um joelho no chão (use um colchonete).',
      'Mantenha o tronco reto e contraia o glúteo da perna de trás.',
      'Desloque o peso levemente para frente até sentir o alongamento na parte frontal do quadril.',
      'Evite arquear excessivamente a lombar.'
    ],
    sets: '2',
    reps: '45s (cada lado)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/LkEC8QO0ITk/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=LkEC8QO0ITk'
  },
  {
    id: 'e14',
    title: 'Dead Bug',
    category: 'Core',
    description: 'Trabalha a estabilidade do core anterior, essencial para manter a postura durante corridas e chutes.',
    instructions: [
      'Deite-se de costas, eleve os braços para o teto e dobre os joelhos a 90 graus.',
      'Abaixe lentamente um braço para trás da cabeça e, ao mesmo tempo, estenda a perna oposta para perto do chão.',
      'Mantenha a lombar pressionada contra o chão.',
      'Retorne à posição inicial e repita do outro lado.'
    ],
    sets: '3',
    reps: '10 a 12 (cada lado)',
    rest: '45s',
    videoPlaceholder: 'https://img.youtube.com/vi/4XLEnwUr1d8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8'
  },
  {
    id: 'e15',
    title: 'Bird Dog',
    category: 'Core',
    description: 'Foco na estabilidade lombar e pélvica durante movimentos recíprocos de braços e pernas.',
    instructions: [
      'Fique em 4 apoios, mantendo as costas retas e o core ativado.',
      'Estenda lentamente o braço direito para frente e a perna esquerda para trás.',
      'Mantenha a posição por 1 segundo sem deixar o quadril rodar.',
      'Retorne à posição inicial e troque de lado.'
    ],
    sets: '3',
    reps: '10 (cada lado)',
    rest: '45s',
    videoPlaceholder: 'https://img.youtube.com/vi/QABW99qPiNM/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=QABW99qPiNM'
  },
  {
    id: 'e16',
    title: 'Prancha',
    category: 'Core',
    description: 'Exercício isométrico fundamental para resistência do core e transmissão de força.',
    instructions: [
      'Apoie os antebraços no chão, alinhados com os ombros.',
      'Estenda as pernas e apoie-se nas pontas dos pés.',
      'Mantenha o corpo em uma linha reta desde a cabeça até os calcanhares.',
      'Contraia abdômen e glúteos intensamente.'
    ],
    sets: '3',
    reps: '45 a 60s',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/pSHjTRCQxIw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
  },
  {
    id: 'e17',
    title: 'Prancha Lateral',
    category: 'Core',
    description: 'Isometria que fortalece os oblíquos, importantes para a estabilidade lateral e proteção da coluna.',
    instructions: [
      'Deite-se de lado, apoiando-se no antebraço que deve estar alinhado com o ombro.',
      'Empilhe um pé sobre o outro.',
      'Eleve o quadril até o corpo formar uma linha reta.',
      'Mantenha a posição sem deixar o quadril cair.'
    ],
    sets: '3',
    reps: '30 a 45s (cada lado)',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/NXr4Fw8q60o/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=NXr4Fw8q60o'
  },
  {
    id: 'e18',
    title: 'Farmer Walk',
    category: 'Core',
    description: 'Treino de transporte de carga que desenvolve a estabilidade global, pegada e força central sob carga.',
    instructions: [
      'Segure um halter pesado ou kettlebell em cada mão.',
      'Mantenha a postura reta, ombros para trás e o peito estufado.',
      'Caminhe de forma controlada por uma distância determinada.',
      'Mantenha os passos curtos e rápidos, evitando o balanço lateral do tronco.'
    ],
    sets: '4',
    reps: '20 a 30 metros',
    rest: '90s',
    videoPlaceholder: 'https://img.youtube.com/vi/NH7Xv-7NQNQ/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=NH7Xv-7NQNQ'
  },
  {
    id: 'e19',
    title: 'Copenhagen Adduction',
    category: 'Prevenção',
    description: 'Exige alta estabilidade dos adutores e musculatura do quadril, essencial na prevenção de pubalgia.',
    instructions: [
      'Deite-se de lado e coloque o pé de cima em um banco ou caixa.',
      'O antebraço fica no chão para suporte, alinhado com o ombro.',
      'Eleve o quadril do chão, puxando a perna de baixo em direção ao banco.',
      'Desça o quadril lentamente com controle.'
    ],
    sets: '3',
    reps: '6 a 8 (cada lado)',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/lBIcQzr-cQs/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=lBIcQzr-cQs'
  },
  {
    id: 'e20',
    title: 'Tibial Raise',
    category: 'Prevenção',
    description: 'Fortalece o músculo tibial anterior, ajudando a prevenir canelite e melhorando a desaceleração.',
    instructions: [
      'Encoste as costas em uma parede, com os pés um pouco à frente.',
      'Mantenha as pernas estendidas e levante as pontas dos pés do chão o máximo que puder.',
      'Apoie o peso nos calcanhares.',
      'Desça os pés controladamente de volta ao chão.'
    ],
    sets: '3',
    reps: '15 a 20',
    rest: '45s',
    videoPlaceholder: 'https://img.youtube.com/vi/HNa-n4xq8ro/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=HNa-n4xq8ro'
  },
  {
    id: 'e21',
    title: 'Panturrilha Unilateral',
    category: 'Prevenção',
    description: 'Desenvolve a musculatura da panturrilha e tendão de Aquiles para saltos e sprints curtos.',
    instructions: [
      'Fique de pé em um degrau ou bloco, apoiando apenas a ponta de um dos pés.',
      'A outra perna fica suspensa e você pode se apoiar levemente para equilíbrio.',
      'Desça o calcanhar o máximo possível sentindo o alongamento.',
      'Empurre o corpo para cima até a extensão máxima da panturrilha.'
    ],
    sets: '3',
    reps: '10 a 12 (cada perna)',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/xUoJNbNvWPo/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=xUoJNbNvWPo'
  },
  {
    id: 'e22',
    title: 'Flexão Plantar Excêntrica',
    category: 'Prevenção',
    description: 'Exercício chave para a reabilitação e prevenção de tendinopatias no tendão de Aquiles.',
    instructions: [
      'Suba na ponta dos pés (com as duas pernas).',
      'Tire uma perna do chão, deixando todo o peso em uma só.',
      'Desça muito lentamente usando apenas a perna de apoio (fase excêntrica).',
      'Use as duas pernas para subir novamente.'
    ],
    sets: '3',
    reps: '10 a 15 (cada perna)',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/tijQ8IOl47Q/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=tijQ8IOl47Q'
  },
  {
    id: 'e23',
    title: 'Rotadores do Quadril com Miniband',
    category: 'Prevenção',
    description: 'Ativação do glúteo médio e rotadores, músculos que estabilizam o joelho durante as passadas.',
    instructions: [
      'Coloque uma miniband logo acima dos joelhos.',
      'Fique em posição de meio agachamento atlético.',
      'Mantendo um pé fixo, abra o outro joelho lateralmente (rotação externa).',
      'Retorne com controle e evite que o tronco gire.'
    ],
    sets: '3',
    reps: '15 (cada lado)',
    rest: '45s',
    videoPlaceholder: 'https://img.youtube.com/vi/zDA3e3oYIg4/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=zDA3e3oYIg4'
  },
  {
    id: 'e24',
    title: 'Equilíbrio Unipodal',
    category: 'Prevenção',
    description: 'Melhora a propriocepção e a força estabilizadora de todo o membro inferior.',
    instructions: [
      'Fique de pé sobre uma perna, mantendo o joelho de apoio levemente flexionado.',
      'Tente manter o equilíbrio sem tocar o outro pé no chão.',
      'Para dificultar, você pode fechar os olhos ou ficar sobre uma superfície instável.',
      'Mantenha o core firme.'
    ],
    sets: '3',
    reps: '30 a 60s (cada perna)',
    rest: '45s',
    videoPlaceholder: 'https://img.youtube.com/vi/UwkWjWq_pMw/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=UwkWjWq_pMw'
  },
  {
    id: 'e25',
    title: 'Jump Squat',
    category: 'Potência',
    description: 'Desenvolve a potência explosiva dos membros inferiores a partir de um agachamento tradicional.',
    instructions: [
      'Fique de pé com os pés na largura dos ombros.',
      'Desça em um agachamento (até as coxas ficarem quase paralelas).',
      'Sem pausas, salte o mais alto possível explosivamente.',
      'Aterrisse suavemente, absorvendo o impacto dobrando novamente os joelhos.'
    ],
    sets: '4',
    reps: '5 a 6',
    rest: '90s',
    videoPlaceholder: 'https://img.youtube.com/vi/BRfxI2Es2lE/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=BRfxI2Es2lE'
  },
  {
    id: 'e26',
    title: 'Hang Power Clean',
    category: 'Potência',
    description: 'Exercício olímpico focado em força e velocidade, ideal para a explosão inicial em lances rápidos.',
    instructions: [
      'Segure a barra com pegada pronada na largura dos ombros.',
      'Inicie a partir da posição de pendência (barra acima dos joelhos).',
      'Estenda explosivamente o quadril, joelhos e tornozelos.',
      'Puxe a barra para cima, rodando os cotovelos sob ela para recebê-la nos ombros (posição de rack).'
    ],
    sets: '4',
    reps: '3 a 5',
    rest: '2 min',
    videoPlaceholder: 'https://img.youtube.com/vi/E2z5zK5V-MM/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=E2z5zK5V-MM'
  },
  {
    id: 'e27',
    title: 'Lunge Explosivo',
    category: 'Potência',
    description: 'Foca na potência unilateral e rápida troca de apoios, muito utilizado na aceleração em campo.',
    instructions: [
      'Comece na posição de afundo (lunge).',
      'Desça o quadril rapidamente e salte explosivamente para cima.',
      'No ar, troque a posição das pernas (tesoura).',
      'Aterrisse suavemente na posição de afundo oposta e repita.'
    ],
    sets: '3',
    reps: '6 a 8 (cada lado)',
    rest: '90s',
    videoPlaceholder: 'https://img.youtube.com/vi/wrwwXE_x-pQ/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=wrwwXE_x-pQ'
  },
  {
    id: 'e28',
    title: 'Medicine Ball Slam',
    category: 'Potência',
    description: 'Exercício de corpo inteiro que desenvolve potência na cadeia anterior do tronco e braços.',
    instructions: [
      'Segure uma medicine ball (não quicável) com as duas mãos.',
      'Levante a bola acima da cabeça estendendo todo o corpo.',
      'Jogue a bola com a máxima força em direção ao chão, flexionando o tronco e quadril.',
      'Pegue a bola e repita sem perder a cadência.'
    ],
    sets: '4',
    reps: '8 a 10',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/QxYhFwMd1Ks/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=QxYhFwMd1Ks'
  },
  {
    id: 'e29',
    title: 'Medicine Ball Rotacional',
    category: 'Potência',
    description: 'Treina a transferência de potência das pernas e quadril para o tronco, excelente para chutes.',
    instructions: [
      'Fique de lado a cerca de um metro de uma parede forte.',
      'Segure a medicine ball com as duas mãos na altura da cintura.',
      'Gire o tronco e jogue a bola explosivamente contra a parede.',
      'Apanhe-a no rebote e repita rapidamente o movimento.'
    ],
    sets: '3',
    reps: '8 (cada lado)',
    rest: '60s',
    videoPlaceholder: 'https://img.youtube.com/vi/aDiIm8_9M_A/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=aDiIm8_9M_A'
  },
  {
    id: 'e30',
    title: 'Sprint com Trenó',
    category: 'Potência',
    description: 'Trabalho de aceleração resistida, ideal para gerar os primeiros passos rápidos na quadra.',
    instructions: [
      'Prenda-se ao cinturão do trenó.',
      'Posicione o corpo inclinado para a frente com a mecânica correta de aceleração.',
      'Arranque de forma explosiva, empurrando o chão com força para trás.',
      'Corra a distância estipulada e recupere totalmente.'
    ],
    sets: '5',
    reps: '15 a 20 metros',
    rest: '2 min',
    videoPlaceholder: 'https://img.youtube.com/vi/RjUyqQYsTHg/hqdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=RjUyqQYsTHg'
  },
  {
    id: 'e31',
    title: 'Back Squat',
    category: 'Força Máxima',
    description: 'Agachamento com barra nas costas, o exercício base para ganho geral de força nos membros inferiores.',
    instructions: [
      'Apoie a barra nos trapézios e segure firme.',
      'Fique com os pés ligeiramente mais largos que os ombros.',
      'Desça o quadril para trás e para baixo até quebrar o paralelo (ou no limite da mobilidade).',
      'Empurre de volta à posição inicial estendendo quadril e joelhos.'
    ],
    sets: '4',
    reps: '4 a 6',
    rest: '3 min',
    videoPlaceholder: 'https://img.youtube.com/vi/bEv6CCg2BC8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8'
  },
  {
    id: 'e32',
    title: 'Hip Thrust',
    category: 'Força Máxima',
    description: 'Focado principalmente na força de extensão do quadril, essencial para piques e saltos.',
    instructions: [
      'Apoie a parte superior das costas em um banco e coloque uma barra sobre o quadril.',
      'Os pés devem ficar no chão afastados na largura dos ombros.',
      'Desça o quadril e, em seguida, empurre a barra para cima estendendo o quadril explosivamente.',
      'Contraia os glúteos no topo do movimento.'
    ],
    sets: '4',
    reps: '6 a 8',
    rest: '2 a 3 min',
    videoPlaceholder: 'https://img.youtube.com/vi/SEdqd1n0cvg/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg'
  },
  {
    id: 'e33',
    title: 'Bicicleta',
    category: 'Aquecimento',
    description: 'Aquecimento cardiovascular geral, aumenta a temperatura corporal e o fluxo sanguíneo.',
    instructions: [
      'Ajuste o banco da bicicleta na altura do osso do quadril.',
      'Inicie com um ritmo leve (zona 1-2).',
      'Mantenha a cadência contínua.'
    ],
    sets: '1',
    reps: '5 a 10 min',
    rest: '-',
    videoPlaceholder: 'https://img.youtube.com/vi/t2q8cv9OqKw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=t2q8cv9OqKw'
  },
  {
    id: 'e34',
    title: 'Mobilidade de Quadril',
    category: 'Aquecimento',
    description: 'Solta a articulação do quadril, melhorando a amplitude de movimento.',
    instructions: [
      'Realize rotações internas e externas com o quadril.',
      'Faça movimentos controlados explorando a amplitude sem dor.'
    ],
    sets: '2',
    reps: '10 (cada lado)',
    rest: 'Sem pausa',
    videoPlaceholder: 'https://img.youtube.com/vi/WUKHM6-ekJM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=WUKHM6-ekJM'
  },
  {
    id: 'e35',
    title: 'Caminhada Lateral com Mini Band',
    category: 'Aquecimento',
    description: 'Ativação de glúteo médio, essencial para estabilidade e mudança de direção.',
    instructions: [
      'Coloque a mini band acima dos joelhos ou tornozelos.',
      'Assuma uma leve posição de agachamento.',
      'Dê passos laterais mantendo a tensão na band.',
      'Não deixe os joelhos cederem para dentro.'
    ],
    sets: '2 a 3',
    reps: '15 passos (cada lado)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/6eoK_yxY8Ak/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6eoK_yxY8Ak'
  },
  {
    id: 'e36',
    title: 'Monster Walk',
    category: 'Aquecimento',
    description: 'Ativa glúteos e abdutores de forma dinâmica no plano sagital.',
    instructions: [
      'Com a mini band nos joelhos ou tornozelos, desça em meio agachamento.',
      'Dê passos largos para frente em diagonal (como um monstro).',
      'Faça o mesmo caminho de volta (andando para trás em diagonal).'
    ],
    sets: '2 a 3',
    reps: '10 passos (frente e trás)',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/snbNxUIUQPc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=snbNxUIUQPc'
  },
  {
    id: 'e37',
    title: 'Ponte de Glúteo',
    category: 'Aquecimento',
    description: 'Ativa a extensão do quadril e a musculatura dos glúteos.',
    instructions: [
      'Deite-se de costas com os joelhos dobrados e pés no chão.',
      'Pressione os calcanhares e eleve o quadril em direção ao teto.',
      'Contraia os glúteos no topo e não arqueie excessivamente a lombar.',
      'Desça de forma controlada.'
    ],
    sets: '2',
    reps: '15',
    rest: '30s',
    videoPlaceholder: 'https://img.youtube.com/vi/8bbE64NuDTU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=8bbE64NuDTU'
  },
  {
    id: 'e38',
    title: 'Bulgarian Split Squat',
    category: 'Força',
    description: 'Agachamento unilateral excelente para desenvolvimento de força e hipertrofia nas pernas.',
    instructions: [
      'Posicione um pé apoiado em um banco atrás de você.',
      'O pé da frente deve estar plantado firme no chão.',
      'Agache dobrando o joelho da frente até que a coxa fique paralela.',
      'Mantenha o tronco levemente inclinado para frente para focar nos glúteos ou reto para os quadríceps.'
    ],
    sets: '3 a 4',
    reps: '8 a 12 (cada perna)',
    rest: '90s a 120s',
    videoPlaceholder: 'https://img.youtube.com/vi/2C-uNgKwPLE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE'
  },
  {
    id: 'e39',
    title: 'Nordic Hamstring',
    category: 'Força',
    description: 'Exercício excêntrico focado nos isquiotibiais, fundamental na prevenção de lesões.',
    instructions: [
      'Ajoelhe-se e peça a um parceiro para segurar seus calcanhares (ou prenda-os firmemente).',
      'Mantenha o corpo em linha reta dos joelhos até os ombros.',
      'Desça o tronco à frente o mais devagar possível resistindo à queda.',
      'Use as mãos para amortecer a queda no final e empurre o chão para voltar.'
    ],
    sets: '3',
    reps: '5 a 8',
    rest: '120s',
    videoPlaceholder: 'https://img.youtube.com/vi/3-4pKUhkzoQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3-4pKUhkzoQ'
  },
  {
    id: 'e40',
    title: 'Skipping',
    category: 'Aquecimento',
    description: 'Exercício de técnica de corrida e aquecimento focado na elevação dos joelhos.',
    instructions: [
      'Mantenha o tronco reto.',
      'Eleve os joelhos alternadamente até a altura do quadril.',
      'Apoie-se na ponta dos pés e coordene os braços.'
    ],
    sets: '2',
    reps: '15 metros',
    rest: '30s',
    duration: '15s',
    videoPlaceholder: 'https://img.youtube.com/vi/m9MccH7mWO0/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=m9MccH7mWO0'
  },
  {
    id: 'e41',
    title: 'Carioca',
    category: 'Aquecimento',
    description: 'Movimento lateral cruzado para aquecimento e agilidade, excelente para a mobilidade do quadril.',
    instructions: [
      'Mova-se lateralmente cruzando a perna de trás pela frente e depois por trás.',
      'Gire os quadris durante o movimento.',
      'Mantenha os braços elevados e os ombros apontando para a frente.'
    ],
    sets: '2',
    reps: '15 metros (cada lado)',
    rest: '30s',
    duration: '20s',
    videoPlaceholder: 'https://img.youtube.com/vi/VFYfR5hH-dg/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VFYfR5hH-dg'
  },
  {
    id: 'e42',
    title: 'Saltos Laterais',
    category: 'Aquecimento',
    description: 'Saltos laterais contínuos para ativação rápida e propriocepção dos tornozelos.',
    instructions: [
      'Salte lateralmente sobre uma linha imaginária com os dois pés juntos.',
      'Minimize o tempo de contato com o chão.',
      'Mantenha o core contraído.'
    ],
    sets: '2',
    reps: '20 saltos',
    rest: '30s',
    duration: '20s',
    videoPlaceholder: 'https://img.youtube.com/vi/wPZP8Bwxplo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=wPZP8Bwxplo'
  },
  {
    id: 'e43',
    title: 'Corrida Leve',
    category: 'Aquecimento',
    description: 'Corrida leve para elevação da temperatura corporal e ativação cardiovascular.',
    instructions: [
      'Mantenha um ritmo confortável.',
      'Concentre-se na respiração e na soltura do corpo.'
    ],
    duration: '5 a 10 min',
    videoPlaceholder: 'https://img.youtube.com/vi/3PqzgxkgwAs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3PqzgxkgwAs'
  },
  {
    id: 'e44',
    title: 'Copenhagen Plank',
    category: 'Prevenção',
    description: 'Exercício isométrico focado no fortalecimento dos adutores e estabilidade do core, excelente para prevenir lesões na virilha.',
    instructions: [
      'Apoie o pé ou a canela da perna de cima em um banco ou caixa.',
      'Eleve o quadril, mantendo o corpo em uma linha reta.',
      'Mantenha a posição estabilizada, contraindo os adutores.'
    ],
    sets: '3',
    duration: '20 a 30s (cada lado)',
    rest: '45s',
    videoPlaceholder: 'https://img.youtube.com/vi/5Hs7AfiMXgs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=5Hs7AfiMXgs'
  }
];

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
  
  const [plans, setPlans] = useState<TrainingPlan[]>(INITIAL_TRAINING_PLANS);
  const [exercises, setExercises] = useState<Exercise[]>(EXERCISES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      let loadedFromSupabase = false;
      if (supabase) {
        try {
          const { data, error } = await supabase.from('training_plans').select('*');
          if (!error && data && data.length > 0) {
            // Sort by created_at descending if needed, or assume they are correct
            setPlans(data);
            loadedFromSupabase = true;
          }
        } catch (e) {
          console.error("Supabase plans fetch error", e);
        }
      }

      if (!loadedFromSupabase) {
        const savedPlans = localStorage.getItem('futsal_training_plans');
        if (savedPlans) {
          try {
            setPlans(JSON.parse(savedPlans));
          } catch (e) {
            console.error('Failed to parse plans from local storage', e);
          }
        }
      }
      setIsLoaded(true);
    }
    
    loadPlans();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('futsal_training_plans', JSON.stringify(plans));
      
      const saveToSupabase = async () => {
        if (!supabase) return;
        try {
          if (plans.length > 0) {
            await supabase.from('training_plans').upsert(plans);
          }
        } catch (e) {
          console.error("Failed to sync plans to Supabase", e);
        }
      };
      
      saveToSupabase();
    }
  }, [plans, isLoaded]);
  
  // AI Form State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPhase, setAiPhase] = useState<'Pré-temporada' | 'Competitivo' | 'Transição'>('Pré-temporada');
  const [aiWeeks, setAiWeeks] = useState(4);
  const [aiDaysPerWeek, setAiDaysPerWeek] = useState(5);
  const [aiDaysFocus, setAiDaysFocus] = useState<string[][]>(Array(5).fill(['Misto']));
  const [isGenerating, setIsGenerating] = useState(false);
  
  const DEFAULT_FOCUS_OPTIONS = ['Misto', 'Força Máxima', 'Força', 'Potência', 'Pliometria', 'Recuperação', 'Alongamento', 'Aquecimento', 'Core', 'Mobilidade', 'Prevenção'];

  const handleDaysPerWeekChange = (days: number) => {
    setAiDaysPerWeek(days);
    setAiDaysFocus(prev => {
      const newFocus = [...prev];
      while (newFocus.length < days) newFocus.push(['Misto']);
      return newFocus.slice(0, days);
    });
  };


  // Edit Plan State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlanData, setEditPlanData] = useState<{ id: string, title: string, description: string }>({ id: '', title: '', description: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add Exercise State
  const [addExerciseDayIndex, setAddExerciseDayIndex] = useState<number | null>(null);
  const [addExerciseSearch, setAddExerciseSearch] = useState('');

  // Edit Exercise Params State
  const [editExerciseParams, setEditExerciseParams] = useState<{
    dayIndex: number;
    exerciseIndex: number;
    sets?: string;
    reps?: string;
    rest?: string;
    load: string;
    duration: string;
    notes: string;
    weeklyParams?: { sets: string; reps: string; load: string }[];
  } | null>(null);

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<{ dayIndex: number; exerciseIndex: number } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ dayIndex: number; exerciseIndex: number } | null>(null);

  // Video State
  const [playingVideo, setPlayingVideo] = useState<boolean>(false);

  useEffect(() => {
    async function fetchExercises() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('exercises').select('*');
        if (error) {
          // Silently fallback to local EXERCISES if Supabase fails (e.g. not configured yet)
          console.log("Supabase not configured or failed to fetch, using local exercises data.");
        } else if (data && data.length > 0) {
          const mergedData = data.map(dbExercise => {
            const localEx = EXERCISES.find(e => e.id === dbExercise.id);
            return {
              ...dbExercise,
              videoUrl: dbExercise.videoUrl || localEx?.videoUrl
            };
          });
          setExercises(mergedData);
        }
      } catch (err) {
        console.log("Unexpected error fetching exercises, using local data.");
      }
    }
    fetchExercises();
  }, []);

  // Derived state
  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const selectedExercise = exercises.find(e => e.id === selectedExerciseId);

  // Handlers
  const handleBackToMain = () => {
    setSelectedPlanId(null);
    setSelectedExerciseId(null);
    setPlayingVideo(false);
  };

  const handleExerciseSelect = (id: string) => {
    setSelectedExerciseId(id);
    setPlayingVideo(false);
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const exercisesContext = exercises.map(ex => `${ex.id} - ${ex.title} (${ex.category})`).join('\\n');

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: aiPhase,
          weeks: aiWeeks,
          daysPerWeek: aiDaysPerWeek,
          daysFocus: aiDaysFocus,
          exercisesContext
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate');
      }
      
      const newPlanData = await res.json();
      
      const newPlan: TrainingPlan = {
        ...newPlanData,
        id: `p_ai_${Date.now()}`,
        phase: aiPhase,
        duration: `${aiWeeks} Semanas`
      };

      setPlans(prev => [newPlan, ...prev]);
      setShowAiModal(false);
      setSelectedPlanId(newPlan.id);
    } catch (err: any) {
      console.warn(err);
      alert(err.message || 'Erro ao gerar plano de treino.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent, plan: TrainingPlan) => {
    e.stopPropagation();
    setEditPlanData({ id: plan.id, title: plan.title, description: plan.description });
    setShowEditModal(true);
  };

  const handleDeletePlan = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      setPlans(prev => prev.filter(p => p.id !== deleteConfirmId));
      if (selectedPlanId === deleteConfirmId) {
        setSelectedPlanId(null);
      }
      
      if (supabase) {
        try {
          await supabase.from('training_plans').delete().eq('id', deleteConfirmId);
        } catch (e) {
          console.error("Failed to delete plan from Supabase", e);
        }
      }
      
      setDeleteConfirmId(null);
    }
  };

  const handleAddExerciseToPlan = (exerciseId: string) => {
    if (selectedPlanId && addExerciseDayIndex !== null) {
      setPlans(prev => prev.map(p => {
        if (p.id === selectedPlanId) {
          const newDays = [...p.days];
          const currentExercises = newDays[addExerciseDayIndex].exercises;
          
          if (currentExercises.some(ex => ex.exerciseId === exerciseId)) {
            alert('Este exercício já está adicionado neste dia.');
            return p;
          }

          newDays[addExerciseDayIndex] = {
            ...newDays[addExerciseDayIndex],
            exercises: [...currentExercises, { exerciseId, notes: 'Adicionado manualmente' }]
          };
          return { ...p, days: newDays };
        }
        return p;
      }));
      setAddExerciseDayIndex(null);
      setAddExerciseSearch('');
    }
  };

  const handleDragStart = (e: React.DragEvent, dayIndex: number, exerciseIndex: number) => {
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the drag image to be captured before we might change styles
    setTimeout(() => {
      setDraggedItem({ dayIndex, exerciseIndex });
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number, exerciseIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverItem?.dayIndex !== dayIndex || dragOverItem?.exerciseIndex !== exerciseIndex) {
      setDragOverItem({ dayIndex, exerciseIndex });
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number, dropIndex: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.dayIndex !== dayIndex || draggedItem.exerciseIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    if (selectedPlanId) {
      setPlans(prev => prev.map(p => {
        if (p.id === selectedPlanId) {
          const newDays = [...p.days];
          const newExercises = [...newDays[dayIndex].exercises];
          
          const [draggedExercise] = newExercises.splice(draggedItem.exerciseIndex, 1);
          newExercises.splice(dropIndex, 0, draggedExercise);

          newDays[dayIndex] = {
            ...newDays[dayIndex],
            exercises: newExercises
          };

          return { ...p, days: newDays };
        }
        return p;
      }));
    }
    handleDragEnd();
  };
  const handleRemoveExerciseFromPlan = (e: React.MouseEvent, dayIndex: number, exerciseIndex: number) => {
    e.stopPropagation();
    if (selectedPlanId) {
      setPlans(prev => prev.map(p => {
        if (p.id === selectedPlanId) {
          const newDays = [...p.days];
          const newExercises = [...newDays[dayIndex].exercises];
          newExercises.splice(exerciseIndex, 1);
          newDays[dayIndex] = {
            ...newDays[dayIndex],
            exercises: newExercises
          };
          return { ...p, days: newDays };
        }
        return p;
      }));
    }
  };

  const handleSaveExerciseParams = () => {
    if (selectedPlanId && editExerciseParams) {
      setPlans(prev => prev.map(p => {
        if (p.id === selectedPlanId) {
          const newDays = [...p.days];
          const newExercises = [...newDays[editExerciseParams.dayIndex].exercises];
          newExercises[editExerciseParams.exerciseIndex] = {
            ...newExercises[editExerciseParams.exerciseIndex],
            sets: editExerciseParams.sets,
            reps: editExerciseParams.reps,
            rest: editExerciseParams.rest,
            load: editExerciseParams.load,
            duration: editExerciseParams.duration,
            notes: editExerciseParams.notes,
            weeklyParams: editExerciseParams.weeklyParams,
          };
          newDays[editExerciseParams.dayIndex] = {
            ...newDays[editExerciseParams.dayIndex],
            exercises: newExercises
          };
          return { ...p, days: newDays };
        }
        return p;
      }));
      setEditExerciseParams(null);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlans(prev => prev.map(p => {
      if (p.id === editPlanData.id) {
        return { ...p, title: editPlanData.title, description: editPlanData.description };
      }
      return p;
    }));
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-lime-400/30 selection:text-lime-200 pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-[#0F0F11] px-4 py-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(selectedPlan || selectedExercise) ? (
            <button 
              onClick={handleBackToMain}
              className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-300" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center text-zinc-950 font-bold italic">
              <Zap className="w-5 h-5" />
            </div>
          )}
          <h1 className="text-xl font-black italic uppercase leading-none text-white">
            {selectedExercise ? 'Detalhes do Exercício' : selectedPlan ? selectedPlan.title : 'PRO.FUTSAL'}
          </h1>
        </div>
        {!selectedPlan && !selectedExercise && (
          <div className="hidden sm:flex bg-[#0F0F11] rounded p-1 border border-zinc-800">
            <button 
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-1.5 rounded text-sm transition-all ${activeTab === 'plans' ? 'bg-zinc-800/50 text-lime-400 font-bold border-l-2 border-lime-400' : 'text-zinc-500 hover:bg-zinc-800/30 font-bold border-l-2 border-transparent'}`}
            >
              Planos de Treino
            </button>
            <button 
              onClick={() => setActiveTab('exercises')}
              className={`px-4 py-1.5 rounded text-sm transition-all ${activeTab === 'exercises' ? 'bg-zinc-800/50 text-lime-400 font-bold border-l-2 border-lime-400' : 'text-zinc-500 hover:bg-zinc-800/30 font-bold border-l-2 border-transparent'}`}
            >
              Biblioteca
            </button>
          </div>
        )}
      </header>

      {/* MOBILE TABS (Bottom) */}
      {!selectedPlan && !selectedExercise && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-[#0F0F11] pb-safe z-20">
          <div className="flex w-full">
            <button 
              onClick={() => setActiveTab('plans')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${activeTab === 'plans' ? 'text-lime-400' : 'text-zinc-500'}`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Planos</span>
            </button>
            <button 
              onClick={() => setActiveTab('exercises')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${activeTab === 'exercises' ? 'text-lime-400' : 'text-zinc-500'}`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Exercícios</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-3xl mx-auto w-full px-4 pt-6 md:pt-10">
        <AnimatePresence mode="wait">
          
          {/* EXERCISE DETAIL VIEW */}
          {selectedExercise && (
            <motion.div
              key="exercise-detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div 
                className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group cursor-pointer"
                onClick={() => {
                  if (selectedExercise.videoUrl) setPlayingVideo(true);
                }}
              >
                {playingVideo && selectedExercise.videoUrl ? (
                  selectedExercise.videoUrl.includes('youtube.com') || selectedExercise.videoUrl.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${
                        selectedExercise.videoUrl.includes('v=') 
                          ? selectedExercise.videoUrl.split('v=')[1].split('&')[0] 
                          : selectedExercise.videoUrl.includes('youtu.be/')
                            ? selectedExercise.videoUrl.split('youtu.be/')[1].split('?')[0]
                            : selectedExercise.videoUrl.split('embed/')[1]?.split('?')[0] || ''
                      }?autoplay=1`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={selectedExercise.videoUrl} 
                      controls 
                      autoPlay 
                      className="w-full h-full object-cover"
                    >
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                  )
                ) : (
                  <>
                    <Image 
                      src={selectedExercise.videoPlaceholder}
                      alt={selectedExercise.title}
                      fill
                      className={`object-cover ${selectedExercise.videoUrl ? 'opacity-80 group-hover:opacity-60 cursor-pointer' : 'opacity-40 cursor-not-allowed'} transition-opacity duration-300`}
                      referrerPolicy="no-referrer"
                    />
                    {selectedExercise.videoUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-black/80 via-transparent to-transparent">
                        <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/80 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                          Vídeo não disponível
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="accent">{selectedExercise.category}</Badge>
                </div>
                <h2 className="text-3xl font-black italic uppercase leading-none mb-2">{selectedExercise.title}</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">{selectedExercise.description}</p>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedExercise.sets}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Séries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedExercise.reps}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Reps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedExercise.rest}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Pausa</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Execução Passo a Passo</h3>
                <ul className="space-y-4">
                  {selectedExercise.instructions.map((inst, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-zinc-400">{i + 1}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{inst}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* PLAN DETAIL VIEW */}
          {!selectedExercise && selectedPlan && (
            <motion.div
              key="plan-detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <Badge variant="accent" className="mb-3">{selectedPlan.phase}</Badge>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase leading-none mb-3">{selectedPlan.title}</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">{selectedPlan.description}</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-zinc-500 font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>Duração: {selectedPlan.duration}</span>
                </div>
              </div>

              <div className="space-y-6">
                {selectedPlan.days.map((day, dIdx) => (
                  <div key={dIdx} className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-800 bg-[#0F0F11]">
                      <h3 className="text-lg font-bold">{day.dayName}</h3>
                      <p className="text-sm text-lime-400 font-medium">{day.focus}</p>
                    </div>
                    <div className="flex flex-col">
                      {day.exercises.map((dayEx, eIdx) => {
                        const exData = exercises.find(e => e.id === dayEx.exerciseId);
                        if (!exData) return null;
                        
                        return (
                          <div 
                            key={eIdx} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, dIdx, eIdx)}
                            onDragOver={(e) => handleDragOver(e, dIdx, eIdx)}
                            onDragEnd={handleDragEnd}
                            onDrop={(e) => handleDrop(e, dIdx, eIdx)}
                            onClick={() => handleExerciseSelect(exData.id)}
                            className={`p-4 transition-colors flex items-center gap-4 cursor-pointer group border-b border-zinc-800/50 last:border-b-0 ${
                              draggedItem?.dayIndex === dIdx && draggedItem?.exerciseIndex === eIdx ? 'opacity-50' : ''
                            } ${
                              dragOverItem?.dayIndex === dIdx && dragOverItem?.exerciseIndex === eIdx ? 'bg-zinc-800 border-t-2 border-t-lime-400' : 'hover:bg-zinc-800/50'
                            }`}
                          >
                            <div 
                              className="cursor-grab active:cursor-grabbing p-1 text-zinc-600 hover:text-white transition-colors flex-shrink-0"
                              title="Arraste para reordenar"
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700 bg-zinc-800">
                              <Image 
                                src={exData.videoPlaceholder}
                                alt={exData.title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-zinc-100 truncate">{exData.title}</h4>
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{exData.category}</span>
                              </div>
                              {dayEx.weeklyParams && dayEx.weeklyParams.some(w => w.sets || w.reps || w.load) ? (
                                <div className="w-full mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                  {dayEx.weeklyParams.map((w, idx) => (
                                    (w.sets || w.reps || w.load) ? (
                                      <div key={idx} className="bg-zinc-800/40 p-2 rounded border border-zinc-800/50 text-[10px]">
                                        <span className="text-lime-400/90 font-bold block mb-1 uppercase tracking-wider">Semana {idx + 1}</span>
                                        <div className="flex gap-2 flex-wrap text-zinc-300">
                                          {(w.sets || w.reps) && <span>{w.sets || '-'}x {w.reps || '-'}</span>}
                                          {w.load && <span>{w.load}</span>}
                                        </div>
                                      </div>
                                    ) : null
                                  ))}
                                  <div className="col-span-full flex items-center gap-3 text-xs text-zinc-500 mt-1 flex-wrap">
                                    {dayEx.rest && <span>Pausa: {dayEx.rest}</span>}
                                    {dayEx.duration && <span>Tempo: {dayEx.duration}</span>}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 flex-wrap">
                                  <span>{dayEx.sets || exData.sets}x {dayEx.reps || exData.reps}</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                  <span>Pausa: {dayEx.rest || exData.rest}</span>
                                  {(dayEx.load || exData.load) && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                      <span>Carga: {dayEx.load || exData.load}</span>
                                    </>
                                  )}
                                  {(dayEx.duration || exData.duration) && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                      <span>Tempo: {dayEx.duration || exData.duration}</span>
                                    </>
                                  )}
                                </div>
                              )}
                              {dayEx.notes && (
                                <p className="text-xs text-lime-400/80 mt-1.5 flex gap-1 items-start">
                                  <span className="block mt-[2px] w-1 h-1 rounded-full bg-lime-500/50" />
                                  {dayEx.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const planWeeks = parseInt(selectedPlan?.duration || '1') || 1;
                                  const defaultWeeklyParams = dayEx.weeklyParams?.length === planWeeks 
                                    ? dayEx.weeklyParams 
                                    : Array.from({ length: planWeeks }, (_, i) => dayEx.weeklyParams?.[i] || {
                                        sets: dayEx.sets || exData.sets || '',
                                        reps: dayEx.reps || exData.reps || '',
                                        load: dayEx.load || exData.load || ''
                                      });
                                  setEditExerciseParams({
                                    dayIndex: dIdx,
                                    exerciseIndex: eIdx,
                                    sets: dayEx.sets || exData.sets || '',
                                    reps: dayEx.reps || exData.reps || '',
                                    rest: dayEx.rest || exData.rest || '',
                                    load: dayEx.load || exData.load || '',
                                    duration: dayEx.duration || exData.duration || '',
                                    notes: dayEx.notes || '',
                                    weeklyParams: defaultWeeklyParams
                                  });
                                }}
                                className="p-2 text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                title="Editar parâmetros"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleRemoveExerciseFromPlan(e, dIdx, eIdx)}
                                className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                title="Remover exercício"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-lime-400 transition-colors ml-1" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 border-t border-zinc-800/50">
                      <button
                        onClick={() => setAddExerciseDayIndex(dIdx)}
                        className="w-full py-3 rounded border border-dashed border-zinc-700 bg-zinc-900/30 text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Exercício
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MAIN TABS (Home) */}
          {!selectedPlan && !selectedExercise && activeTab === 'plans' && (
            <motion.div
              key="tab-plans"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black italic uppercase leading-none mb-2">Periodização</h2>
                  <p className="text-zinc-400">Planos de treino estruturados para alta performance.</p>
                </div>
                <button 
                  onClick={() => setShowAiModal(true)}
                  className="hidden sm:flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors border border-zinc-700"
                >
                  <Wand2 className="w-4 h-4 text-lime-400" />
                  <span>Gerar Plano</span>
                </button>
              </div>

              {/* Mobile AI Button */}
              <button 
                onClick={() => setShowAiModal(true)}
                className="sm:hidden w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors border border-zinc-700 mb-4"
              >
                <Wand2 className="w-4 h-4 text-lime-400" />
                <span>Gerar Plano com IA</span>
              </button>

              <div className="grid gap-4">
                {plans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className="bg-[#0F0F11] border border-zinc-800 rounded-xl p-5 hover:border-lime-400/30 hover:bg-zinc-900/40 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="accent">{plan.phase}</Badge>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-800 uppercase tracking-widest">
                        {plan.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-lime-400 transition-colors">{plan.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{plan.description}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center text-sm font-medium text-zinc-300">
                        <span>Ver planificação completa</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleEditClick(e, plan)}
                          className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          title="Editar Plano"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeletePlan(e, plan.id)}
                          className="p-2 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Apagar Plano"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!selectedPlan && !selectedExercise && activeTab === 'exercises' && (
            <motion.div
              key="tab-exercises"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="mb-2">
                <h2 className="text-3xl font-black italic uppercase leading-none mb-2">Biblioteca de Movimentos</h2>
                <p className="text-zinc-400">Todos os exercícios da metodologia PRO.FUTSAL.</p>
              </div>
              
              <div className="space-y-8">
                {(['Força Máxima', 'Potência', 'Pliometria', 'Core', 'Prevenção', 'Mobilidade'] as Category[]).map(category => {
                  const catExercises = exercises.filter(e => e.category === category);
                  if (catExercises.length === 0) return null;
                  return (
                    <div key={category}>
                      <h3 className="text-[10px] font-bold text-zinc-500 border-b border-zinc-800 pb-2 mb-4 flex items-center gap-2 uppercase tracking-widest">
                        {category === 'Força Máxima' && <Dumbbell className="w-5 h-5 text-lime-500" />}
                        {category === 'Potência' && <Zap className="w-5 h-5 text-orange-500" />}
                        {category === 'Pliometria' && <Activity className="w-5 h-5 text-cyan-500" />}
                        {category === 'Core' && <ShieldAlert className="w-5 h-5 text-purple-500" />}
                        {category === 'Prevenção' && <Activity className="w-5 h-5 text-green-500" />}
                        {category === 'Mobilidade' && <Move className="w-5 h-5 text-blue-500" />}
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {catExercises.map(ex => (
                          <div 
                            key={ex.id}
                            onClick={() => handleExerciseSelect(ex.id)}
                            className="bg-zinc-900/50 border border-zinc-800 rounded p-3 flex gap-4 hover:bg-zinc-800/80 cursor-pointer transition-colors"
                          >
                            <div className="relative w-20 h-20 rounded bg-[#0F0F11] overflow-hidden flex-shrink-0">
                              <Image 
                                src={ex.videoPlaceholder}
                                alt={ex.title}
                                fill
                                className="object-cover opacity-70"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                              </div>
                            </div>
                            <div className="flex flex-col justify-center min-w-0 flex-1">
                              <h4 className="font-bold text-sm text-zinc-100 truncate">{ex.title}</h4>
                              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{ex.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* AI Generate Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0F0F11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-lime-400" />
                  <h3 className="text-lg font-bold">Gerar Plano com IA</h3>
                </div>
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleGeneratePlan} className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Fase do Treinamento</label>
                  <select 
                    value={aiPhase}
                    onChange={(e) => setAiPhase(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                  >
                    <option value="Pré-temporada">Pré-temporada</option>
                    <option value="Competitivo">Competitivo (In-Season)</option>
                    <option value="Transição">Transição (Férias)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Duração (Semanas)</label>
                  <input 
                    type="number"
                    min="1"
                    max="12"
                    value={aiWeeks}
                    onChange={(e) => setAiWeeks(parseInt(e.target.value) || 1)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Dias por Semana</label>
                  <input 
                    type="number"
                    min="1"
                    max="7"
                    value={aiDaysPerWeek}
                    onChange={(e) => handleDaysPerWeekChange(parseInt(e.target.value) || 1)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                
                {aiDaysPerWeek > 0 && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                      Foco por Dia (Opcional)
                      <span className="block text-[10px] text-zinc-500 font-normal normal-case mt-0.5">
                        Clique para selecionar um ou múltiplos focos para o dia.
                      </span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: Math.min(aiDaysPerWeek, 7) }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <label className="text-xs text-zinc-500 font-bold border-b border-zinc-800 pb-1">Dia {index + 1}</label>
                          <div className="flex flex-wrap gap-1.5">
                            {DEFAULT_FOCUS_OPTIONS.map(opt => {
                              const isSelected = (aiDaysFocus[index] || []).includes(opt);
                              return (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() => {
                                    const current = aiDaysFocus[index] || [];
                                    let updated;
                                    if (opt === 'Misto') {
                                      updated = ['Misto'];
                                    } else if (isSelected) {
                                      updated = current.filter(item => item !== opt);
                                      if (updated.length === 0) updated = ['Misto'];
                                    } else {
                                      updated = current.filter(item => item !== 'Misto').concat(opt);
                                    }
                                    const newFocus = [...aiDaysFocus];
                                    newFocus[index] = updated;
                                    setAiDaysFocus(newFocus);
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-colors border ${isSelected ? 'bg-lime-500/20 text-lime-400 border-lime-500/50' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-lime-400 text-black font-bold py-3 rounded flex justify-center items-center gap-2 hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando Plano...
                    </>
                  ) : (
                    'Gerar Plano'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0F0F11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-lime-400" />
                  <h3 className="text-lg font-bold">Editar Plano</h3>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Título do Plano</label>
                  <input 
                    type="text"
                    value={editPlanData.title}
                    onChange={(e) => setEditPlanData({ ...editPlanData, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Descrição</label>
                  <textarea 
                    value={editPlanData.description}
                    onChange={(e) => setEditPlanData({ ...editPlanData, description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500 resize-none h-24"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-lime-400 text-black font-bold py-3 rounded flex justify-center items-center gap-2 hover:bg-lime-500 transition-colors uppercase tracking-widest text-sm"
                >
                  Salvar Alterações
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Exercise Params Modal */}
      <AnimatePresence>
        {editExerciseParams && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0F0F11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-lime-400" />
                  <h3 className="text-lg font-bold">Editar Parâmetros</h3>
                </div>
                <button 
                  onClick={() => setEditExerciseParams(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {editExerciseParams.weeklyParams && editExerciseParams.weeklyParams.map((week, idx) => (
                  <div key={idx} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <h4 className="text-sm font-bold text-lime-400">Semana {idx + 1}</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Séries</label>
                        <input 
                          type="text" 
                          value={week.sets} 
                          onChange={e => {
                            const newWeekly = [...editExerciseParams.weeklyParams!];
                            newWeekly[idx].sets = e.target.value;
                            setEditExerciseParams({...editExerciseParams, weeklyParams: newWeekly});
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 text-sm focus:outline-none focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Repetições</label>
                        <input 
                          type="text" 
                          value={week.reps} 
                          onChange={e => {
                            const newWeekly = [...editExerciseParams.weeklyParams!];
                            newWeekly[idx].reps = e.target.value;
                            setEditExerciseParams({...editExerciseParams, weeklyParams: newWeekly});
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 text-sm focus:outline-none focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Carga</label>
                        <input 
                          type="text" 
                          value={week.load} 
                          onChange={e => {
                            const newWeekly = [...editExerciseParams.weeklyParams!];
                            newWeekly[idx].load = e.target.value;
                            setEditExerciseParams({...editExerciseParams, weeklyParams: newWeekly});
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 text-sm focus:outline-none focus:border-lime-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Pausa (Geral)</label>
                    <input 
                      type="text" 
                      value={editExerciseParams.rest} 
                      onChange={e => setEditExerciseParams({...editExerciseParams, rest: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Tempo (Geral)</label>
                    <input 
                      type="text" 
                      value={editExerciseParams.duration} 
                      onChange={e => setEditExerciseParams({...editExerciseParams, duration: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Observações</label>
                  <textarea 
                    value={editExerciseParams.notes} 
                    onChange={e => setEditExerciseParams({...editExerciseParams, notes: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500 h-20 resize-none"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-zinc-800 flex justify-end gap-3">
                <button 
                  onClick={() => setEditExerciseParams(null)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveExerciseParams}
                  className="px-6 py-2 bg-lime-400 hover:bg-lime-500 text-black rounded font-bold transition-colors text-sm"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Plan Confirm Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0F0F11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excluir Plano</h3>
              <p className="text-zinc-400 text-sm mb-6">Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded transition-colors text-sm uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded transition-colors text-sm uppercase tracking-widest"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {addExerciseDayIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0F0F11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center p-5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-lime-400" />
                  <h3 className="text-lg font-bold">Adicionar Exercício</h3>
                </div>
                <button 
                  onClick={() => { setAddExerciseDayIndex(null); setAddExerciseSearch(''); }}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-zinc-800">
                <input
                  type="text"
                  placeholder="Buscar exercício..."
                  value={addExerciseSearch}
                  onChange={e => setAddExerciseSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-sm focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="overflow-y-auto p-4 space-y-2">
                {exercises
                  .filter(e => e.title.toLowerCase().includes(addExerciseSearch.toLowerCase()) || e.category.toLowerCase().includes(addExerciseSearch.toLowerCase()))
                  .map(ex => {
                    const isAlreadyAdded = selectedPlan?.days[addExerciseDayIndex || 0]?.exercises.some(dayEx => dayEx.exerciseId === ex.id);
                    return (
                      <button
                        key={ex.id}
                        onClick={() => !isAlreadyAdded && handleAddExerciseToPlan(ex.id)}
                        disabled={isAlreadyAdded}
                        className={`w-full text-left p-3 rounded border transition-colors flex items-center justify-between group ${
                          isAlreadyAdded 
                            ? 'bg-zinc-900/30 border-transparent opacity-50 cursor-not-allowed' 
                            : 'bg-zinc-900/50 hover:bg-zinc-800 border-transparent hover:border-zinc-700'
                        }`}
                      >
                        <span className="block">
                          <span className={`block font-bold text-sm transition-colors ${isAlreadyAdded ? 'text-zinc-500' : 'text-zinc-200 group-hover:text-lime-400'}`}>
                            {ex.title} {isAlreadyAdded && '(Já adicionado)'}
                          </span>
                          <span className="block text-xs text-zinc-500 mt-1">{ex.category}</span>
                        </span>
                        {!isAlreadyAdded && (
                          <Plus className="w-4 h-4 text-zinc-600 group-hover:text-lime-400 transition-colors" />
                        )}
                      </button>
                    );
                  })
                }
                {exercises.filter(e => e.title.toLowerCase().includes(addExerciseSearch.toLowerCase()) || e.category.toLowerCase().includes(addExerciseSearch.toLowerCase())).length === 0 && (
                  <p className="text-center text-zinc-500 text-sm py-4">Nenhum exercício encontrado.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
