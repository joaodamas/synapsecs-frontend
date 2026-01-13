import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Map, Activity, Zap, Users, Star } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [mapPool, setMapPool] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar partidas:', error);
        setLoading(false);
        return;
      }

      setMatches(data ?? []);
      if (data?.length) setSelectedMatch(data[0]);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedMatch?.id) {
        setMapPool([]);
        setPlayers([]);
        return;
      }

      const { data: mapData, error: mapError } = await supabase
        .from('map_pool')
        .select('*')
        .eq('match_id', selectedMatch.id)
        .order('map_name', { ascending: true });

      if (mapError) {
        console.error('Erro ao carregar map pool:', mapError);
      } else {
        setMapPool(mapData ?? []);
      }

      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('match_id', selectedMatch.id)
        .order('rating', { ascending: false })
        .limit(10);

      if (playerError) {
        console.error('Erro ao carregar players:', playerError);
      } else {
        setPlayers(playerData ?? []);
      }
    };

    fetchDetails();
  }, [selectedMatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-500 font-black animate-pulse uppercase italic">
          Carregando Protocolos de IA...
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-orange-500 font-bold animate-pulse uppercase tracking-widest">
          Sincronizando Sistema Tatico...
        </p>
      </div>
    );
  }

  const probA = selectedMatch?.prob_a ?? 0;
  const probB = selectedMatch?.prob_b ?? 0;
  const teamA = selectedMatch?.team_a_name ?? 'TBD';
  const teamB = selectedMatch?.team_b_name ?? 'TBD';

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans">
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black italic tracking-tighter">
            SYNAPSE<span className="text-orange-500">PRO</span>
          </span>
          <nav className="flex gap-6">
            <button className="text-xs font-bold uppercase tracking-widest text-orange-500 border-b-2 border-orange-500 py-5">
              Previsoes
            </button>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white py-5 transition-all">
              Historico
            </button>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white py-5 transition-all">
              Map Pool Global
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Status do Sistema</p>
            <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> IA Online
              (HLTV Sync)
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-500 tracking-[0.2em] px-2">
            Proximas Partidas
          </h3>
          <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`bg-[#16161a] border border-white/5 p-4 hover:border-orange-500/30 cursor-pointer transition-all group ${
                  match.is_br ? 'border-l-4 border-l-yellow-500' : ''
                }`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                    {match.event_name ?? 'Evento'}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-black text-orange-500 italic">
                    {match.is_br && <Star size={10} className="text-yellow-500" />}
                    BO3
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`font-black text-sm uppercase italic group-hover:text-orange-500 transition-colors ${
                      match.is_br ? 'text-yellow-500' : ''
                    }`}
                  >
                    {match.team_a_name ?? 'TBD'}
                  </span>
                  <span className="text-[10px] text-gray-600 font-bold">VS</span>
                  <span
                    className={`font-black text-sm uppercase italic ${
                      match.is_br ? 'text-yellow-500' : ''
                    }`}
                  >
                    {match.team_b_name ?? 'TBD'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-[#16161a] to-[#0a0a0c] border border-orange-500/20 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap size={120} className="text-orange-500" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14} /> Analise Preditiva em Tempo Real
              </h2>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-4xl font-black italic uppercase tracking-tighter">{teamA}</p>
                  <p className="text-sm font-bold text-gray-500">Probabilidade de Vitoria</p>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-t from-orange-600 to-red-500">
                    {selectedMatch ? `${selectedMatch.prob_a}%` : '---'}
                  </p>
                </div>
              </div>
              <div className="w-full h-2 bg-white/5 mt-6 flex overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                  style={{ width: `${probA}%` }}
                />
                <div className="h-full bg-gray-800" style={{ width: `${100 - probA}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-[#16161a] border border-white/5 p-6">
            <h3 className="text-xs font-black uppercase text-gray-400 mb-6 flex items-center gap-2">
              <Map size={14} className="text-orange-500" /> Comparacao de Map Pool (Winrate)
            </h3>
            <div className="space-y-4">
              {mapPool.length === 0 && (
                <p className="text-xs text-gray-500">Sem dados de map pool.</p>
              )}
              {mapPool.map((map) => {
                const total = (map.winrate_a ?? 0) + (map.winrate_b ?? 0);
                const pctA = total ? Math.round((map.winrate_a / total) * 100) : 50;
                const pctB = 100 - pctA;
                return (
                  <div key={map.map_name} className="grid grid-cols-12 items-center gap-4">
                    <span className="col-span-2 text-[10px] font-bold text-gray-500 uppercase">
                      {map.map_name}
                    </span>
                    <div className="col-span-4 h-1.5 bg-orange-600/20 rounded-full flex justify-end">
                      <div className="h-full bg-orange-500" style={{ width: `${pctA}%` }} />
                    </div>
                    <span className="col-span-2 text-[10px] font-black text-center italic">VS</span>
                    <div className="col-span-4 h-1.5 bg-red-600/20 rounded-full">
                      <div className="h-full bg-red-600" style={{ width: `${pctB}%` }} />
                    </div>
                    <div className="col-span-12 text-[10px] font-bold text-gray-500">
                      {map.winrate_a ?? 0}% vs {map.winrate_b ?? 0}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-3 space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          <div className="bg-[#16161a] border border-white/5 p-4">
            <h3 className="text-[10px] font-black uppercase text-orange-500 mb-4 tracking-widest flex items-center gap-2">
              <Users size={14} /> Elenco & Performance
            </h3>

            {players.length === 0 && (
              <p className="text-xs text-gray-500">
                Dados de jogadores indisponiveis para este confronto.
              </p>
            )}

            {[teamA, teamB].map((team, idx) => (
              <div key={team} className={idx === 1 ? 'mt-8' : ''}>
                <div
                  className={`text-xs font-black uppercase italic mb-3 p-1 border-l-2 ${
                    idx === 0 ? 'border-orange-500 text-white' : 'border-red-600 text-white'
                  }`}
                >
                  {team}
                </div>
                <div className="space-y-2">
                  {players
                    .filter((player) => player.team_name === team)
                    .slice(0, 5)
                    .map((player) => (
                      <div
                        key={`${player.player_name}-${team}`}
                        className="bg-black/40 p-2 border border-white/5 flex justify-between items-center group hover:border-white/20"
                      >
                        <div>
                          <p className="text-sm font-black italic uppercase group-hover:text-orange-500 transition-colors">
                            {player.player_name}
                          </p>
                          <p className="text-[9px] text-gray-500 font-bold">
                            KAST: {player.kast ?? 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-white">
                            {player.rating ?? 'N/A'}
                          </p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold">Rating</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

function StatRow({ label, valA, valB }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
      <span className="text-orange-500">{valA}</span>
      <span className="text-gray-600 font-black">{label}</span>
      <span className="text-red-500">{valB}</span>
    </div>
  );
}
