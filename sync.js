import { HLTV } from 'hltv';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sync() {
  console.log('Iniciando IA SynapsePro...');
  try {
    const matches = await HLTV.getMatches();

    for (const match of matches.slice(0, 10)) {
      if (!match.team1 || !match.team2) continue;

      const rank1 = match.team1.id;
      const rank2 = match.team2.id;

      let probA = 50;
      if (rank1 < rank2) probA += 15;
      else probA -= 15;

      const { error } = await supabase.from('matches').upsert({
        id: match.id,
        team_a_name: match.team1.name,
        team_b_name: match.team2.name,
        event_name: match.event?.name || 'Pro League',
        prob_a: probA,
        prob_b: 100 - probA,
        status: 'upcoming',
        match_date: new Date(match.date || Date.now()).toISOString()
      });

      if (!error) {
        console.log(`Real Data: ${match.team1.name} (${probA}%) vs ${match.team2.name}`);
      }
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

sync();
