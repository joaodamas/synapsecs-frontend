import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const SupabaseAuth = ({ onSession }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      if (onSession) onSession(data.session ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (onSession) onSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [onSession]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <button
        onClick={handleLogin}
        className="rounded-full border border-synapse-neon/50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-synapse-neon transition hover:bg-synapse-neon hover:text-synapse-black"
      >
        Entrar
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-synapse-neon/50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-synapse-neon transition hover:bg-synapse-neon hover:text-synapse-black"
    >
      Sair
    </button>
  );
};

export default SupabaseAuth;
