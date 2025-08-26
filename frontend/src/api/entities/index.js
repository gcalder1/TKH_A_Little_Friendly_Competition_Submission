// src/api/entities/index.js
// This module provides simple CRUD-style helpers for interacting with
// your Supabase tables using the supabase-js client. Each exported
// entity exposes a handful of methods used throughout the application.
//
// NOTE: These functions assume your database tables are named using
// snake_case and plural forms (e.g. `tasks`, `user_tasks`, `plants`,
// `growth_stage_requirements`). If your Supabase tables use different
// naming conventions, adjust the table names accordingly.

import { supabase } from '../supabaseClient';

/**
 * Task entity helper. Provides methods to list, create, update and
 * delete tasks. These helpers mirror the API previously provided by
 * the Base44 SDK but operate directly on your Supabase tables.
 */
export const Task = {
  /**
   * Fetch all tasks. This returns every row from the `tasks` table.
   * @returns {Promise<Array>} An array of task objects
   */
  async list() {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    // Map snake_case columns to camelCase to align with the UI code. We
    // preserve the original keys so nothing is lost, but add camelCase
    // aliases for easy access (e.g. isActive, baseXp).
    return (data || []).map(row => ({
      ...row,
      isActive: row.is_active,
      baseXp: row.base_xp,
      createdAt: row.created_at,
    }));
  },

  /**
   * Create a new task.
   * @param {Object} payload The properties of the task to create
   * @returns {Promise<Object>} The newly created task
   */
  async create(payload) {
    // Convert camelCase keys to snake_case expected by the database
    const dbPayload = { ...payload };
    if (payload.isActive !== undefined) dbPayload.is_active = payload.isActive;
    if (payload.baseXp !== undefined) dbPayload.base_xp = payload.baseXp;
    delete dbPayload.isActive;
    delete dbPayload.baseXp;
    const { data, error } = await supabase
      .from('tasks')
      .insert(dbPayload)
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      isActive: data.is_active,
      baseXp: data.base_xp,
      createdAt: data.created_at,
    };
  },

  /**
   * Update an existing task.
   * @param {string} id The ID of the task to update
   * @param {Object} updates A partial object of fields to update
   * @returns {Promise<Object>} The updated task
   */
  async update(id, updates) {
    // Convert camelCase update keys to snake_case for the DB
    const dbUpdates = { ...updates };
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.baseXp !== undefined) dbUpdates.base_xp = updates.baseXp;
    delete dbUpdates.isActive;
    delete dbUpdates.baseXp;
    const { data, error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      isActive: data.is_active,
      baseXp: data.base_xp,
      createdAt: data.created_at,
    };
  },

  /**
   * Delete a task by ID.
   * @param {string} id The ID of the task to delete
   * @returns {Promise<void>}
   */
  async delete(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

/**
 * UserTask entity helper. Used for assigning tasks to users and
 * fetching a user's assigned tasks. Supports filtering by user ID or
 * status. Matches the behaviour of the Base44 UserTask API.
 */
export const UserTask = {
  /**
   * Fetch all user task rows. Rarely used directly; prefer `.filter()`.
   * @returns {Promise<Array>}
   */
  async list() {
    const { data, error } = await supabase.from('user_tasks').select('*');
    if (error) throw error;
    return (data || []).map(row => ({
      ...row,
      userId: row.user_id,
      taskId: row.task_id,
      xpAwarded: row.xp_awarded,
      completedAt: row.completed_at,
    }));
  },

  /**
   * Filter user tasks based on provided criteria. Supported keys:
   *  - userId: ID of the user (maps to user_id column)
   *  - status: status value (e.g. 'COMPLETED', 'PENDING')
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async filter(filters = {}) {
    let query = supabase.from('user_tasks').select('*');
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(row => ({
      ...row,
      userId: row.user_id,
      taskId: row.task_id,
      xpAwarded: row.xp_awarded,
      completedAt: row.completed_at,
    }));
  },

  /**
   * Assign a task to a user. Accepts the full object with keys
   * matching your schema (`user_id`, `task_id`, `status`, etc.).
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async create(payload) {
    // Convert camelCase keys to snake_case before inserting
    const dbPayload = { ...payload };
    if (payload.userId !== undefined) dbPayload.user_id = payload.userId;
    if (payload.taskId !== undefined) dbPayload.task_id = payload.taskId;
    if (payload.xpAwarded !== undefined) dbPayload.xp_awarded = payload.xpAwarded;
    if (payload.completedAt !== undefined) dbPayload.completed_at = payload.completedAt;
    delete dbPayload.userId;
    delete dbPayload.taskId;
    delete dbPayload.xpAwarded;
    delete dbPayload.completedAt;
    const { data, error } = await supabase
      .from('user_tasks')
      .insert(dbPayload)
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      userId: data.user_id,
      taskId: data.task_id,
      xpAwarded: data.xp_awarded,
      completedAt: data.completed_at,
    };
  },

  /**
   * Update a user task by its ID. Useful for marking tasks as
   * completed or expired.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    const dbUpdates = { ...updates };
    if (updates.userId !== undefined) dbUpdates.user_id = updates.userId;
    if (updates.taskId !== undefined) dbUpdates.task_id = updates.taskId;
    if (updates.xpAwarded !== undefined) dbUpdates.xp_awarded = updates.xpAwarded;
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
    delete dbUpdates.userId;
    delete dbUpdates.taskId;
    delete dbUpdates.xpAwarded;
    delete dbUpdates.completedAt;
    const { data, error } = await supabase
      .from('user_tasks')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      userId: data.user_id,
      taskId: data.task_id,
      xpAwarded: data.xp_awarded,
      completedAt: data.completed_at,
    };
  },

  /**
   * Delete a user task by its ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const { error } = await supabase.from('user_tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

/**
 * Plant entity helper. Handles fetching, creating and updating plants.
 * All methods work against the `plants` table which stores each
 * user's plant progress.
 */
export const Plant = {
  /**
   * Filter plants by owner ID. If no filters are provided, returns
   * every plant in the database.
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async filter(filters = {}) {
    let query = supabase.from('plants').select('*');
    if (filters.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(row => ({
      ...row,
      ownerId: row.owner_id,
      growthStage: row.growth_stage,
      isStarter: row.is_starter,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  /**
   * Create a new plant. Accepts a payload with columns such as
   * `owner_id`, `nickname`, `growth_stage`, `xp`, `health`, etc.
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async create(payload) {
    // Translate camelCase keys into snake_case for insertion
    const dbPayload = { ...payload };
    if (payload.ownerId !== undefined) dbPayload.owner_id = payload.ownerId;
    if (payload.growthStage !== undefined) dbPayload.growth_stage = payload.growthStage;
    if (payload.isStarter !== undefined) dbPayload.is_starter = payload.isStarter;
    // xp, health, nickname can be passed directly
    delete dbPayload.ownerId;
    delete dbPayload.growthStage;
    delete dbPayload.isStarter;
    const { data, error } = await supabase
      .from('plants')
      .insert(dbPayload)
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      ownerId: data.owner_id,
      growthStage: data.growth_stage,
      isStarter: data.is_starter,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Update a plant by its ID. Provide only the fields you want
   * updated. Returns the updated plant.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    const dbUpdates = { ...updates };
    if (updates.ownerId !== undefined) dbUpdates.owner_id = updates.ownerId;
    if (updates.growthStage !== undefined) dbUpdates.growth_stage = updates.growthStage;
    if (updates.isStarter !== undefined) dbUpdates.is_starter = updates.isStarter;
    delete dbUpdates.ownerId;
    delete dbUpdates.growthStage;
    delete dbUpdates.isStarter;
    const { data, error } = await supabase
      .from('plants')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      ownerId: data.owner_id,
      growthStage: data.growth_stage,
      isStarter: data.is_starter,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Delete a plant by its ID. Use with caution.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (error) throw error;
  },
};

// You can add additional entity helpers here (e.g. CategoryGoal, XPEvent)
// if your UI needs them in the future. Keeping them in a central
// location encourages consistent data access patterns.
