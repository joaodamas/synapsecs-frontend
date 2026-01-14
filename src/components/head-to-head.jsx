import { Card } from "@/components/ui/card";
import { History, Trophy, Minus } from "lucide-react";

export function HeadToHead({ match }) {
  const total = match.headToHead.teamA + match.headToHead.teamB + match.headToHead.draws;
  const teamAPercent = total > 0 ? (match.headToHead.teamA / total) * 100 : 50;
  const teamBPercent = total > 0 ? (match.headToHead.teamB / total) * 100 : 50;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Histórico de Confrontos
        </h3>

        {total === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum confronto anterior registrado</p>
            <p className="text-xs text-muted-foreground mt-1">Este será o primeiro encontro entre as equipes</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{match.teamA.name}</span>
                <span className="text-sm font-medium text-foreground">{match.teamB.name}</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden flex">
                <div className="h-full bg-primary transition-all" style={{ width: `${teamAPercent}%` }} />
                <div className="h-full bg-chart-2 transition-all" style={{ width: `${teamBPercent}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{match.headToHead.teamA}</p>
                <p className="text-xs text-muted-foreground">{match.teamA.name}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <Minus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{match.headToHead.draws}</p>
                <p className="text-xs text-muted-foreground">Empates</p>
              </div>

              <div className="p-4 bg-chart-2/10 rounded-lg border border-chart-2/20">
                <Trophy className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{match.headToHead.teamB}</p>
                <p className="text-xs text-muted-foreground">{match.teamB.name}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {match.headToHead.teamA > match.headToHead.teamB && (
                  <span>
                    <span className="font-medium text-primary">{match.teamA.name}</span> domina o histórico com{" "}
                    {match.headToHead.teamA} vitórias em {total} confrontos.
                  </span>
                )}
                {match.headToHead.teamB > match.headToHead.teamA && (
                  <span>
                    <span className="font-medium text-chart-2">{match.teamB.name}</span> domina o histórico com{" "}
                    {match.headToHead.teamB} vitórias em {total} confrontos.
                  </span>
                )}
                {match.headToHead.teamA === match.headToHead.teamB && (
                  <span>
                    Histórico equilibrado entre as equipes com {match.headToHead.teamA} vitórias para cada lado.
                  </span>
                )}
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
