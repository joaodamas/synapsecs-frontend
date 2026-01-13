import { motion } from 'framer-motion';

const PricingCard = ({ title, price, features, isPro, onSelect }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-8 rounded-2xl border ${
      isPro ? 'border-synapse-neon shadow-neon bg-synapse-dark' : 'border-white/10 bg-black/40'
    } flex flex-col h-full`}
  >
    <h3
      className={`text-xl font-black uppercase tracking-tighter ${
        isPro ? 'text-synapse-neon' : 'text-white'
      }`}
    >
      {title}
    </h3>
    <div className="my-6">
      <span className="text-4xl font-black text-white">R$ {price}</span>
      <span className="text-synapse-gray text-xs">/mes</span>
    </div>
    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-synapse-gray">
          <svg
            className="w-4 h-4 mr-2 text-synapse-neon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button
      onClick={onSelect}
      className={`w-full py-3 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${
        isPro
          ? 'bg-synapse-neon text-black hover:scale-105'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {isPro ? 'Ativar Protocolo Pro' : 'Acesso Basico'}
    </button>
  </motion.div>
);

export const Pricing = ({ onUpgrade }) => {
  const handleUpgrade = () => {
    if (onUpgrade) onUpgrade();
    alert('Redirecionando para o Checkout Seguro...');
  };

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Planos de Acesso</h2>
        <p className="text-synapse-gray mt-2 font-mono text-xs">
          Aumente sua taxa de assertividade com dados neurais.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingCard
          title="Protocolo Free"
          price="0"
          features={[
            'Probabilidade de Vitoria',
            'Resultados em Tempo Real',
            'Lista de Jogos do Dia'
          ]}
        />
        <PricingCard
          title="Synapse Pro"
          price="49.90"
          isPro
          features={[
            'Analise Expert (Gemini AI)',
            'Comparacao Skill vs Skill',
            'Historico de Assertividade',
            'Alertas de Risco Baixo (Green)',
            'Suporte Prioritario'
          ]}
          onSelect={handleUpgrade}
        />
      </div>
    </div>
  );
};
