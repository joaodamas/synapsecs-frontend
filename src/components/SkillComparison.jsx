import { motion } from 'framer-motion';

const SkillRow = ({ label, valA, valB }) => {
  const safeA = Number(valA) || 0;
  const safeB = Number(valB) || 0;
  const total = safeA + safeB;
  const pctA = total === 0 ? 50 : (safeA / total) * 100;

  return (
    <div className="group mb-5">
      <div className="flex justify-between items-center mb-1.5 px-1">
        <span className="text-[11px] font-black text-synapse-neon group-hover:scale-110 transition-transform">
          {safeA}
        </span>
        <span className="text-[9px] font-bold text-synapse-gray uppercase tracking-[0.2em]">
          {label}
        </span>
        <span className="text-[11px] font-black text-white group-hover:scale-110 transition-transform">
          {safeB}
        </span>
      </div>

      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex p-[1px]">
        <div className="h-full w-1/2 flex justify-end">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pctA}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-synapse-neon shadow-[0_0_12px_#39FF14]"
          />
        </div>
        <div className="w-[2px] h-full bg-synapse-black z-10" />
        <div className="h-full w-1/2 flex justify-start">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${100 - pctA}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default SkillRow;
