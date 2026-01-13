import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { X, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        alert('Verifique seu e-mail para confirmar o cadastro!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#16161a] border border-orange-500/30 p-8 shadow-[0_0_50px_rgba(255,107,0,0.1)]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            {isRegister ? 'Recrutamento' : 'Acesso ao Sistema'}
          </h2>
          <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-2">
            SynapseCS Intelligence
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="email"
              placeholder="E-MAIL"
              className="w-full bg-black border border-white/10 p-3 pl-10 text-sm focus:border-orange-500 outline-none transition-all"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="password"
              placeholder="SENHA"
              className="w-full bg-black border border-white/10 p-3 pl-10 text-sm focus:border-orange-500 outline-none transition-all"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-4 font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all flex justify-center items-center gap-2"
          >
            {loading
              ? 'PROCESSANDO...'
              : isRegister
                ? (
                  <>
                    <UserPlus size={18} /> CRIAR CONTA
                  </>
                )
                : (
                  <>
                    <LogIn size={18} /> ENTRAR
                  </>
                )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gray-500 hover:text-orange-500 uppercase font-bold tracking-widest transition-colors"
          >
            {isRegister ? 'Ja possui acesso? Clique aqui' : 'Nao tem conta? Registre-se'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
