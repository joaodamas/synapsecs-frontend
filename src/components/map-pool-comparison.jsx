import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Check, X, AlertCircle } from "lucide-react";

const allMaps = ["Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Vertigo", "Dust2", "Overpass"];

export function MapPoolComparison({ match }) {
  const contestedMaps = match.maps.teamA.filter((map) => match.maps.teamB.includes(map));
  const teamAExclusive = match.maps.teamA.filter((map) => !match.maps.teamB.includes(map));
  const teamBExclusive = match.maps.teamB.filter((map) => !match.maps.teamA.includes(map));

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          Map Pool Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-sm text-muted-foreground">Mapa</th>
                <th className="text-center py-2 text-sm text-muted-foreground">{match.teamA.name}</th>
                <th className="text-center py-2 text-sm text-muted-foreground">{match.teamB.name}</th>
                <th className="text-center py-2 text-sm text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {allMaps.map((map) => {
                const teamAHas = match.maps.teamA.includes(map);
                const teamBHas = match.maps.teamB.includes(map);
                const contested = teamAHas && teamBHas;

                return (
                  <tr key={map} className="border-b border-border/50 last:border-0">
                    <td className="py-3">
                      <span className="font-medium text-foreground">{map}</span>
                    </td>
                    <td className="text-center">
                      {teamAHas ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-destructive/50 mx-auto" />
                      )}
                    </td>
                    <td className="text-center">
                      {teamBHas ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-destructive/50 mx-auto" />
                      )}
                    </td>
                    <td className="text-center">
                      {contested ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          Disputado
                        </Badge>
                      ) : teamAHas ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {match.teamA.name.split(" ")[0]}
                        </Badge>
                      ) : teamBHas ? (
                        <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
                          {match.teamB.name.split(" ")[0]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Neutro</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Previsão de Veto</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamAExclusive.length > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Vantagem {match.teamA.name}</p>
              <div className="flex flex-wrap gap-1">
                {teamAExclusive.map((map) => (
                  <Badge key={map} className="bg-primary/20 text-primary border-0">
                    {map}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {contestedMaps.length > 0 && (
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-xs text-muted-foreground mb-1">Mapas Disputados</p>
              <div className="flex flex-wrap gap-1">
                {contestedMaps.map((map) => (
                  <Badge key={map} className="bg-warning/20 text-warning border-0">
                    {map}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {teamBExclusive.length > 0 && (
            <div className="p-3 bg-chart-2/10 rounded-lg border border-chart-2/20">
              <p className="text-xs text-muted-foreground mb-1">Vantagem {match.teamB.name}</p>
              <div className="flex flex-wrap gap-1">
                {teamBExclusive.map((map) => (
                  <Badge key={map} className="bg-chart-2/20 text-chart-2 border-0">
                    {map}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {match.format === "BO1" && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-destructive">Atenção:</span> Em BO1, o mapa jogado terá grande impacto
              no resultado. O veto será crucial.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
