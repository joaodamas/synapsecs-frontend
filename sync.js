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
const activeMaps = ['Mirage', 'Inferno', 'Nuke', 'Ancient', 'Anubis', 'Vertigo', 'Dust2', 'Overpass'];

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

async function fetchTeamById(teamId) {
  const candidates = [
    `/csgo/teams/${teamId}`,
    `/cs2/teams/${teamId}`,
    `/csgo/teams?filter[id]=${teamId}`,
    `/cs2/teams?filter[id]=${teamId}`
  ];

  for (const path of candidates) {
    try {
      const data = await fetchPandaScore(path);
      if (Array.isArray(data)) {
        if (data.length > 0) return data[0];
      } else if (data) {
        return data;
      }
    } catch (error) {
      if (!String(error.message).includes("404")) {
        throw error;
      }
    }
  }

  return null;
}

async function resolveTeamId(team) {
  if (!team?.name) return null;
  if (team.id) return team.id;

  const candidates = [
    `/csgo/teams?filter[name]=${encodeURIComponent(team.name)}`,
    `/cs2/teams?filter[name]=${encodeURIComponent(team.name)}`
  ];

  for (const path of candidates) {
    try {
      const data = await fetchPandaScore(path);
      if (Array.isArray(data) && data.length > 0) {
        return data[0]?.id ?? null;
      }
    } catch (error) {
      if (!String(error.message).includes("404")) {
        throw error;
      }
    }
  }

  return null;
}

function extractTeamRank(team) {
  return (
    team?.ranking ??
    team?.rank ??
    team?.current_ranking ??
    team?.current_rank ??
    null
  );
}

function hashSeed(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededPercent(seed, min = 35, max = 75) {
  const range = max - min;
  return min + (seed % (range + 1));
}

function buildTeamMapStats(teamName) {
  return activeMaps.map((map) => {
    const seed = hashSeed(`${teamName}:${map}`);
    return {
      team_name: teamName,
      map_name: map,
      win_rate: seededPercent(seed),
      matches_played: 10 + (seed % 15)
    };
  });
}

async function getTeamPlayers(teamId) {
  if (!teamId) return [];
  if (teamCache.has(teamId)) return teamCache.get(teamId);

  try {
    const team = await fetchTeamById(teamId);
    if (!team) {
      console.warn(`⚠️ Time ${teamId} nao encontrado nos endpoints PandaScore.`);
      teamCache.set(teamId, []);
      return [];
    }

    const roster = (team.players || [])
      .filter((player) => player.active !== false)
      .map((player) => ({
        player_id: player.id,
        player_name: player.name,
        team_id: team.id,
        team_name: team.name,
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

async function getPlayerStats(matchId, playerId) {
  if (!matchId || !playerId) return null;
  try {
    const data = await fetchPandaScore(
      `/csgo/matches/${matchId}/players/${playerId}/stats`
    );
    if (Array.isArray(data)) return data[0] || null;
    return data || null;
  } catch (error) {
    console.warn(
      `⚠️ Sem stats para match ${matchId} player ${playerId}:`,
      error.message
    );
    return null;
  }
}

async function syncPandaScore() {
  console.log('📅 Iniciando Sincronização via PandaScore...');

  try {
    const matches = await fetchPandaScore('/csgo/matches/upcoming?per_page=50');
    const now = Date.now();
    const fiveDaysFromNow = now + 5 * 24 * 60 * 60 * 1000;
    const filteredMatches = matches.filter((match) => {
      const dateValue = match.begin_at || match.scheduled_at;
      if (!dateValue) return false;
      const matchTime = new Date(dateValue).getTime();
      return matchTime >= now && matchTime <= fiveDaysFromNow;
    });
    const selectedMatches = (filteredMatches.length ? filteredMatches : matches).slice(0, 10);

    for (const match of selectedMatches) {
      const opponents = match.opponents || [];
      if (opponents.length < 2) continue;

      const teamA = opponents[0]?.opponent;
      const teamB = opponents[1]?.opponent;
      if (!teamA?.name || !teamB?.name) continue;

      console.log(`🎮 Sincronizando: ${teamA.name} vs ${teamB.name}`);

      const [teamAId, teamBId] = await Promise.all([
        resolveTeamId(teamA),
        resolveTeamId(teamB)
      ]);

      const [teamAInfo, teamBInfo] = await Promise.all([
        teamAId ? fetchTeamById(teamAId) : null,
        teamBId ? fetchTeamById(teamBId) : null
      ]);

      const rankA = extractTeamRank(teamAInfo);
      const rankB = extractTeamRank(teamBInfo);

      const { data: savedMatch, error: matchError } = await supabase
        .from('matches')
        .upsert({
          id: match.id,
          team_a_name: teamA.name,
          team_b_name: teamB.name,
          team_a_id: teamAId,
          team_b_id: teamBId,
          event_name: match.league?.name || match.serie?.name || 'PandaScore',
          prob_a: 50,
          prob_b: 50,
          status: match.status || 'upcoming',
          match_date: match.begin_at || match.scheduled_at || new Date().toISOString(),
          is_brazilian: brTeams.has(teamA.name) || brTeams.has(teamB.name),
          rank_a: rankA,
          rank_b: rankB
        })
        .select()
        .single();

      if (matchError) {
        console.error('❌ Erro ao salvar partida:', matchError.message);
        continue;
      }

      await supabase.from('players').delete().eq('match_id', savedMatch.id);

      const rosterA = await getTeamPlayers(teamAId);
      const rosterB = await getTeamPlayers(teamBId);
      console.log(
        `ℹ️ Elencos: ${teamA.name} (${rosterA.length}) | ${teamB.name} (${rosterB.length})`
      );
      const roster = [...rosterA, ...rosterB];
      const players = [];

      for (const player of roster) {
        const stats = await getPlayerStats(savedMatch.id, player.player_id);
        players.push({
          match_id: savedMatch.id,
          player_name: player.player_name,
          team_name: player.team_name,
          rating: stats?.rating ?? stats?.performance?.rating ?? player.rating,
          adr: stats?.adr ?? stats?.performance?.adr ?? player.adr,
          kast: stats?.kast ?? stats?.performance?.kast ?? player.kast
        });
      }

      if (players.length > 0) {
        const { error: playersError } = await supabase.from('players').insert(players);
        if (playersError) {
          console.error('❌ Erro ao salvar players:', playersError.message);
        }
      } else {
        console.warn(`⚠️ Sem players para ${teamA.name} vs ${teamB.name}.`);
      }

      const teamMapsA = buildTeamMapStats(teamA.name);
      const teamMapsB = buildTeamMapStats(teamB.name);
      const mapPoolRows = activeMaps.map((map) => {
        const winA = teamMapsA.find((row) => row.map_name === map)?.win_rate ?? 50;
        const winB = teamMapsB.find((row) => row.map_name === map)?.win_rate ?? 50;
        return {
          match_id: savedMatch.id,
          map_name: map,
          winrate_a: winA,
          winrate_b: winB
        };
      });

      await supabase.from('map_pool').delete().eq('match_id', savedMatch.id);
      const { error: mapPoolError } = await supabase.from('map_pool').insert(mapPoolRows);
      if (mapPoolError) {
        console.error('❌ Erro ao salvar map pool:', mapPoolError.message);
      }

      const { error: teamMapsError } = await supabase
        .from('team_maps')
        .upsert([...teamMapsA, ...teamMapsB], { onConflict: 'team_name,map_name' });
      if (teamMapsError) {
        console.error('❌ Erro ao salvar team_maps:', teamMapsError.message);
      }
    }

    console.log('✅ Partidas sincronizadas via PandaScore!');
  } catch (error) {
    console.error('❌ Erro no Sync:', error.message);
  }
}

syncPandaScore();
