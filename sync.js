import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pandaKey = process.env.PANDASCORE_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !pandaKey) {
  throw new Error('Defina SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e PANDASCORE_API_KEY no ambiente.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchUpcomingMatches() {
  const url = 'https://api.pandascore.co/csgo/matches/upcoming?per_page=10';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${pandaKey}`
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PandaScore error: ${response.status} ${body}`);
  }

  return response.json();
}

function normalizeTeam(opponent) {
  return opponent?.opponent?.name || 'TBD';
}

async function syncRealData() {
  console.log('Iniciando sincronizacao via PandaScore...');

  try {
    const matches = await fetchUpcomingMatches();

    for (const match of matches) {
      const teamA = normalizeTeam(match.opponents?.[0]);
      const teamB = normalizeTeam(match.opponents?.[1]);

      await supabase.from('matches').upsert({
        id: match.id,
        team_a_name: teamA,
        team_b_name: teamB,
        event_name: match.league?.name || 'PandaScore',
        match_date: match.scheduled_at || new Date().toISOString(),
        prob_a: 50,
        prob_b: 50,
        status: match.status || 'upcoming'
      });

      console.log(`Sincronizado: ${teamA} vs ${teamB}`);
    }

    console.log('Dados injetados com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
  }
}

syncRealData();
