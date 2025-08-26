import { useState, useEffect } from 'react';
// Import the shared Supabase client from the central API folder. This
// avoids having multiple supabase instances and ensures that table
// names and configuration are consistent across the app.
import { supabase } from '@/api/supabaseClient';

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
  /**
   * Register a new user with email and password.  Optionally supply a
   * `username` which will be stored in the Supabase user metadata.  The
   * username is not used by Supabase Auth itself but allows us to
   * populate the app's user profile in one step.  The returned
   * `data` object contains the newly created user and session if
   * available.  Note: if email confirmations are enabled in your
   * Supabase project, `data.session` may be null until the user
   * completes the verification link.
   *
   * @param {string} email
   * @param {string} password
   * @param {string} [username]
   */
  const signUpWithEmail = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        // Attach the username to the user's metadata if provided.  If
        // username is undefined, omit the metadata to avoid storing
        // empty values in Auth.
        data: username ? { username } : undefined,
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
