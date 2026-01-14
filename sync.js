import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncAllMatchesAndPlayers() {
  console.log('🚀 Iniciando Varredura Completa: Partidas + 10 Jogadores por jogo...');

  try {
    const response = await fetch('https://hltv-api.vercel.app/api/matches.json');
    const matches = await response.json();

    if (!matches.length) {
      console.log('⚠️ Nenhuma partida encontrada.');
      return;
    }

    await supabase.from('players').delete().neq('id', 0);

    for (const m of matches.slice(0, 10)) {
      console.log(`📡 Sincronizando: ${m.team1?.name} vs ${m.team2?.name}`);

      const { data: match, error: matchError } = await supabase
        .from('matches')
        .upsert({
          id: m.id,
          team_a_name: m.team1?.name || 'TBD',
          team_b_name: m.team2?.name || 'TBD',
          event_name: m.event || 'CS2 Tournament',
          prob_a: Math.floor(Math.random() * 30) + 35,
          status: 'upcoming',
          match_date: new Date().toISOString()
        })
        .select()
        .single();

      if (matchError) {
        console.error('❌ Erro ao salvar partida:', matchError.message);
        continue;
      }

      const playersToInsert = await generateRoster(m.team1, m.team2, match.id);
      const { error: playersError } = await supabase.from('players').insert(playersToInsert);
      if (playersError) {
        console.error(`❌ Erro nos players de ${match.id}:`, playersError.message);
      }
    }

    console.log('✅ Sincronização Total Concluída!');
  } catch (error) {
    console.error('❌ Falha crítica:', error.message);
  }
}

async function generateRoster(t1, t2, matchId) {
  const rosters = {
    MIBR: ['exit', 'insani', 'brnz4n', 'saffee', 'drop'],
    'Natus Vincere': ['jL', 'iM', 'Aleksib', 'w0nderful', 'b1t'],
    G2: ['Snax', 'm0NESY', 'huNter-', 'NiKo', 'malbsMd'],
    FaZe: ['karrigan', 'rain', 'broky', 'ropz', 'frozen'],
    Vitality: ['apEX', 'ZywOo', 'flameZ', 'spinx', 'mezii'],
    Furia: ['Fallen', 'chelo', 'art', 'yuurih', 'kye']
  };

  const teamAPlayers =
    rosters[t1?.name] || Array.from({ length: 5 }, (_, i) => `${t1?.name || 'Team A'} Player ${i + 1}`);
  const teamBPlayers =
    rosters[t2?.name] || Array.from({ length: 5 }, (_, i) => `${t2?.name || 'Team B'} Player ${i + 1}`);

  const allPlayers = [];

  teamAPlayers.forEach((name) => {
    allPlayers.push({
      match_id: matchId,
      player_name: name,
      team_name: t1?.name || 'Team A',
      rating: (Math.random() * 0.4 + 1.0).toFixed(2),
      adr: (Math.random() * 20 + 70).toFixed(1),
      kast: `${Math.floor(Math.random() * 10 + 70)}%`
    });
  });

  teamBPlayers.forEach((name) => {
    allPlayers.push({
      match_id: matchId,
      player_name: name,
      team_name: t2?.name || 'Team B',
      rating: (Math.random() * 0.4 + 1.0).toFixed(2),
      adr: (Math.random() * 20 + 70).toFixed(1),
      kast: `${Math.floor(Math.random() * 10 + 70)}%`
    });
  });

  return allPlayers;
}

syncAllMatchesAndPlayers();
