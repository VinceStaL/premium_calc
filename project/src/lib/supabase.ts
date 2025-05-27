import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add better error handling and logging for environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  throw new Error('Missing Supabase URL configuration');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Missing Supabase Anon Key configuration');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage,
    flowType: 'pkce',
    // Use the actual site URL for redirects
    redirectTo: window.location.origin
  },
  global: {
    headers: {
      'x-application-name': 'product-rate-manager'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Enhanced connection health check with retries
export const checkSupabaseConnection = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      if (!error) {
        console.log('Supabase connection test successful');
        return true;
      }
      console.warn(`Connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed with error:`, err);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to establish Supabase connection after', retries, 'attempts');
  return false;
};

// Export auth-related helper functions with improved error handling
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
    console.log('Successfully signed out');
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
    throw err;
  }
};

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      throw error;
    }
    return session;
  } catch (err) {
    console.error('Unexpected error getting session:', err);
    throw err;
  }
};

// Initialize connection check on module load
checkSupabaseConnection().then(isConnected => {
  if (!isConnected) {
    console.error('Failed to establish initial Supabase connection');
  }
});