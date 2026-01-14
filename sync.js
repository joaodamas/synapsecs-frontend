import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pandaKey = process.env.PANDASCORE_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !pandaKey) {
  throw new Error('Defina SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e PANDASCORE_API_KEY no ambiente.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const teamCache = new Map();

const brTeams = new Set(['FURIA', 'Imperial', 'paiN', 'MIBR', 'Legacy', 'Fluxo', 'RED Canids', 'Vasco Esports']);

async function fetchPandaScore(path) {
  const response = await fetch(`https://api.pandascore.co${path}`, {
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

async function getTeamPlayers(teamId) {
  if (!teamId) return [];
  if (teamCache.has(teamId)) return teamCache.get(teamId);

  try {
    const playersResponse = await fetchPandaScore(`/csgo/teams/${teamId}/players?per_page=20`);
    const roster = (playersResponse || [])
      .filter((player) => player.active !== false)
      .map((player) => ({
        player_name: player.name,
        team_name: player.team?.name || player.team_name || null,
        rating: null,
        adr: null,
        kast: null
      }));

    teamCache.set(teamId, roster);
    return roster;
  } catch (error) {
    console.error(`Erro ao buscar elenco do time ${teamId}:`, error.message);
    teamCache.set(teamId, []);
    return [];
  }
}

async function syncPandaScore() {
  console.log('📅 Iniciando Sincronização via PandaScore...');

  try {
    const matches = await fetchPandaScore('/csgo/matches/upcoming?per_page=10');

    for (const match of matches) {
      const opponents = match.opponents || [];
      if (opponents.length < 2) continue;

      const teamA = opponents[0]?.opponent;
      const teamB = opponents[1]?.opponent;
      if (!teamA?.name || !teamB?.name) continue;

      console.log(`🎮 Sincronizando: ${teamA.name} vs ${teamB.name}`);

      const { data: savedMatch, error: matchError } = await supabase
        .from('matches')
        .upsert({
          id: match.id,
          team_a_name: teamA.name,
          team_b_name: teamB.name,
          event_name: match.league?.name || match.serie?.name || 'PandaScore',
          prob_a: 50,
          prob_b: 50,
          status: match.status || 'upcoming',
          match_date: match.begin_at || match.scheduled_at || new Date().toISOString(),
          is_brazilian: brTeams.has(teamA.name) || brTeams.has(teamB.name)
        })
        .select()
        .single();

      if (matchError) {
        console.error('❌ Erro ao salvar partida:', matchError.message);
        continue;
      }

      await supabase.from('players').delete().eq('match_id', savedMatch.id);

      const rosterA = await getTeamPlayers(teamA.id);
      const rosterB = await getTeamPlayers(teamB.id);
      console.log(
        `ℹ️ Elencos: ${teamA.name} (${rosterA.length}) | ${teamB.name} (${rosterB.length})`
      );
      const players = [...rosterA, ...rosterB].map((player) => ({
        match_id: savedMatch.id,
        player_name: player.player_name,
        team_name: player.team_name || (rosterA.includes(player) ? teamA.name : teamB.name),
        rating: player.rating,
        adr: player.adr,
        kast: player.kast
      }));

      if (players.length > 0) {
        const { error: playersError } = await supabase.from('players').insert(players);
        if (playersError) {
          console.error('❌ Erro ao salvar players:', playersError.message);
        }
      } else {
        console.warn(`⚠️ Sem players para ${teamA.name} vs ${teamB.name}.`);
      }
    }

    console.log('✅ Partidas sincronizadas via PandaScore!');
  } catch (error) {
    console.error('❌ Erro no Sync:', error.message);
  }
}

syncPandaScore();
