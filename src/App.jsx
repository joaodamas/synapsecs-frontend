import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient';
import SkillRow from './components/SkillComparison';
import WinRateBadge from './components/WinRateBadge';
import ProBlur from './components/ProBlur';
import { Pricing } from './components/Pricing';
import SupabaseAuth from './components/SupabaseAuth';

function formatMatchDate(value) {
  if (!value) return 'Data indefinida';
  if (value.toDate) return value.toDate().toLocaleString('pt-BR');
  return new Date(value).toLocaleString('pt-BR');
}

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proDataById, setProDataById] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [session, setSession] = useState(null);

  const trackMatchClick = (matchName) => {
    console.log('view_match_details', { matchName, timestamp: Date.now() });
  };

  const trackProClick = (feature) => {
    console.log('click_upgrade_pro', { feature });
  };

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: false })
        .limit(5);

      if (fetchError) {
        console.error('Erro ao carregar partidas:', fetchError);
        setError('Nao foi possivel carregar as partidas. Tente novamente.');
      } else {
        setMatches(data ?? []);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setIsPro(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        setIsPro(false);
        return;
      }

      setIsPro(data?.plan === 'pro');
    };

    fetchProfile();
  }, [session]);

  useEffect(() => {
    if (!isPro || matches.length === 0) {
      setProDataById({});
      return;
    }

    const fetchPro = async () => {
      const ids = matches.map((match) => match.id);
      const { data, error: proError } = await supabase
        .from('matches_pro')
        .select('*')
        .in('id', ids);

      if (proError) {
        console.error('Erro ao carregar dados Pro:', proError);
        return;
      }

      const map = (data ?? []).reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
      }, {});
      setProDataById(map);
    };

    fetchPro();
  }, [matches, isPro]);

  const getTeamName = (team) => (typeof team === 'string' ? team : team?.name ?? 'Time');

  const handleFetchAndPredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/synapse-pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao solicitar previsao');
      }
      alert('Nova previsao solicitada! Recarregando partidas...');
    } catch (err) {
      console.error('Erro ao chamar pipeline:', err);
      setError('Erro ao solicitar nova previsao.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-synapse-black text-white">
        Carregando previsoes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-synapse-black text-synapse-neon">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-synapse-black text-white font-display">
      <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-synapse-neon/15 blur-3xl animate-float" />
      <div className="absolute top-24 -right-16 h-80 w-80 rounded-full bg-synapse-neon/10 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-synapse-neon/10 blur-3xl animate-float" />

      <div className="relative z-10 px-6 py-10 lg:px-16">
        <header className="flex flex-col gap-6 border-b border-synapse-dark pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-synapse-gray">CS2 ANALYTICS</p>
            <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">
              SynapseCS <span className="text-synapse-neon">AI</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-synapse-gray">
              SynapseCS: Onde o processamento neural encontra a estrategia de elite.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleFetchAndPredict}
              className="rounded-full bg-synapse-neon px-6 py-3 text-sm font-semibold uppercase tracking-wide text-synapse-black shadow-neon transition hover:bg-synapse-neon/80"
              disabled={loading}
            >
              {loading ? 'Gerando...' : 'Gerar nova previsao'}
            </button>
            <SupabaseAuth onSession={setSession} />
          </div>
        </header>

        <main className="mt-10 animate-fadeUp">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Proximas partidas e analises</h2>
              <p className="mt-1 text-sm text-synapse-gray">
                Dados recentes com previsoes geradas pelo motor de IA.
              </p>
            </div>
            <div className="text-sm text-synapse-gray font-mono">
              Ultima atualizacao: {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>

          <WinRateBadge matches={matches} proDataById={proDataById} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match, index) => {
              const proData = proDataById[match.id];
              const teamAName = getTeamName(match.team_a_name ?? match.team_a);
              const teamBName = getTeamName(match.team_b_name ?? match.team_b);
              const probA = match.prob_a ?? match.probabilidades?.a ?? 0;
              const probB = match.prob_b ?? match.probabilidades?.b ?? 0;

              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex h-full flex-col rounded-2xl border bg-synapse-dark/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 ${
                    match.status === 'finished'
                      ? match.actual_winner && proData?.vencedor_previsto
                        ? match.actual_winner === proData.vencedor_previsto
                          ? 'border-synapse-neon'
                          : 'border-red-600'
                        : 'border-synapse-dark'
                      : 'border-synapse-dark hover:border-synapse-neon/60'
                  }`}
                  onClick={() => trackMatchClick(`${teamAName} vs ${teamBName}`)}
                >
                  <div className="bg-synapse-dark border border-white/5 rounded-2xl p-6 shadow-neon relative overflow-hidden">
                    {match.status === 'finished' && proData?.vencedor_previsto && (
                      <div
                        className={`absolute top-0 left-0 text-black text-[10px] font-black px-3 py-1 rounded-br-lg uppercase ${
                          match.actual_winner === proData?.vencedor_previsto
                            ? 'bg-synapse-neon'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {match.actual_winner === proData?.vencedor_previsto
                          ? 'IA predicted correctly'
                          : 'IA missed'}
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-synapse-neon text-black text-[10px] font-black px-4 py-1 rounded-bl-lg uppercase">
                      Confidence: {proData?.confianca ?? proData?.confianca_porcentagem ?? 0}%
                    </div>

                    <div className="flex justify-between items-center mt-4 mb-8">
                      <div className="flex-1 text-center">
                        <h2 className="text-xl font-black text-white truncate">{teamAName}</h2>
                        <p className="text-synapse-neon font-mono text-sm">{probA}%</p>
                      </div>
                      <div className="px-4 font-black italic text-gray-700">VS</div>
                      <div className="flex-1 text-center">
                        <h2 className="text-xl font-black text-white truncate">{teamBName}</h2>
                        <p className="text-gray-400 font-mono text-sm">{probB}%</p>
                      </div>
                    </div>

                    <div className="text-xs uppercase tracking-[0.2em] text-synapse-gray">
                      {formatMatchDate(match.match_date)}
                    </div>

                    <ProBlur isPro={isPro} onUpgrade={() => trackProClick('expert_analysis')}>
                      <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5 mt-4">
                        <SkillRow
                          label="Aiming"
                          valA={proData?.mira_a ?? proData?.stats_comparativos?.mira?.a}
                          valB={proData?.mira_b ?? proData?.stats_comparativos?.mira?.b}
                        />
                        <SkillRow
                          label="Tactics"
                          valA={proData?.tatico_a ?? proData?.stats_comparativos?.tatico?.a}
                          valB={proData?.tatico_b ?? proData?.stats_comparativos?.tatico?.b}
                        />
                        <SkillRow
                          label="Utility"
                          valA={proData?.utility_a ?? proData?.stats_comparativos?.utility?.a}
                          valB={proData?.utility_b ?? proData?.stats_comparativos?.utility?.b}
                        />
                        <SkillRow
                          label="Clutch"
                          valA={proData?.mental_a ?? proData?.stats_comparativos?.mental?.a}
                          valB={proData?.mental_b ?? proData?.stats_comparativos?.mental?.b}
                        />
                      </div>

                      <div className="mt-6 border-l-2 border-synapse-neon pl-4">
                        <h4 className="text-[10px] font-bold text-synapse-neon uppercase tracking-tighter">
                          AI Analysis Output
                        </h4>
                        <p className="text-sm text-synapse-gray italic leading-snug mt-1">
                          &quot;{proData?.analise_expert ?? 'Sem analise no momento.'}&quot;
                        </p>
                      </div>
                    </ProBlur>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pricing onUpgrade={() => trackProClick('pricing')} />
        </main>
      </div>
    </div>
  );
}

export default App;
