import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Map, History, Zap, Clock, AlertCircle, Sparkles } from "lucide-react";
import { MapPoolComparison } from "./map-pool-comparison";
import { HeadToHead } from "./head-to-head";
import { AiAnalysis } from "./ai-analysis";

export function MatchDetails({ match, isGenerating, report, onGenerateReport }) {
  const winner = match.prediction.teamA > match.prediction.teamB ? "A" : "B";
  const winnerTeam = winner === "A" ? match.teamA : match.teamB;
  const winnerPrediction = winner === "A" ? match.prediction.teamA : match.prediction.teamB;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={match.teamA.logo || "/placeholder.svg"}
              alt={match.teamA.name}
              className="w-12 h-12 rounded-lg bg-secondary p-1"
            />
            <div className="text-left">
              <h2 className="text-2xl font-bold text-foreground">{match.teamA.name}</h2>
              <p className="text-sm text-muted-foreground">
                Ranking {match.teamA.ranking ?? "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-bold text-foreground">{match.prediction.teamA}%</p>
            <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${match.prediction.teamA}%` }}
              />
            </div>
          </div>
          <RecentForm form={match.teamA.recentForm} />
        </div>

        <div className="flex flex-col items-center gap-2 pt-4">
          <Badge variant="outline" className="text-xs">
            {match.format}
          </Badge>
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Winrate Predito</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatDate(match.date)}
          </div>
        </div>

        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-foreground">{match.teamB.name}</h2>
              <p className="text-sm text-muted-foreground">
                Ranking {match.teamB.ranking ?? "N/A"}
              </p>
            </div>
            <img
              src={match.teamB.logo || "/placeholder.svg"}
              alt={match.teamB.name}
              className="w-12 h-12 rounded-lg bg-secondary p-1"
            />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-bold text-foreground">{match.prediction.teamB}%</p>
            <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-chart-2 transition-all duration-500 ml-auto"
                style={{ width: `${match.prediction.teamB}%` }}
              />
            </div>
          </div>
          <RecentForm form={match.teamB.recentForm} />
        </div>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confiança da IA</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-foreground">{match.prediction.confidence}%</p>
                <ConfidenceBadge confidence={match.prediction.confidence} />
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Favorito</p>
            <p className="text-lg font-semibold text-primary">{winnerTeam.name}</p>
            <p className="text-xs text-muted-foreground">com {winnerPrediction}% de chance</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="w-full justify-start bg-secondary/30 border border-border">
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Análise IA
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Map Pool
          </TabsTrigger>
          <TabsTrigger value="h2h" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Head-to-Head
          </TabsTrigger>
          <TabsTrigger value="odds" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Odds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-4">
          <AiAnalysis match={match} />
        </TabsContent>

        <TabsContent value="maps" className="mt-4">
          <MapPoolComparison match={match} />
        </TabsContent>

        <TabsContent value="h2h" className="mt-4">
          <HeadToHead match={match} />
        </TabsContent>

        <TabsContent value="odds" className="mt-4">
          <OddsComparison match={match} />
        </TabsContent>
      </Tabs>

      <Button
        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onGenerateReport}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
            Gerando Relatório...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            GERAR RELATÓRIO IA PRO
          </>
        )}
      </Button>

      {report && (
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Relatório Synapse
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report}</p>
        </Card>
      )}
    </div>
  );
}

function RecentForm({ form }) {
  if (!form || form.length === 0) {
    return (
      <div className="flex items-center justify-center gap-1 mt-3">
        <span className="text-xs text-muted-foreground">Forma: N/A</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-3">
      <span className="text-xs text-muted-foreground mr-2">Forma:</span>
      {form.map((result, i) => (
        <span
          key={i}
          className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
            result === "W"
              ? "bg-success/20 text-success"
              : result === "L"
                ? "bg-destructive/20 text-destructive"
                : "bg-warning/20 text-warning"
          }`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}

function ConfidenceBadge({ confidence }) {
  if (confidence >= 80) {
    return <Badge className="bg-success/20 text-success border-success/30">Alta</Badge>;
  }
  if (confidence >= 60) {
    return <Badge className="bg-warning/20 text-warning border-warning/30">Média</Badge>;
  }
  return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Baixa</Badge>;
}

function OddsComparison({ match }) {
  const impliedProbA = ((1 / match.odds.teamA) * 100).toFixed(1);
  const impliedProbB = ((1 / match.odds.teamB) * 100).toFixed(1);
  const valueA = match.prediction.teamA - Number.parseFloat(impliedProbA);
  const valueB = match.prediction.teamB - Number.parseFloat(impliedProbB);

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Comparação de Odds
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="font-medium text-foreground">{match.teamA.name}</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Odd:</span>
            <span className="font-mono text-foreground">{Number(match.odds.teamA).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prob. Implícita:</span>
            <span className="font-mono text-foreground">{impliedProbA}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Previsão IA:</span>
            <span className="font-mono text-foreground">{match.prediction.teamA}%</span>
          </div>
          <div
            className={`flex justify-between text-sm p-2 rounded ${valueA > 0 ? "bg-success/10" : "bg-destructive/10"}`}
          >
            <span className="text-muted-foreground">Value:</span>
            <span className={`font-mono font-bold ${valueA > 0 ? "text-success" : "text-destructive"}`}>
              {valueA > 0 ? "+" : ""}
              {valueA.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-foreground">{match.teamB.name}</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Odd:</span>
            <span className="font-mono text-foreground">{Number(match.odds.teamB).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prob. Implícita:</span>
            <span className="font-mono text-foreground">{impliedProbB}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Previsão IA:</span>
            <span className="font-mono text-foreground">{match.prediction.teamB}%</span>
          </div>
          <div
            className={`flex justify-between text-sm p-2 rounded ${valueB > 0 ? "bg-success/10" : "bg-destructive/10"}`}
          >
            <span className="text-muted-foreground">Value:</span>
            <span className={`font-mono font-bold ${valueB > 0 ? "text-success" : "text-destructive"}`}>
              {valueB > 0 ? "+" : ""}
              {valueB.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {(valueA > 5 || valueB > 5) && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-success">Value Bet Detectado!</p>
            <p className="text-xs text-muted-foreground">
              {valueA > valueB ? match.teamA.name : match.teamB.name} oferece value de{" "}
              {Math.max(valueA, valueB).toFixed(1)}% segundo nossa análise.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
