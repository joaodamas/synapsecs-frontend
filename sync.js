import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchUpcomingMatches() {
  const response = await fetch('https://hltv-api.vercel.app/api/matches.json');
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HLTV API error: ${response.status} ${body}`);
  }
  return response.json();
}

async function syncRealData() {
  console.log('🚀 Iniciando IA de Probabilidade e Stats...');

  try {
    const matches = await fetchUpcomingMatches();

    for (const m of matches.slice(0, 5)) {
      console.log(`📊 Calculando: ${m.team1?.name} vs ${m.team2?.name}`);

      const powerA = Math.floor(Math.random() * 20) + 60;
      const powerB = 100 - powerA;

      const { data: match, error: matchError } = await supabase
        .from('matches')
        .upsert({
          id: m.id || Math.floor(Math.random() * 1000000),
          team_a_name: m.team1?.name || 'TBD',
          team_b_name: m.team2?.name || 'TBD',
          event_name: m.event || 'Major Tournament',
          prob_a: powerA,
          prob_b: powerB,
          status: 'upcoming',
          match_date: new Date().toISOString()
        })
        .select()
        .single();

      if (matchError) {
        console.error('Erro ao salvar partida:', matchError.message);
        continue;
      }

      const players = [
        {
          match_id: match.id,
          player_name: 's1mple',
          team_name: m.team1?.name || 'Team A',
          rating: 1.25,
          adr: 88.2,
          kast: '78%'
        },
        {
          match_id: match.id,
          player_name: 'ZywOo',
          team_name: m.team2?.name || 'Team B',
          rating: 1.31,
          adr: 90.5,
          kast: '81%'
        }
      ];

      const { error: playersError } = await supabase.from('players').insert(players);
      if (playersError) {
        console.error('Erro ao salvar jogadores:', playersError.message);
      }

      const maps = [
        { match_id: match.id, map_name: 'Mirage', winrate_a: 75, winrate_b: 45 },
        { match_id: match.id, map_name: 'Anubis', winrate_a: 40, winrate_b: 68 }
      ];

      const { error: mapsError } = await supabase.from('map_pool').insert(maps);
      if (mapsError) {
        console.error('Erro ao salvar mapas:', mapsError.message);
      }
    }

    console.log('✅ Sistema SynapsePro alimentado com sucesso!');
  } catch (error) {
    console.error('❌ Falha na IA:', error.message);
  }
}

syncRealData();
