import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loadingIA, setLoadingIA] = useState(false);
  const [relatorio, setRelatorio] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true });

    setMatches(data || []);
    if (data?.length > 0) handleSelectMatch(data[0]);
  }

  async function handleSelectMatch(match) {
    setSelectedMatch(match);
    setRelatorio('');

    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('match_id', match.id);

    setPlayers(data || []);
  }

  const gerarAnaliseIA = async () => {
    if (!selectedMatch) return;
    setLoadingIA(true);
    setRelatorio('');

    try {
      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: { match: selectedMatch, players }
      });

      if (error) {
        throw error;
      }

      setRelatorio(data?.analysis || 'Sem resposta da IA.');
    } catch (error) {
      console.error('Erro Gemini:', error);
      setRelatorio('Erro ao processar análise neural. Verifique a conexão.');
    } finally {
      setLoadingIA(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans flex overflow-hidden">
      <aside className="w-72 bg-[#12161f] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent italic">
            SYNAPSEPRO 2026
          </h1>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {matches.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelectMatch(m)}
              className={`w-full p-4 text-left border-b border-gray-800/50 transition-all hover:bg-white/5 ${
                selectedMatch?.id === m.id ? 'bg-orange-600/10 border-r-4 border-r-orange-500' : ''
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">{m.event_name}</div>
              <div className="flex justify-between font-medium">
                <span>{m.team_a_name}</span>
                <span className="text-orange-500">vs</span>
                <span>{m.team_b_name}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-[#0b0e14] to-[#12161f]">
        {selectedMatch && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-[#1a1f2b] p-8 rounded-2xl border border-white/5 shadow-2xl">
              <div className="text-center w-1/3">
                <div className="text-3xl font-black mb-2">{selectedMatch.team_a_name}</div>
                <div className="text-4xl font-bold text-orange-500">{selectedMatch.prob_a}%</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Winrate Predito
                </div>
                <div className="h-1 w-32 bg-gray-700 mt-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${selectedMatch.prob_a}%` }}
                  />
                </div>
              </div>
              <div className="text-center w-1/3">
                <div className="text-3xl font-black mb-2">{selectedMatch.team_b_name}</div>
                <div className="text-4xl font-bold text-gray-400">
                  {100 - selectedMatch.prob_a}%
                </div>
              </div>
            </div>

            <button
              onClick={gerarAnaliseIA}
              disabled={loadingIA}
              className="w-full py-6 bg-gradient-to-r from-orange-600 via-red-600 to-red-700 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-orange-500/50 transition-all active:scale-95 disabled:opacity-50"
            >
              {loadingIA ? 'PROCESSANDO REDE NEURAL...' : 'GERAR RELATÓRIO IA PRO'}
            </button>

            {relatorio && (
              <div className="bg-[#1a1f2b] p-6 rounded-2xl border-l-4 border-orange-500 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  SYNAPSE INTELLIGENCE
                </h3>
                <p className="leading-relaxed text-gray-300 italic">"{relatorio}"</p>
              </div>
            )}
          </div>
        )}
      </main>

      <aside className="w-80 bg-[#0b0e14] border-l border-white/5 p-6 overflow-y-auto">
        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 italic">
          Lineups Oficiais
        </h2>

        <div className="space-y-8">
          <section>
            <h3 className="text-orange-500 font-black text-xs mb-3 uppercase flex justify-between">
              {selectedMatch?.team_a_name || 'Time A'}
              <span className="text-[9px] text-gray-600 italic">Lineup Ativa</span>
            </h3>
            <div className="space-y-2">
              {players
                .filter((p) => p.team_name === selectedMatch?.team_a_name)
                .map((p, i) => (
                  <div
                    key={`${p.player_name}-${i}`}
                    className="bg-[#1a1f2b] p-3 rounded-xl border border-white/5 flex justify-between items-center"
                  >
                    <span className="text-sm font-bold text-gray-200">{p.player_name}</span>
                    <span className="text-xs font-black text-green-400">{p.rating}</span>
                  </div>
                ))}
            </div>
          </section>

          <section>
            <h3 className="text-gray-400 font-black text-xs mb-3 uppercase flex justify-between">
              {selectedMatch?.team_b_name || 'Time B'}
              <span className="text-[9px] text-gray-600 italic">Lineup Ativa</span>
            </h3>
            <div className="space-y-2">
              {players
                .filter((p) => p.team_name === selectedMatch?.team_b_name)
                .map((p, i) => (
                  <div
                    key={`${p.player_name}-${i}`}
                    className="bg-[#1a1f2b] p-3 rounded-xl border border-white/5 flex justify-between items-center"
                  >
                    <span className="text-sm font-bold text-gray-200">{p.player_name}</span>
                    <span className="text-xs font-black text-gray-500">{p.rating}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
