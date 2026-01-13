import { HLTV } from 'hltv';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncRealData() {
  console.log('Iniciando Sincronizacao Real HLTV...');

  try {
    const matches = await HLTV.getMatches();
    const upcomingMatches = matches.filter((match) => match.team1 && match.team2).slice(0, 5);

    for (const match of upcomingMatches) {
      console.log(`Sincronizando: ${match.team1.name} vs ${match.team2.name}`);

      await supabase.from('matches').upsert({
        id: match.id,
        team_a_name: match.team1.name,
        team_b_name: match.team2.name,
        event_name: match.event?.name || 'Pro Tournament',
        match_date: new Date(match.date || Date.now()).toISOString(),
        prob_a: 50,
        status: 'upcoming'
      });
    }
    console.log('Dados reais injetados com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
  }
}

syncRealData();
