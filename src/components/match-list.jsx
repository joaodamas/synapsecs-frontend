import { cn } from "@/lib/utils";

export function MatchList({ matches, selectedMatch, onSelectMatch }) {
  return (
    <div className="h-[calc(100vh-73px)] overflow-y-auto">
      {matches.map((match) => (
        <button
          key={match.id}
          onClick={() => onSelectMatch(match)}
          className={cn(
            "w-full text-left px-4 py-3 border-l-2 border-transparent hover:bg-secondary/50 transition-colors",
            selectedMatch.id === match.id && "border-l-primary bg-secondary/30"
          )}
        >
          <p className="text-xs text-muted-foreground mb-1">{match.tournament}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{match.teamA.name}</span>
            <span className="text-xs text-primary font-bold">vs</span>
            <span className="text-sm font-medium text-foreground">{match.teamB.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
