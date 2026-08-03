const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://nhqtsrxvugsumsthciaq.supabase.co', 'sb_publishable_JMBayuwGJRQ_phrkdCX4MA_DJpP_YCo');
async function run() {
  const { data, error } = await supabase.from('exercises').select('*');
  console.log('Exercises:', data);
  console.log('Error:', error);
}
run();
