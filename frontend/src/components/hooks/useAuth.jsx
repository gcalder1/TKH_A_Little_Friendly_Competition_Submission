import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---------- Sign in with OAuth ----------
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) throw error;
  };

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) throw error;
  };

  // ---------- Email/Password ----------
  const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // ---------- Sign out ----------
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // ---------- Update Profile ----------
  const updateProfile = async (userData) => {
    try {
      // Update user metadata in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });
      if (error) throw error;

      // Also update user profile in DB if needed
      if (user) {
        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            ...userData,
            updated_at: new Date().toISOString()
          });
        if (dbError) throw dbError;
      }

      return data.user;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    updateProfile,
  };
}
