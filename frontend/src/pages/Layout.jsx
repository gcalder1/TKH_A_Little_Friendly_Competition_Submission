
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sprout, User as UserIcon } from 'lucide-react';
import { useAuth } from '../components/hooks/useAuth';

export default function Layout({ children, currentPageName }) {
  const { user, signOut, loading } = useAuth();

  // Redirect logic based on auth state and current page
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    const publicPages = ['HomeLogin', 'About'];
    const protectedPages = ['Dashboard', 'TasksPage', 'TaskSelect', 'ProfileSetup'];
    
    if (!user && protectedPages.includes(currentPageName)) {
      window.location.href = createPageUrl('HomeLogin');
    } else if (user && currentPageName === 'HomeLogin') {
      // Check if user needs profile setup
      if (!user.user_metadata?.onboarding_complete) {
        window.location.href = createPageUrl('ProfileSetup');
      } else {
        window.location.href = createPageUrl('Dashboard');
      }
    }
  }, [user, loading, currentPageName]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = createPageUrl('HomeLogin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');
        
        :root {
          --color-primary: #00C49A;
          --color-xp: #FF6F61; 
          --color-complete: #FFF275;
          --color-accent: #B38BEB;
          --color-ink: #0B4C61;
          --color-muted: #80796B;
        }

        body {
          font-family: 'Lora', serif;
          background: linear-gradient(135deg, #f8fffe 0%, #f0fdf9 100%);
          min-height: 100vh;
        }

        .font-brand { font-family: 'Lora', serif; }
        .brand-primary { color: var(--color-primary); }
        .bg-brand-primary { background-color: var(--color-primary); }
        .border-brand-primary { border-color: var(--color-primary); }
        .brand-xp { color: var(--color-xp); }
        .bg-brand-xp { background-color: var(--color-xp); }
        .brand-complete { color: var(--color-complete); }
        .bg-brand-complete { background-color: var(--color-complete); }
        .brand-accent { color: var(--color-accent); }
        .bg-brand-accent { background-color: var(--color-accent); }
        .brand-ink { color: var(--color-ink); }
        .brand-muted { color: var(--color-muted); }

        .animate-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-4 py-3 md:px-8 md:py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to={createPageUrl(isAuthenticated ? 'Dashboard' : 'HomeLogin')} className="flex items-center gap-3 text-xl font-bold brand-ink">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(to bottom, var(--color-primary) 68%, #D44A3A 68%, #B8392D 100%)' }}
            >
                <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-brand text-2xl" style={{color: '#008080'}}>TidyBloom</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to={createPageUrl('About')} className="text-sm font-medium hover:brand-primary transition-colors brand-muted">
              About
            </Link>
            {isAuthenticated && (
              <Link to={createPageUrl('Dashboard')} className="text-sm font-medium hover:brand-primary transition-colors brand-muted">
                Home
              </Link>
            )}
            <Link to={createPageUrl('Contact')} className="text-sm font-medium hover:brand-primary transition-colors brand-muted">
              Contact
            </Link>
            <Link to={createPageUrl('Support')} className="text-sm font-medium hover:brand-primary transition-colors brand-muted">
              Support
            </Link>
            
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm font-medium brand-muted cursor-pointer hover:brand-primary transition-colors">
                Logout
              </button>
            ) : (
              <Link to={createPageUrl('HomeLogin')} className="text-sm font-medium brand-muted cursor-pointer hover:brand-primary transition-colors">
                Login / Sign Up
              </Link>
            )}
          </nav>

          <div className="md:hidden">
            <UserIcon className="w-5 h-5 brand-muted" />
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}
