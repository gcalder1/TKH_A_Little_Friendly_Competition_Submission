import { useState, useEffect } from 'react';
import { Task } from '@/api/entities';
import { UserTask } from '@/api/entities';

export function useTasks(userId, filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId, filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [allTasks, completedTasks] = await Promise.all([
        Task.list(),
        UserTask.filter({ userId })
      ]);
      
      // Apply filters if provided
      let filteredTasks = allTasks.filter(task => task.isActive);
      if (filters.room) {
        filteredTasks = filteredTasks.filter(task => task.room === filters.room);
      }
      if (filters.subcategory) {
        filteredTasks = filteredTasks.filter(task => task.subcategory === filters.subcategory);
      }
      if (filters.frequency) {
        filteredTasks = filteredTasks.filter(task => task.frequency === filters.frequency);
      }
      
      setTasks(filteredTasks);
      setUserTasks(completedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const userTask = await UserTask.create({
        userId,
        taskId,
        status: 'COMPLETED',
        xpAwarded: task.baseXp,
        completedAt: new Date().toISOString()
      });
      
      setUserTasks(prev => [...prev, userTask]);
      
      return { success: true, xpEarned: task.baseXp };
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  };

  const uncompleteTask = async (taskId) => {
    try {
      const userTask = userTasks.find(ut => ut.taskId === taskId && ut.status === 'COMPLETED');
      if (!userTask) throw new Error('User task not found');

      await UserTask.delete(userTask.id);
      setUserTasks(prev => prev.filter(ut => ut.id !== userTask.id));
      
      const task = tasks.find(t => t.id === taskId);
      return { success: true, xpLost: task?.baseXp || 0 };
    } catch (error) {
      console.error('Failed to uncomplete task:', error);
      throw error;
    }
  };

  const getFilteredTasks = (searchTerm = '') => {
    const userTaskMap = new Map(userTasks.map(ut => [ut.taskId, ut]));
    
    return tasks
      .map(task => ({
        ...task,
        isCompleted: userTaskMap.has(task.id) && userTaskMap.get(task.id).status === 'COMPLETED'
      }))
      .filter(task => 
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  return {
    tasks,
    userTasks,
    loading,
    completeTask,
    uncompleteTask,
    getFilteredTasks,
    refreshTasks: loadTasks
  };
}