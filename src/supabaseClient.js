import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'ERRO: Variaveis de ambiente do Supabase nao encontradas! ' +
      'Verifique se o arquivo .env.local existe na raiz do projeto e se as chaves ' +
      'comecam com VITE_.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
