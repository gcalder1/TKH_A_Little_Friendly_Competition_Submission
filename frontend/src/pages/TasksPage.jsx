
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { supabase } from '../components/lib/supabaseClient';
import { useAuth } from '../components/hooks/useAuth';
import TaskCard from '../components/TaskCard';
import FilterChips from '../components/FilterChips';
import PlantStatus from '../components/PlantStatus';
import Toast from '../components/Toast';
import PlantVisual from '../components/PlantVisual';
import { Search, Filter, Sprout, Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [plant, setPlant] = useState(null);
  const [stageRequirements, setStageRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    room: '',
    subcategory: '',
    frequency: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    const subcategoryFromUrl = params.get('subcategory');
    
    setFilters(prevFilters => ({
        ...prevFilters,
        room: roomFromUrl || '',
        subcategory: subcategoryFromUrl || ''
    }));

    loadInitialData();
  }, [user]); // Depend on user object

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    if (!user) {
        setLoading(false);
        return;
    };

    try {
      // Load all data directly from Supabase
      const [
        { data: allTasks, error: tasksError },
        { data: existingUserTasks, error: userTasksError },
        { data: growthReqs, error: growthError },
        { data: plants, error: plantsError }
      ] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('user_tasks').select('*').eq('user_id', user.id),
        supabase.from('growth_stage_requirements').select('*'),
        supabase.from('plants').select('*').eq('owner_id', user.id)
      ]);

      if (tasksError) throw tasksError;
      if (userTasksError) throw userTasksError;
      if (growthError) throw growthError;
      if (plantsError) throw plantsError;

      setTasks(allTasks || []);
      setUserTasks(existingUserTasks || []);
      setStageRequirements((growthReqs || []).sort((a, b) => a.required_xp - b.required_xp));
      
      if (plants && plants.length > 0) {
        setPlant(plants[0]);
      } else {
        // Create new plant directly in Supabase
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

    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Unable to load tasks. Please try refreshing the page.');
    }
    setLoading(false);
  };

  const determineGrowthStage = (xp) => {
    if (stageRequirements.length === 0) return 'SEED';
    return stageRequirements.reduce((prev, curr) => 
      xp >= curr.required_xp ? curr.stage : prev
    , 'SEED');
  };

  const handleCompleteTask = async (taskId, isCompleted) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user || !plant) return;

    const existingUserTask = userTasks.find(ut => ut.task_id === taskId && ut.status === 'COMPLETED');

    try {
        if (isCompleted && !existingUserTask) {
            // Create new user task in Supabase
            const { data: newUserTask, error: createError } = await supabase
                .from('user_tasks')
                .insert({
                    user_id: user.id,
                    task_id: task.id,
                    status: 'COMPLETED',
                    xp_awarded: task.base_xp,
                    completed_at: new Date().toISOString()
                })
                .select()
                .single();

            if (createError) throw createError;
            
            setUserTasks(prev => [...prev, newUserTask]);
            
            // Update plant XP in Supabase
            const newXp = plant.xp + task.base_xp;
            const newStage = determineGrowthStage(newXp);
            
            const { data: updatedPlant, error: updateError } = await supabase
                .from('plants')
                .update({ 
                    xp: newXp,
                    growth_stage: newStage 
                })
                .eq('id', plant.id)
                .select()
                .single();

            if (updateError) throw updateError;
            setPlant(updatedPlant);
            
            showToast(`Great! You earned ${task.base_xp} XP! 🌱${newStage !== plant.growth_stage ? ` Your plant grew to ${newStage}!` : ''}`, 'success');
            
        } else if (!isCompleted && existingUserTask) {
            // Delete user task from Supabase
            const { error: deleteError } = await supabase
                .from('user_tasks')
                .delete()
                .eq('id', existingUserTask.id);

            if (deleteError) throw deleteError;
            setUserTasks(prev => prev.filter(ut => ut.id !== existingUserTask.id));
            
            // Update plant XP in Supabase
            const newXp = Math.max(0, plant.xp - task.base_xp);
            const newStage = determineGrowthStage(newXp);
            
            const { data: updatedPlant, error: updateError } = await supabase
                .from('plants')
                .update({ 
                    xp: newXp,
                    growth_stage: newStage 
                })
                .eq('id', plant.id)
                .select()
                .single();

            if (updateError) throw updateError;
            setPlant(updatedPlant);
            
            showToast(`Task marked incomplete. XP reduced.`, 'info');
        }

    } catch (error) {
      console.error("Failed to update task or plant:", error);
      showToast('Something went wrong. Please try again.', 'error');
      loadInitialData();
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const combinedTasks = useMemo(() => {
    const userTaskMap = new Map(userTasks.map(ut => [ut.task_id, ut]));
    return tasks.map(task => ({
        ...task,
        isCompleted: userTaskMap.has(task.id) && userTaskMap.get(task.id).status === 'COMPLETED'
    }));
  }, [tasks, userTasks]);

  const filteredTasks = combinedTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = !filters.room || task.room === filters.room;
    const matchesSubcategory = !filters.subcategory || task.subcategory === filters.subcategory;
    const matchesFrequency = !filters.frequency || task.frequency === filters.frequency;
    
    return matchesSearch && matchesRoom && matchesSubcategory && matchesFrequency;
  });
  
  const dailyTasks = filteredTasks.filter(task => task.frequency === 'DAILY');
  const weeklyTasks = filteredTasks.filter(task => task.frequency === 'WEEKLY');
  const monthlyTasks = filteredTasks.filter(task => task.frequency === 'MONTHLY');

  const completedTaskCount = userTasks.filter(t => t.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-red-500 mb-4">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Unable to load tasks</p>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const renderTaskList = (taskList, title) => (
    taskList.length > 0 && (
        <div className="mb-8">
            <h2 className="text-xl font-bold brand-ink mb-4 pb-2 border-b-2 border-green-100">{title}</h2>
            <div className="space-y-4">
                {taskList.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleCompleteTask}
                        showCompleted={task.isCompleted}
                    />
                ))}
            </div>
        </div>
    )
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative text-center mb-8">
           <Link
            to={createPageUrl('Dashboard')}
            className="absolute left-0 top-2 flex items-center gap-2 text-sm brand-muted hover:brand-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold brand-ink mb-4 mt-8 md:mt-0">
            Bloom in Progress... Begin watering.
          </h1>
          <p className="text-lg brand-muted">
            As you complete each task click the icon to begin watering your sanctuary. 
            As each task is completed watch your garden grow.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 brand-muted" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showFilters 
                      ? 'bg-brand-primary text-white' 
                      : 'border border-gray-300 brand-muted hover:border-brand-primary'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              {showFilters && (
                <FilterChips 
                  filters={filters}
                  onFilterChange={setFilters}
                />
              )}
            </div>

            <div>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Sprout className="w-12 h-12 brand-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold brand-ink mb-2">No tasks found</h3>
                  <p className="brand-muted">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  {renderTaskList(dailyTasks, "Daily Tasks")}
                  {renderTaskList(weeklyTasks, "Weekly Tasks")}
                  {renderTaskList(monthlyTasks, "Monthly Tasks")}
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {plant ? (
                <PlantStatus 
                  plant={plant}
                  completedTasksCount={completedTaskCount}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="brand-muted">Loading your garden...</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  to={createPageUrl('Dashboard')}
                  className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold brand-ink mb-4 text-center">
                Your Garden
              </h3>
              <div className="aspect-square bg-gradient-to-b from-sky-100 to-green-100 rounded-xl flex items-end justify-center p-4 overflow-hidden">
                  <PlantVisual stage={plant?.growth_stage || 'SEED'} showLabel={true} />
              </div>
            </div>
          </div>
        </div>

        <Toast 
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}
