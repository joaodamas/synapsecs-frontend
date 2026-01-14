import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import { MatchList } from "@/components/match-list";
import { MatchDetails } from "@/components/match-details";
import { PlayerStats } from "@/components/player-stats";

const teamLogos = {
  "B8 Academy": "/b8-esports-logo.jpg",
  "Endless Journey": "/endless-journey-esports-logo.jpg",
  FriendlyCampers: "/friendlycampers-esports-logo.jpg",
  Heroic: "/heroic-esports-logo.jpg",
  MIBR: "/mibr-esports-logo.jpg",
  "Gaimin Gladiators": "/gaimin-gladiators-esports-logo.jpg",
  "los kogutos": "/los-kogutos-esports-logo.jpg",
  STATE: "/state-esports-logo.jpg",
  "UNiTY esports": "/unity-esports-logo.jpg",
  petardka: "/petardka-esports-logo.jpg",
  "Vasco Esports": "/vasco-esports-logo.jpg",
  "Charrados FC": "/charrados-fc-esports-logo.jpg",
  Monte: "/monte-esports-logo.jpg",
  "Natus Vincere": "/natus-vincere-esports-logo.jpg",
  NRG: "/nrg-esports-logo.jpg"
};

const fallbackLogo = "/placeholder-logo.png";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [mapPool, setMapPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });

      if (fetchError) {
        console.error("Erro ao carregar partidas:", fetchError);
        setError("Não foi possível carregar as partidas.");
        setLoading(false);
        return;
      }

      setMatches(data || []);
      if (data?.length) {
        setSelectedMatchId(data[0].id);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedMatchId) {
        setPlayers([]);
        setMapPool([]);
        return;
      }

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("match_id", selectedMatchId)
        .order("rating", { ascending: false });

      if (playerError) {
        console.error("Erro ao carregar players:", playerError);
      }
      setPlayers(playerData || []);

      const { data: mapData, error: mapError } = await supabase
        .from("map_pool")
        .select("*")
        .eq("match_id", selectedMatchId);

      if (mapError) {
        console.error("Erro ao carregar map pool:", mapError);
      }
      setMapPool(mapData || []);
    };

    fetchDetails();
  }, [selectedMatchId]);

  const selectedMatch = useMemo(() => {
    const match = matches.find((item) => item.id === selectedMatchId);
    if (!match) return null;

    const probA = Number(match.prob_a ?? 50);
    const probB = Number(match.prob_b ?? 100 - probA);
    const confidence = Math.min(95, Math.max(50, Math.round(50 + Math.abs(probA - probB))));

    const factors = [];
    if (mapPool.length > 0) {
      factors.push("Map pool identificado para ambos os times.");
    } else {
      factors.push("Sem dados de map pool no momento.");
    }
    if (players.length >= 8) {
      factors.push("Elencos completos disponíveis para análise.");
    } else {
      factors.push("Elencos incompletos ou em atualização.");
    }
    if (match.event_name) {
      factors.push(`Evento: ${match.event_name}.`);
    }

    const mapNames = mapPool.map((map) => map.map_name).filter(Boolean);
    const mapsTeamA = mapNames.filter((map, index) => (mapPool[index]?.winrate_a ?? 0) >= 0);
    const mapsTeamB = mapNames.filter((map, index) => (mapPool[index]?.winrate_b ?? 0) >= 0);

    return {
      id: match.id,
      tournament: match.event_name || "Torneio",
      teamA: {
        name: match.team_a_name || "TBD",
        logo: teamLogos[match.team_a_name] || fallbackLogo,
        ranking: match.rank_a ?? null,
        winRate: match.winrate_a ?? null,
        recentForm: match.recent_form_a ?? []
      },
      teamB: {
        name: match.team_b_name || "TBD",
        logo: teamLogos[match.team_b_name] || fallbackLogo,
        ranking: match.rank_b ?? null,
        winRate: match.winrate_b ?? null,
        recentForm: match.recent_form_b ?? []
      },
      prediction: {
        teamA: probA,
        teamB: probB,
        confidence,
        factors
      },
      format: match.format || "BO3",
      date: match.match_date || new Date().toISOString(),
      maps: {
        teamA: mapsTeamA,
        teamB: mapsTeamB
      },
      headToHead: {
        teamA: match.h2h_a ?? 0,
        teamB: match.h2h_b ?? 0,
        draws: match.h2h_draws ?? 0
      },
      odds: {
        teamA: match.odds_a ?? 1.9,
        teamB: match.odds_b ?? 1.9
      }
    };
  }, [matches, selectedMatchId, mapPool, players]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando partidas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!matches.length || !selectedMatch) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Nenhuma partida encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-72 border-r border-border bg-card/50">
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-bold text-foreground">CS2 PREDICT</h1>
            <p className="text-xs text-muted-foreground">Advanced Analytics</p>
          </div>
          <MatchList
            matches={matches.map((match) => ({
              id: match.id,
              tournament: match.event_name || "Torneio",
              teamA: { name: match.team_a_name || "TBD" },
              teamB: { name: match.team_b_name || "TBD" }
            }))}
            selectedMatch={{ id: selectedMatch.id, teamA: selectedMatch.teamA, teamB: selectedMatch.teamB }}
            onSelectMatch={(match) => setSelectedMatchId(match.id)}
          />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <MatchDetails match={selectedMatch} />
        </main>

        <aside className="w-80 border-l border-border bg-card/30 p-6 overflow-y-auto">
          <PlayerStats match={selectedMatch} players={players} />
        </aside>
      </div>
    </div>
  );
}
