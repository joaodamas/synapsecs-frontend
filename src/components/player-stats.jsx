import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Star, TrendingUp, Target } from "lucide-react";

export function PlayerStats({ match, players }) {
  const teamAPlayers = (players || []).filter((player) => player.team_name === match.teamA.name);
  const teamBPlayers = (players || []).filter((player) => player.team_name === match.teamB.name);

  const teamAAvgRating =
    teamAPlayers.length > 0
      ? (teamAPlayers.reduce((sum, p) => sum + Number(p.rating || 0), 0) / teamAPlayers.length).toFixed(2)
      : "N/A";
  const teamBAvgRating =
    teamBPlayers.length > 0
      ? (teamBPlayers.reduce((sum, p) => sum + Number(p.rating || 0), 0) / teamBPlayers.length).toFixed(2)
      : "N/A";

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Performance Individual
      </h2>

      <Card className="p-3 bg-card border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">{match.teamA.name}</h3>
          <Badge variant="outline" className="text-xs">
            Avg: {teamAAvgRating}
          </Badge>
        </div>

        <div className="space-y-2">
          {teamAPlayers.length === 0 && (
            <p className="text-xs text-muted-foreground">Sem dados de jogadores.</p>
          )}
          {teamAPlayers.map((player) => (
            <PlayerRow key={player.player_name} player={player} />
          ))}
        </div>
      </Card>

      <Card className="p-3 bg-card border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">{match.teamB.name}</h3>
          <Badge variant="outline" className="text-xs">
            Avg: {teamBAvgRating}
          </Badge>
        </div>

        <div className="space-y-2">
          {teamBPlayers.length === 0 && (
            <p className="text-xs text-muted-foreground">Sem dados de jogadores.</p>
          )}
          {teamBPlayers.map((player) => (
            <PlayerRow key={player.player_name} player={player} />
          ))}
        </div>
      </Card>

      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-secondary/30 rounded-lg">
        <p className="flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> <span className="font-medium">Rating:</span> Performance geral (HLTV 2.0)
        </p>
        <p className="flex items-center gap-2">
          <Target className="w-3 h-3" /> <span className="font-medium">ADR:</span> Dano médio por round
        </p>
        <p className="flex items-center gap-2">
          <User className="w-3 h-3" /> <span className="font-medium">KAST:</span> % de rounds com impacto
        </p>
      </div>
    </div>
  );
}

function PlayerRow({ player }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
          <User className="w-3 h-3 text-muted-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">{player.player_name}</span>
            {Number(player.rating) >= 1.2 && <Star className="w-3 h-3 text-warning fill-warning" />}
          </div>
          <span className="text-xs text-muted-foreground">{player.team_name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="text-right">
          <p
            className={`font-mono font-bold ${
              Number(player.rating) >= 1.0 ? "text-success" : "text-foreground"
            }`}
          >
            {Number(player.rating || 0).toFixed(2)}
          </p>
        </div>
        <div className="text-right text-muted-foreground">
          <p className="font-mono">{Number(player.adr || 0).toFixed(0)}</p>
        </div>
        <div className="text-right text-muted-foreground">
          <p className="font-mono">{Number(String(player.kast).replace("%", "") || 0).toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
}
