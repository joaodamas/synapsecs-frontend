import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingUp, CheckCircle, XCircle, Minus } from "lucide-react";

export function AiAnalysis({ match }) {
  const winner = match.prediction.teamA > match.prediction.teamB ? match.teamA : match.teamB;
  const loser = match.prediction.teamA > match.prediction.teamB ? match.teamB : match.teamA;

  const winnerScore = Math.max(match.prediction.teamA, match.prediction.teamB);
  const difference = Math.abs(match.prediction.teamA - match.prediction.teamB);

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Fatores-Chave da Previsão
        </h3>

        <div className="space-y-3">
          {match.prediction.factors.map((factor, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-sm text-foreground">{factor}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Análise Comparativa
        </h3>

        <div className="space-y-4">
          <ComparisonRow
            label="Ranking Mundial"
            teamA={match.teamA.ranking}
            teamB={match.teamB.ranking}
            teamAName={match.teamA.name}
            teamBName={match.teamB.name}
            lowerIsBetter
          />
          <ComparisonRow
            label="Win Rate Geral"
            teamA={match.teamA.winRate}
            teamB={match.teamB.winRate}
            teamAName={match.teamA.name}
            teamBName={match.teamB.name}
            suffix="%"
          />
          <ComparisonRow
            label="Mapas Fortes"
            teamA={match.maps.teamA.length}
            teamB={match.maps.teamB.length}
            teamAName={match.teamA.name}
            teamBName={match.teamB.name}
          />
          <ComparisonRow
            label="H2H Vitórias"
            teamA={match.headToHead.teamA}
            teamB={match.headToHead.teamB}
            teamAName={match.teamA.name}
            teamBName={match.teamB.name}
          />
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resumo da Análise</h3>

        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Nossa IA analisou múltiplos fatores incluindo forma recente, histórico de confrontos, performance em mapas
            específicos e rankings atuais.
          </p>

          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-foreground">
              <span className="font-semibold text-primary">{winner.name}</span> é o favorito com{" "}
              <span className="font-bold text-primary">{winnerScore}%</span> de chance de vitória.
              {difference > 20 && <span className="text-success"> Vantagem significativa detectada.</span>}
              {difference <= 20 && difference > 10 && <span className="text-warning"> Partida com leve favorito.</span>}
              {difference <= 10 && <span className="text-destructive"> Partida muito equilibrada - alto risco.</span>}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ComparisonRow({
  label,
  teamA,
  teamB,
  teamAName,
  teamBName,
  lowerIsBetter = false,
  suffix = ""
}) {
  const aWins = lowerIsBetter ? teamA < teamB : teamA > teamB;
  const bWins = lowerIsBetter ? teamB < teamA : teamB > teamA;
  const tie = teamA === teamB;

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2 flex-1">
        <span
          className={`font-mono font-bold ${aWins ? "text-success" : tie ? "text-muted-foreground" : "text-foreground"}`}
        >
          {teamA}
          {suffix}
        </span>
        {aWins && <CheckCircle className="w-4 h-4 text-success" />}
        {!aWins && !tie && <XCircle className="w-4 h-4 text-destructive/50" />}
        {tie && <Minus className="w-4 h-4 text-muted-foreground" />}
      </div>

      <span className="text-sm text-muted-foreground flex-1 text-center">{label}</span>

      <div className="flex items-center gap-2 flex-1 justify-end">
        {bWins && <CheckCircle className="w-4 h-4 text-success" />}
        {!bWins && !tie && <XCircle className="w-4 h-4 text-destructive/50" />}
        {tie && <Minus className="w-4 h-4 text-muted-foreground" />}
        <span
          className={`font-mono font-bold ${bWins ? "text-success" : tie ? "text-muted-foreground" : "text-foreground"}`}
        >
          {teamB}
          {suffix}
        </span>
      </div>
    </div>
  );
}
