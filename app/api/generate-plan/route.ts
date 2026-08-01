import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { phase, weeks, daysPerWeek, daysFocus, exercisesContext } = await req.json();
    const days = daysPerWeek || 5;
    
    const focusContext = daysFocus 
      ? `\nFocos solicitados para cada dia:\n${daysFocus.map((f: string[], i: number) => `Dia ${i + 1}: ${f.join(', ')}`).join('\n')}\n`
      : '';

    const prompt = `
Você é um preparador físico de elite especializado em futsal de alto rendimento.
Crie um plano de treino periodizado.
Fase: ${phase}
Duração: ${weeks} Semanas.

Aqui estão os exercícios disponíveis (ID - Nome - Categoria):
${exercisesContext}
${focusContext}
Crie um plano de treino contendo EXATAMENTE ${days} dias de treino na semana (ex: Dia 1, Dia 2, ..., Dia ${days}) que se repetirão ao longo destas ${weeks} semanas, com progressão de carga implícita. É OBRIGATÓRIO TER EXATAMENTE ${days} DIAS DE TREINO.
Para cada dia, o foco principal DEVE SER compatível com o foco solicitado acima para o dia (se solicitado 'Misto' ou ausente, escolha um foco adequado para a fase). Use APENAS os IDs de exercícios fornecidos na lista acima.

Retorne EXATAMENTE um objeto JSON seguindo a estrutura solicitada.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Título do plano, ex: Bloco de Pré-temporada Avançado" },
        description: { type: Type.STRING, description: "Descrição do plano e objetivos" },
        days: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayName: { type: Type.STRING, description: "Ex: Dia 1, Dia 2" },
              focus: { type: Type.STRING, description: "Ex: Potência e Core" },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    exerciseId: { type: Type.STRING, description: "ID do exercício, ex: e1, e5" },
                    notes: { type: Type.STRING, description: "Observação específica para o exercício neste treino" }
                  },
                  required: ["exerciseId", "notes"]
                }
              }
            },
            required: ["dayName", "focus", "exercises"]
          }
        }
      },
      required: ["title", "description", "days"]
    };

    let response;
    let retries = 5;
    let delay = 1000;

    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        });
        break; // Success
      } catch (e: any) {
        if (e?.status === 503 || e?.message?.includes("503") || e?.message?.includes("high demand") || e?.status === 429) {
          retries--;
          if (retries === 0) throw e;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw e;
        }
      }
    }

    const data = JSON.parse(response?.text || '{}');
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Error generating plan:", error?.message || JSON.stringify(error));
    return NextResponse.json({ error: "O serviço de IA está temporariamente indisponível devido à alta demanda. Por favor, tente novamente em instantes." }, { status: 503 });
  }
}
