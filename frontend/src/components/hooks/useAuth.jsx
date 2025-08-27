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
  // OAuth sign-in methods (Google, GitHub) have been removed from the
  // authentication API.  Users should log in via email/password
  // instead.  If you reintroduce OAuth providers in the future,
  // re-add the corresponding functions here and update the UI as
  // needed.
  const signInWithGoogle = async () => {
    throw new Error('Google sign-in has been disabled.');
  };

  const signInWithGitHub = async () => {
    throw new Error('GitHub sign-in has been disabled.');
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

      // We no longer update the Supabase "users" table directly.  All
      // application-specific user data (e.g. username, onboarding
      // status) should be persisted via the Express API using the
      // internal user ID.  The profile fields stored in the Supabase
      // Auth metadata are sufficient for JWT claims and can be
      // accessed in the frontend via `session.user.user_metadata`.
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
