import { motion } from 'framer-motion';
import { Calendar, Trophy } from 'lucide-react';

const matches = [
  {
    id: 1,
    teamA: 'FURIA',
    teamB: 'FaZe',
    time: '14:00',
    date: 'Hoje',
    tournament: 'IEM Chengdu',
    isBrazilian: true,
    oddsA: '2.10',
    oddsB: '1.75'
  },
  {
    id: 2,
    teamA: 'NAVI',
    teamB: 'G2',
    time: '17:30',
    date: 'Hoje',
    tournament: 'PGL Major',
    isBrazilian: false,
    oddsA: '1.90',
    oddsB: '1.90'
  },
  {
    id: 3,
    teamA: 'Imperial',
    teamB: 'MOUZ',
    time: '10:00',
    date: 'Amanha',
    tournament: 'IEM Chengdu',
    isBrazilian: true,
    oddsA: '3.40',
    oddsB: '1.30'
  },
  {
    id: 4,
    teamA: 'Vitality',
    teamB: 'Spirit',
    time: '13:00',
    date: 'Amanha',
    tournament: 'ESL Pro League',
    isBrazilian: false,
    oddsA: '2.20',
    oddsB: '1.65'
  }
];

const brazilTeams = new Set(['FURIA', 'Imperial']);

export default function MatchSchedule() {
  return (
    <section className="py-20 bg-[#0a0a0c]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Proximos <span className="text-orange-500">Confrontos</span>
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">
              Calendario de Elite
            </p>
          </div>
          <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" /> Brasil no Servidor
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {matches.map((match) => {
            const teamAIsBR = brazilTeams.has(match.teamA);
            const teamBIsBR = brazilTeams.has(match.teamB);

            return (
              <motion.div
                key={match.id}
                whileHover={{ x: 10 }}
                className={`relative overflow-hidden group bg-[#16161a] border-y border-r border-white/5 transition-all ${
                  match.isBrazilian
                    ? 'border-l-4 border-l-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                    : 'border-l-4 border-l-orange-600/50'
                }`}
              >
                {match.isBrazilian && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] -z-0" />
                )}

                <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6 relative z-10">
                  <div className="flex items-center gap-4 w-full md:w-1/4">
                    <div className="p-3 bg-black/40 rounded-sm">
                      <Trophy
                        className={`w-5 h-5 ${
                          match.isBrazilian ? 'text-yellow-500' : 'text-orange-500'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                        {match.tournament}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-bold text-gray-300">
                          {match.date} - {match.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-8 w-full md:w-2/4">
                    <div className="text-right w-full">
                      <span
                        className={`text-xl font-black uppercase italic tracking-tighter ${
                          teamAIsBR ? 'text-yellow-500' : 'text-white'
                        }`}
                      >
                        {match.teamA}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="px-4 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-[10px] font-black italic">
                        VS
                      </div>
                      <div className="mt-2 text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                        BO3
                      </div>
                    </div>

                    <div className="text-left w-full">
                      <span
                        className={`text-xl font-black uppercase italic tracking-tighter ${
                          teamBIsBR ? 'text-yellow-500' : 'text-white'
                        }`}
                      >
                        {match.teamB}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 w-full md:w-1/4">
                    <div className="flex gap-2">
                      <div className="bg-black/40 px-3 py-2 border border-white/5 rounded-sm">
                        <p className="text-[8px] text-gray-600 uppercase font-bold">Odd A</p>
                        <p className="text-sm font-mono font-bold text-orange-500">{match.oddsA}</p>
                      </div>
                      <div className="bg-black/40 px-3 py-2 border border-white/5 rounded-sm">
                        <p className="text-[8px] text-gray-600 uppercase font-bold">Odd B</p>
                        <p className="text-sm font-mono font-bold text-orange-500">{match.oddsB}</p>
                      </div>
                    </div>

                    <button
                      className={`px-6 py-3 font-black text-xs uppercase tracking-widest transition-all ${
                        match.isBrazilian
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                          : 'bg-white/5 text-white hover:bg-orange-600'
                      }`}
                    >
                      Analisar
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
