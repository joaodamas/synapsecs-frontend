import { supabase } from '../supabaseClient';

export const Auth = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://synapsecs.com.br/dashboard' }
    });
    if (error) console.log('Erro no login:', error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-synapse-dark border border-white/10 rounded-2xl shadow-neon">
      <h2 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase">
        Acessar <span className="text-synapse-neon">SynapseCS</span>
      </h2>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 bg-white text-black font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
      >
        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
        Continuar com Google
      </button>

      <div className="mt-8 flex flex-col w-full gap-4">
        <input
          type="email"
          placeholder="E-mail"
          className="bg-black border border-white/20 p-3 rounded-lg text-white focus:border-synapse-neon outline-none"
        />
        <button className="bg-synapse-neon/10 border border-synapse-neon text-synapse-neon font-black py-3 rounded-lg hover:bg-synapse-neon hover:text-black transition-all">
          ENTRAR COM E-MAIL
        </button>
      </div>
    </div>
  );
};
