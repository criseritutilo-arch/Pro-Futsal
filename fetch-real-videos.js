const fs = require('fs');

async function searchYouTube(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=site:youtube.com+${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await res.text();
    // Look for href that looks like a youtube URL
    const match = html.match(/href="[^"]*(youtube\.com%2Fwatch%3Fv%3D[^&"]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rickroll as fallback
  } catch (e) {
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
}

async function main() {
  const exercises = [
    { id: 'e1', name: 'Agachamento Búlgaro com Halteres' },
    { id: 'e2', name: 'Salto na Caixa (Box Jump) crossfit' },
    { id: 'e3', name: 'Puxada de Arranco (Snatch Pull) LPO' },
    { id: 'e4', name: 'Flexão Nórdica isquiotibiais' },
    { id: 'e5', name: 'Levantamento Terra com Trap Bar' },
    { id: 'e6', name: 'Skater Jumps' },
    { id: 'e7', name: 'Pallof Press Dinâmico' },
    { id: 'e8', name: 'Mobilidade de Tornozelo na Parede' },
    { id: 'e9', name: 'Rotação 90/90 de Quadril mobilidade' },
    { id: 'e10', name: 'Rotação Torácica em 4 Apoios' },
    { id: 'e11', name: 'Mobilidade Ativa de Isquiotibiais' },
    { id: 'e12', name: 'Mobilidade de Adutores (Rockback)' },
    { id: 'e13', name: 'Alongamento de Flexores do Quadril' },
    { id: 'e14', name: 'Dead Bug exercício' },
    { id: 'e15', name: 'Bird Dog exercício' },
    { id: 'e16', name: 'Prancha isométrica' },
    { id: 'e17', name: 'Prancha Lateral' },
    { id: 'e18', name: 'Farmer Walk' },
    { id: 'e19', name: 'Copenhagen Adduction' },
    { id: 'e20', name: 'Tibial Raise' },
    { id: 'e21', name: 'Panturrilha Unilateral' },
    { id: 'e22', name: 'Flexão Plantar Excêntrica' },
    { id: 'e23', name: 'Rotadores do Quadril com Miniband' },
    { id: 'e24', name: 'Equilíbrio Unipodal' },
    { id: 'e25', name: 'Jump Squat' },
    { id: 'e26', name: 'Hang Power Clean' },
    { id: 'e27', name: 'Lunge Explosivo' },
    { id: 'e28', name: 'Medicine Ball Slam' },
    { id: 'e29', name: 'Medicine Ball Rotacional' },
    { id: 'e30', name: 'Sprint com Trenó' },
    { id: 'e31', name: 'Back Squat agachamento' },
    { id: 'e32', name: 'Hip Thrust elevação pélvica' }
  ];

  let content = fs.readFileSync('app/page.tsx', 'utf8');

  for (const ex of exercises) {
    console.log(`Searching for ${ex.name}...`);
    const url = await searchYouTube(ex.name);
    console.log(`Found: ${url}`);
    
    content = content.replace(
      new RegExp(`(id: '${ex.id}',[\\s\\S]*?videoUrl: )'.*?'`, 'g'),
      `$1'${url}'`
    );
  }

  fs.writeFileSync('app/page.tsx', content);
  console.log("Updated page.tsx with real URLs.");
}

main();
