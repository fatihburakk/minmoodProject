const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yviamqyfihdrghrpsqer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aWFtcXlmaWhkcmdocnBzcWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjM5NDMsImV4cCI6MjA2Mjc5OTk0M30._xtRRDTjc6ylhSwy1A1KNdiJVik7UEKw1UeBgPbjo8A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase }; 