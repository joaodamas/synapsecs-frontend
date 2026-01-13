import { motion } from 'framer-motion';

const WinRateBadge = ({ matches, proDataById }) => {
  const finished = matches.filter(
    (match) => match.actual_winner && proDataById?.[match.id]?.vencedor_previsto
  );
  const hits = finished.filter(
    (match) =>
      match.actual_winner === proDataById?.[match.id]?.vencedor_previsto
  ).length;
  const rate = finished.length > 0 ? ((hits / finished.length) * 100).toFixed(0) : 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-synapse-dark border border-synapse-neon/30 p-4 rounded-xl mb-10 flex items-center justify-between"
    >
      <div>
        <h4 className="text-synapse-gray text-[10px] uppercase tracking-widest">
          AI Accuracy (Last 10)
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-synapse-neon">{rate}%</span>
          <span className="text-xs text-synapse-gray font-mono">SUCCESS RATE</span>
        </div>
      </div>
      <div className="flex gap-1">
        {finished.slice(0, 10).map((match, index) => (
          <div
            key={`${match.id}-${index}`}
            className={`w-2 h-6 rounded-sm ${
              match.actual_winner === proDataById?.[match.id]?.vencedor_previsto
                ? 'bg-synapse-neon'
                : 'bg-red-600'
            }`}
            title={
              match.actual_winner === proDataById?.[match.id]?.vencedor_previsto
                ? 'Hit'
                : 'Miss'
            }
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WinRateBadge;
