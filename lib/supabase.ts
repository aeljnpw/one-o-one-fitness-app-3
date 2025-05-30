// lib/supabase.ts
import 'react-native-url-polyfill/auto'; // Ensures URL is available globally
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Assuming this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ensure your Supabase URL and Anon Key are strings
const supabaseUrl = "https://aidzfhpmycwkybtlmjuo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZHpmaHBteWN3a3lidGxtanVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDc3OTYsImV4cCI6MjA2MzUyMzc5Nn0.-Frvn1w8SA9pgZ-vbVdjFP1LQ5hYU_9HGk-rowR_HK0";

// Validate that the URL and key are not undefined or empty, which can happen if .env variables are not loaded
if (!supabaseUrl) {
  console.error("Supabase URL is not defined. Check your environment variables or configuration.");
  // You might want to throw an error here or handle it appropriately
}

if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is not defined. Check your environment variables or configuration.");
  // You might want to throw an error here or handle it appropriately
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage, // Use AsyncStorage for React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native, as there's no URL session detection
  },
  // Optional: Specify global fetch for React Native if needed, though usually not required with modern supabase-js
  // global: {
  //   fetch: fetch,
  // },
});

// It's good practice to also ensure 'react-native-get-random-values' is imported
// at the very top of your app's entry point (e.g., App.tsx or your root _layout.tsx)
// import 'react-native-get-random-values';
// This is often needed for crypto polyfills that Supabase might rely on.
// You already have this in your app/_layout.tsx which is good.
