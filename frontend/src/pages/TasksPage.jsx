
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
// Import Supabase client from the central API folder. Avoid keeping
// multiple copies of supabase in the repo; this ensures a single
// instance and consistent configuration.
// Use our backend API instead of querying Supabase directly.  The
// createBackendClient helper returns an Axios instance that sends the
// Supabase JWT to our Express API on every request.
import { createBackendClient } from '@/api/backendClient';
import { useAuth } from '../components/hooks/useAuth';
import TaskCard from '../components/TaskCard';
import FilterChips from '../components/FilterChips';
import PlantStatus from '../components/PlantStatus';
import Toast from '../components/Toast';
import PlantVisual from '../components/PlantVisual';
import { Search, Filter, Sprout, Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function TasksPage() {
  const { user, session } = useAuth();
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

    // Only load data once both the user and their session token are
    // available.  Attempting to call the API without an access
    // token will result in a 401.  By including `session` in the
    // dependency array and checking for `session?.access_token`, we
    // avoid triggering requests prematurely.
    if (user && session?.access_token) {
      loadInitialData();
    }
  }, [user, session]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    // Bail out if the user or their session token is not ready yet.  The
    // access token is required for the backend's auth middleware.  If
    // either value is missing, skip loading until the effect fires
    // again once both are available.
    if (!user || !session?.access_token) {
      setLoading(false);
      return;
    }
    try {
      const api = createBackendClient(session?.access_token);
      // Use the internal app user ID if available; otherwise fall back
      // to the Supabase auth ID.  The backend identifies users by
      // their internal ID, not by the authId.  Storing appUserId in
      // localStorage on signup allows us to persist the mapping.
      const appUserId = localStorage.getItem('appUserId') || user.id;
      // Fetch tasks, userTasks, growth stage requirements and user (for plants) in parallel
      const [tasksRes, userTasksRes, growthRes, userRes] = await Promise.all([
        api.get('/tasks'),
        api.get(`/userTasks/user/${appUserId}`),
        api.get('/growthStageRequirement'),
        api.get(`/users/${appUserId}`)
      ]);

      const allTasks = tasksRes.data || [];
      const existingUserTasks = userTasksRes.data || [];
      const growthReqs = growthRes.data || [];
      const userData = userRes.data || {};

      setTasks(allTasks);
      setUserTasks(existingUserTasks);
      // Sort stage requirements in ascending order of required XP
      setStageRequirements(growthReqs.sort((a, b) => a.requiredXp - b.requiredXp));

      const plants = userData.plants || [];
      if (plants.length > 0) {
        setPlant(plants[0]);
      } else {
        // Create a starter plant for the user if none exists.  The
        // path parameter is ignored on the backend but required to
        // satisfy the route definition.
        const { data: newPlant } = await api.post(`/plants/${appUserId}`, {
          nickname: 'My First Sprout',
          growthStage: 'SEED',
          xp: 0,
          health: 100,
          isStarter: true,
          ownerId: appUserId
        });
        setPlant(newPlant);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Unable to load tasks. Please try refreshing the page.');
    }
    setLoading(false);
  };

  const determineGrowthStage = (xp) => {
    // Determine the growth stage based on cumulative XP.  Each
    // requirement has a `requiredXp` field and a corresponding
    // `stage`.  If no requirements exist, default to SEED.
    if (stageRequirements.length === 0) return 'SEED';
    return stageRequirements.reduce((prev, curr) => (
      xp >= curr.requiredXp ? curr.stage : prev
    ), 'SEED');
  };

  const handleCompleteTask = async (taskId, isCompleted) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !user || !plant) return;
    // In the backend the UserTask model uses camelCase field names.  We
    // need to look for userTasks by taskId.
    const existingUserTask = userTasks.find((ut) => ut.taskId === taskId && ut.status === 'COMPLETED');
    try {
      const api = createBackendClient(session?.access_token);
      // Determine the appropriate user ID for API calls.  Prefer the
      // internal app user ID stored in localStorage; fall back to
      // the Supabase auth ID if no appUserId is available.  The
      // backend uses the internal ID for identifying users.
      const appUserId = localStorage.getItem('appUserId') || user.id;
      if (isCompleted && !existingUserTask) {
        // Assign the task to the user.  This creates a UserTask with
        // status PENDING and xpAwarded set to zero.
        const assignRes = await api.post('/userTasks/assignUserTask', {
          userId: appUserId,
          taskId: task.id
        });
        const assignedTask = assignRes.data;
        // Immediately mark the newly assigned task as completed.  This
        // awards XP in the backend and updates the task status.
        const completeRes = await api.put(`/userTasks/${assignedTask.id}/complete`);
        const completedTask = completeRes.data;
        // Update local state with the completed task
        setUserTasks((prev) => [...prev, completedTask]);
        // Calculate the new XP total and determine the plant's stage
        const newXp = plant.xp + task.baseXp;
        const newStage = determineGrowthStage(newXp);
        // Persist the plant XP and stage on the server
        const { data: updatedPlant } = await api.put(`/plants/${plant.id}`, {
          xp: newXp,
          growthStage: newStage
        });
        setPlant(updatedPlant);
        showToast(
          `Great! You earned ${task.baseXp} XP! 🌱${newStage !== plant.growthStage ? ` Your plant grew to ${newStage}!` : ''}`,
          'success'
        );
      } else if (!isCompleted && existingUserTask) {
        // Delete the user task record to mark it incomplete
        await api.delete(`/userTasks/${existingUserTask.id}`);
        setUserTasks((prev) => prev.filter((ut) => ut.id !== existingUserTask.id));
        // Calculate the new XP total and determine the plant's stage
        const newXp = Math.max(0, plant.xp - task.baseXp);
        const newStage = determineGrowthStage(newXp);
        const { data: updatedPlant } = await api.put(`/plants/${plant.id}`, {
          xp: newXp,
          growthStage: newStage
        });
        setPlant(updatedPlant);
        showToast('Task marked incomplete. XP reduced.', 'info');
      }
    } catch (err) {
      console.error('Failed to update task or plant:', err);
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
    // Map userTasks by taskId so we can quickly determine if a task
    // has been completed.  The backend returns `taskId` instead of
    // `task_id` used in the Supabase schema.
    const userTaskMap = new Map(userTasks.map((ut) => [ut.taskId, ut]));
    return tasks.map((task) => ({
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
                  <PlantVisual stage={plant?.growthStage || 'SEED'} showLabel={true} />
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
