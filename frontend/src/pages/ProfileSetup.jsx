import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createPageUrl } from '@/utils';
import { Sprout, User as UserIcon } from 'lucide-react';
import { useAuth } from '../components/hooks/useAuth';
// Use the centrally defined Supabase client rather than the local copy.
import { supabase } from '@/api/supabaseClient';
import PlantVisual from '../components/PlantVisual';

export default function ProfileSetup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, updateProfile } = useAuth();

    useEffect(() => {
        const checkUserAndRedirect = async () => {
            if (!user) {
                window.location.href = createPageUrl('HomeLogin');
                return;
            }
            
            // Check if user already has profile setup completed
            try {
                const { data: profile } = await supabase
                    .from('users')
                    .select('onboarding_complete')
                    .eq('id', user.id)
                    .single();
                
                if (profile?.onboarding_complete) {
                    window.location.href = createPageUrl('Dashboard');
                }
            } catch (error) {
                console.error('Error checking profile:', error);
            }
        };
        
        if (user !== null) {
            checkUserAndRedirect();
        }
    }, [user]);

    const onSubmit = async (data) => {
        try {
            // Update user profile in Supabase database
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    username: data.username,
                    full_name: user.user_metadata?.full_name || user.email,
                    email: user.email,
                    onboarding_complete: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            // Also update auth metadata
            await updateProfile({
                username: data.username,
                onboarding_complete: true
            });

            window.location.href = createPageUrl('Dashboard');
        } catch (error) {
            console.error("Failed to update user profile:", error);
            alert("Failed to save profile. Please try again.");
        }
    };

    if (!user) {
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
                    <h3 className="text-2xl font-bold brand-ink mt-6 text-center">Your Journey Begins</h3>
                    <p className="brand-muted text-center mt-2">Set up your profile to start growing your virtual garden through daily accomplishments.</p>
                </div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div 
                                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                                style={{ background: 'linear-gradient(to bottom, var(--color-primary) 68%, #D44A3A 68%, #B8392D 100%)' }}
                            >
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold brand-ink font-brand">Welcome!</h1>
                        </div>
                        <p className="brand-muted">Let's set up your profile to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium brand-ink mb-2">
                                Choose a Username
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 brand-muted" />
                                <input
                                    id="username"
                                    {...register("username", { 
                                        required: "Username is required",
                                        minLength: { value: 2, message: "Username must be at least 2 characters" }
                                    })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    placeholder="Enter your username"
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                        >
                            Start My Garden
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}