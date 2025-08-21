import { useState, useEffect } from 'react';
import { Plant } from '@/api/entities';
import { GrowthStageRequirement } from '@/api/entities/GrowthStageRequirement';

export function usePlant(userId) {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageRequirements, setStageRequirements] = useState([]);

  useEffect(() => {
    if (userId) {
      loadPlantData();
      loadStageRequirements();
    }
  }, [userId]);

  const loadPlantData = async () => {
    try {
      setLoading(true);
      const plants = await Plant.filter({ ownerId: userId });
      
      if (plants.length > 0) {
        setPlant(plants[0]);
      } else {
        // Create a new plant if user doesn't have one
        const newPlant = await Plant.create({
          ownerId: userId,
          growthStage: 'SEED',
          xp: 0,
          health: 100,
          nickname: "My First Sprout"
        });
        setPlant(newPlant);
      }
    } catch (error) {
      console.error('Failed to load plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStageRequirements = async () => {
    try {
      const requirements = await GrowthStageRequirement.list();
      setStageRequirements(requirements.sort((a, b) => a.requiredXp - b.requiredXp));
    } catch (error) {
      console.error('Failed to load stage requirements:', error);
    }
  };

  const updatePlantXp = async (xpChange) => {
    if (!plant) return;
    
    try {
      const newXp = Math.max(0, plant.xp + xpChange);
      const newStage = determineGrowthStage(newXp);
      
      const updatedPlant = await Plant.update(plant.id, {
        xp: newXp,
        growthStage: newStage
      });
      
      setPlant(updatedPlant);
      return updatedPlant;
    } catch (error) {
      console.error('Failed to update plant XP:', error);
      throw error;
    }
  };

  const determineGrowthStage = (xp) => {
    return stageRequirements.reduce((prev, curr) => 
      xp >= curr.requiredXp ? curr.stage : prev
    , 'SEED');
  };

  return {
    plant,
    loading,
    stageRequirements,
    updatePlantXp,
    determineGrowthStage,
    refreshPlant: loadPlantData
  };
}