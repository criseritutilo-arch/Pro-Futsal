const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.example' }); // Wait, the actual keys are in the environment, not .env.example
