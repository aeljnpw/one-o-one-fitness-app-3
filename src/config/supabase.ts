import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aidzfhpmycwkybtlmjuo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZHpmaHBteWN3a3lidGxtanVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDc3OTYsImV4cCI6MjA2MzUyMzc5Nn0.-Frvn1w8SA9pgZ-vbVdjFP1LQ5hYU_9HGk-rowR_HK0';

const options = {
  auth: {
    storage: AsyncStorage,
    persistSession: false
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options); 