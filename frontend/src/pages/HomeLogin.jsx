import React, { useState } from 'react';
import PlantVisual from '../components/PlantVisual';
import { Sprout } from 'lucide-react';
import { useAuth } from '../components/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

/**
 * HomeLogin serves as the entry page for users who are not yet
 * authenticated.  Previously this page offered OAuth sign-in
 * options (Google/GitHub).  The requirements now specify that
 * authentication should be performed with email and password only.
 *
 * Users can enter their email and password and click the "Log In"
 * button to authenticate via Supabase Auth.  A separate "Sign Up"
 * button navigates to the signup page where new users can create
 * accounts.  We preserve the left-hand illustration and overall
 * layout so the page retains the friendly look and feel.
 */
export default function HomeLogin() {
  const { signInWithEmail, loading } = useAuth();
  const navigate = useNavigate();

  // Local state for the login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Attempt to sign in with the provided email/password.  On
  // success, the auth state listener will trigger a redirect via
  // the Layout component.  We deliberately do not navigate here
  // to avoid duplicate redirects; Layout will check the auth state
  // and send the user to Dashboard or ProfileSetup as needed.  On
  // failure, display an error.
  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithEmail(email, password);
      // Do not call navigate here.  The Layout component
      // observes the auth state and performs the appropriate
      // redirect once loading is finished.  Triggering an
      // additional navigation here can cause a redirect loop.
    } catch (err) {
      console.error('Login failed', err);
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  // Show a loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left side: illustration and copy */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 aspect-square">
          <PlantVisual stage="SEED" showLabel={false} />
          <h3 className="text-2xl font-bold brand-ink mt-6 text-center">Grow With Us</h3>
          <p className="brand-muted text-center mt-2">
            TidyBloom helps you build positive habits by turning daily tasks into a beautiful, thriving virtual garden.
          </p>
        </div>

        {/* Right side: login form */}
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{
                  background: 'linear-gradient(to bottom, var(--color-primary) 68%, #D44A3A 68%, #B8392D 100%)',
                }}
              >
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold brand-ink font-brand">TidyBloom</h1>
            </div>
            <p className="brand-muted mt-2">Log in to start your journey of growth today.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium brand-ink mb-2 text-left">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium brand-ink mb-2 text-left">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {/* Login action */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Log In
            </button>
            {/* Sign up navigational action */}
            <button
              onClick={() => navigate('/Signup')}
              className="w-full bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
            <p className="text-xs text-center brand-muted mt-4">
              Secure authentication powered by Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}