import React, { useState, useEffect } from 'react';
import { Sprout, TreePine, Flower, HelpCircle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const stageIcons = {
    SEED: Sprout,
    SPROUT: Sprout,
    MATURE: TreePine,
    BLOOM: Flower
};

export default function PlantStatus({ plant, completedTasksCount = 0 }) {
  const [stageRequirements, setStageRequirements] = useState([]);

  useEffect(() => {
    const fetchRequirements = async () => {
        try {
            const { data: requirements, error } = await supabase
                .from('growth_stage_requirements')
                .select('*')
                .order('required_xp', { ascending: true });

            if (error) throw error;
            setStageRequirements(requirements || []);
        } catch (error) {
            console.error("Failed to fetch growth stage requirements:", error);
        }
    };
    fetchRequirements();
  }, []);

  if (!plant || stageRequirements.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
    );
  }

  const totalXp = plant.xp;
  
  const currentStage = stageRequirements.reduce((prev, curr) => 
    totalXp >= curr.required_xp ? curr : prev
  );
  
  const currentStageIndex = stageRequirements.findIndex(s => s.id === currentStage.id);
  const nextStage = stageRequirements[currentStageIndex + 1];

  const progressPercent = nextStage 
    ? ((totalXp - currentStage.required_xp) / (nextStage.required_xp - currentStage.required_xp)) * 100
    : 100;

  const CurrentIcon = stageIcons[currentStage.stage] || HelpCircle;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold brand-ink mb-2">Bloom in Progress...</h3>
        <p className="text-sm brand-muted">
          As you complete each task, watch your sanctuary grow
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CurrentIcon className="w-5 h-5 brand-primary" />
            <span className="font-medium brand-ink">{currentStage.stage}</span>
          </div>
          <span className="text-sm brand-muted">{totalXp} XP</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-xp h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>

        {nextStage && (
          <p className="text-xs brand-muted text-center">
            {nextStage.required_xp - totalXp} XP to {nextStage.stage}
          </p>
        )}

        <div className="text-center pt-2">
          <p className="text-lg font-semibold brand-ink">
            {completedTasksCount} tasks completed today
          </p>
        </div>
      </div>
    </div>
  );
}