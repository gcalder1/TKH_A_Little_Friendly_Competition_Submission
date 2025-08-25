import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
// Use the shared Supabase client directly.  We do not use the
// useAuth hook here because sign up happens before the auth state
// listener is triggered.
import { supabase } from '@/api/supabaseClient';
import { createBackendClient } from '@/api/backendClient';

/**
 * Signup page for new users.  Users provide a username, email and
 * password.  On submit we register them with Supabase Auth and then
 * create a corresponding record in our app's user table via the
 * Express API.  Once both operations succeed, the user is
 * redirected to their dashboard.  If Supabase requires email
 * confirmation, the session may not be available immediately; in
 * that case the user will still be redirected and asked to verify
 * their email.
 */
export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (formData) => {
    const { username, email, password } = formData;
    setLoading(true);
    setError(null);
    try {
      // Step 1: Sign up via Supabase Auth.  We include the username
      // in the user metadata so it can be retrieved later.  The
      // returned `data` object contains the new user and a session
      // if email verification is disabled.  If verification is
      // enabled, `data.session` will be null until the user
      // confirms their email.
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (signUpError) throw signUpError;

      const authUser = signUpData?.user;
      if (!authUser) {
        throw new Error('No user returned from sign up');
      }

      // Step 2: Retrieve the JWT from the current session (if it
      // exists).  We need the token to authenticate the call to
      // our backend.  If the session is null (for example, when
      // email confirmations are enabled), we proceed without a
      // token; our backend should allow unauthenticated creation
      // of the initial user record in this case.  You can adjust
      // your backend middleware accordingly.
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      const api = createBackendClient(accessToken);

      // Step 3: Create the user record in our own DB.  We pass
      // authId, email and username.  The backend will generate the
      // app-specific user id and return the created user.  Note
      // that we ignore the response here; the dashboard page will
      // fetch fresh data.
      // Create the user record in our own DB.  We pass
      // authId, email and username.  Capture the returned user so we
      // can persist the internal user ID for subsequent API calls.
      const { data: createdUser } = await api.post('/users/create', {
        authId: authUser.id,
        email: authUser.email,
        username,
      });

      // Store the internal app user ID in localStorage.  This ID
      // corresponds to the User model's primary key and is required
      // when calling endpoints such as /users/:id and /plants/:id.
      if (createdUser?.id) {
        localStorage.setItem('appUserId', createdUser.id);
      }

      // Redirect to dashboard.  The Dashboard component will
      // automatically create a starter plant if none exist and
      // display tasks and XP events.  If email verification is
      // required, the user may need to confirm their email before
      // seeing protected content.
      navigate('/Dashboard');
    } catch (err) {
      console.error('Sign up failed:', err);
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 aspect-square">
          <Sprout className="w-16 h-16 text-brand-primary mb-4" />
          <h3 className="text-2xl font-bold brand-ink mt-2 text-center">Join TidyBloom</h3>
          <p className="brand-muted text-center mt-2">Create an account to start growing your virtual garden and track your daily accomplishments.</p>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold brand-ink">Sign Up</h1>
            <p className="brand-muted mt-2">Enter your details to create an account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium brand-ink mb-2">
                Username
              </label>
              <input
                id="username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 2, message: 'Username must be at least 2 characters' },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Enter your username"
                disabled={loading}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium brand-ink mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium brand-ink mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}