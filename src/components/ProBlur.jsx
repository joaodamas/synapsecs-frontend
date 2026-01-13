const ProBlur = ({ children, isPro, onUpgrade }) => {
  if (isPro) return children;

  return (
    <div className="relative group cursor-pointer">
      <div className="filter blur-md select-none pointer-events-none opacity-30">
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-synapse-black/40 border border-synapse-neon/20 rounded-xl transition-all group-hover:bg-synapse-black/60">
        <svg className="w-8 h-8 text-synapse-neon mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-synapse-neon font-black text-[10px] tracking-[0.2em] uppercase">
          Unlock Synapse PRO
        </p>
        <button
          onClick={(event) => {
            event.stopPropagation();
            if (onUpgrade) onUpgrade();
          }}
          className="mt-2 bg-synapse-neon text-black text-[10px] font-bold py-1 px-4 rounded-full hover:scale-105 transition-transform"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default ProBlur;
