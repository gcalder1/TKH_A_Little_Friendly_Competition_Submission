import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sprout, AlertTriangle, LayoutGrid } from 'lucide-react';
import { supabase } from '../components/lib/supabaseClient';
import { useAuth } from '../components/hooks/useAuth';
import GardenAnimation from '../components/GardenAnimation';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
    const { user } = useAuth();
    const [plant, setPlant] = useState(null);
    const [userTasks, setUserTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Get user's plants from Supabase
            const { data: plants, error: plantsError } = await supabase
                .from('plants')
                .select('*')
                .eq('owner_id', user.id);

            if (plantsError) throw plantsError;

            // Get user's completed tasks from Supabase
            const { data: tasks, error: tasksError } = await supabase
                .from('user_tasks')
                .select('*')
                .eq('user_id', user.id);

            if (tasksError) throw tasksError;

            // Set plant data
            if (plants && plants.length > 0) {
                setPlant(plants[0]);
            } else {
                // Create new plant if none exists
                const { data: newPlant, error: createError } = await supabase
                    .from('plants')
                    .insert({
                        nickname: "My First Sprout",
                        growth_stage: 'SEED',
                        xp: 0,
                        health: 100,
                        is_starter: true,
                        owner_id: user.id
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                setPlant(newPlant);
            }

            setUserTasks(tasks || []);

        } catch (error) {
            console.error('Dashboard data loading failed:', error);
            setError('Unable to load dashboard. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetProgress = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to reset all your progress? This will delete all completed tasks and reset your plant to a seed. This action cannot be undone."
        );

        if (!isConfirmed) return;

        setLoading(true);
        try {
            // Delete all user tasks
            const { error: deleteTasksError } = await supabase
                .from('user_tasks')
                .delete()
                .eq('user_id', user.id);

            if (deleteTasksError) throw deleteTasksError;

            // Reset plant
            if (plant) {
                const { error: updatePlantError } = await supabase
                    .from('plants')
                    .update({ xp: 0, growth_stage: 'SEED' })
                    .eq('id', plant.id);

                if (updatePlantError) throw updatePlantError;
            }

            // Reload dashboard data
            await loadDashboardData();

        } catch (error) {
            console.error("Failed to reset progress:", error);
            setError("Failed to reset progress. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const totalCompletedTasks = userTasks?.filter(t => t.status === 'COMPLETED').length || 0;

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Something went wrong</p>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold brand-ink mb-4">
                        Welcome to Your Sanctuary
                    </h1>
                    <p className="text-lg brand-muted">
                        Choose a room to start tending your garden
                    </p>
                </div>

                {plant && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <GardenAnimation plant={plant} />
                        </div>
                        <div className="text-center bg-green-50/50 rounded-lg p-6 flex flex-col justify-center h-full">
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold brand-ink mb-2">Lifetime Progress</h3>
                                <p className="text-5xl font-bold brand-primary">{totalCompletedTasks}</p>
                                <p className="brand-muted">tasks completed</p>
                                <div className="mt-4">
                                    <span className="text-sm brand-muted">{plant.xp} XP</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <Link
                                    to={createPageUrl('TaskSelect')}
                                    className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                    <span>Choose a Room</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold brand-ink mb-4">Account Settings</h3>
                        <button
                            onClick={handleResetProgress}
                            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-xl font-semibold text-lg transition-all bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            <span>Reset All Progress</span>
                        </button>
                        <p className="text-sm brand-muted mt-2">
                            This will reset your XP, tasks, and plant to the very beginning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}