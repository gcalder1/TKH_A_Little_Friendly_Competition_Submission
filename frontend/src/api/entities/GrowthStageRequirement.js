// src/api/entities/GrowthStageRequirement.js
// Helper for fetching growth stage requirements from Supabase. This
// wraps simple select calls in a tidy API that can be imported by
// components like XpProgress and PlantStatus.

import { supabase } from '../supabaseClient';

/**
 * GrowthStageRequirement entity helper. Provides a single method to
 * list all growth stage requirements. Growth stage requirements
 * determine how much XP is needed to reach each stage (SEED,
 * SPROUT, etc.).
 */
export const GrowthStageRequirement = {
  /**
   * List all growth stage requirement rows. Orders the records by
   * required_xp ascending so that earlier stages appear first.
   * @returns {Promise<Array>}
   */
  async list() {
    const { data, error } = await supabase
      .from('growth_stage_requirements')
      .select('*')
      .order('required_xp', { ascending: true });
    if (error) throw error;
    // Map snake_case fields to camelCase to match existing UI expectations.
    // Each record will include both versions of the field so nothing is lost.
    return (data || []).map(row => ({
      ...row,
      requiredXp: row.required_xp,
    }));
  },
};

// Also export as default for convenience if someone imports the
// module directly without destructuring.
export default GrowthStageRequirement;
