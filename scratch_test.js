import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dwnhncekarxmtkrdffrt.supabase.co';
const supabaseAnonKey = 'sb_publishable_Bk0Cj-GeTPcOgteXMpclGA_vaeKfF7I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runDiagnostics() {
  console.log('--- Supabase Database Diagnostics ---');
  
  // 1. Fetch some profiles to see the schema column names
  console.log('\n1. Fetching a profile to examine fields...');
  const { data: profiles, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (selectError) {
    console.error('❌ Error fetching profiles:', selectError);
  } else {
    console.log('✅ Successfully connected to profiles.');
    if (profiles && profiles.length > 0) {
      console.log('Sample profile fields:', Object.keys(profiles[0]));
      console.log('Sample data:', profiles[0]);
    } else {
      console.log('No profiles found in the database yet (table is empty).');
    }
  }

  // 2. Try a dummy insert with all standard fields to see what constraint fails!
  console.log('\n2. Attempting a simulated insert into profiles table...');
  const dummyId = '11111111-1111-1111-1111-111111111111';
  const { error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: dummyId,
      email: 'diagnostics@corepulse.com',
      full_name: 'Diagnostics User',
      role: 'user',
      is_active: true
    });

  if (insertError) {
    console.error('❌ Insert failed! Database returned error:', insertError);
  } else {
    console.log('✅ Insert succeeded (dummy record created)!');
    // Clean up
    await supabase.from('profiles').delete().eq('id', dummyId);
  }
}

runDiagnostics();
