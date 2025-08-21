import React from 'react';
import PlantVisual from '../components/PlantVisual';
import { Sprout } from 'lucide-react';
import { useAuth } from '../components/hooks/useAuth';

export default function HomeLogin() {
    const { signInWithGoogle, signInWithGitHub, loading } = useAuth();

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Google login failed", error);
            alert("Login failed. Please try again.");
        }
    };

    const handleGitHubLogin = async () => {
        try {
            await signInWithGitHub();
        } catch (error) {
            console.error("GitHub login failed", error);
            alert("Login failed. Please try again.");
        }
    };

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
                
                <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 aspect-square">
                    <PlantVisual stage="SEED" showLabel={false} />
                    <h3 className="text-2xl font-bold brand-ink mt-6 text-center">Grow With Us</h3>
                    <p className="brand-muted text-center mt-2">TidyBloom helps you build positive habits by turning daily tasks into a beautiful, thriving virtual garden.</p>
                </div>

                <div className="w-full max-w-md text-center">
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div 
                                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                                style={{ background: 'linear-gradient(to bottom, var(--color-primary) 68%, #D44A3A 68%, #B8392D 100%)' }}
                            >
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold brand-ink font-brand">TidyBloom</h1>
                        </div>
                        <p className="brand-muted mt-2">Log in or sign up to start your journey of growth today.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            Continue with Google
                        </button>
                        
                        <button
                            onClick={handleGitHubLogin}
                            disabled={loading}
                            className="w-full bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            Continue with GitHub
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