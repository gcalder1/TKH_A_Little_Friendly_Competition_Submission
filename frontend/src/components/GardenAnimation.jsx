import React, { useState, useEffect } from 'react';
import PlantVisual from './PlantVisual';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const stages = ['SEED', 'SPROUT', 'MATURE', 'BLOOM'];
const stageLabels = {
    SEED: 'Seed',
    SPROUT: 'Sprout', 
    MATURE: 'Budding',
    BLOOM: 'Bloom'
};

export default function GardenAnimation({ plant }) {
    const actualStageIndex = plant ? stages.indexOf(plant.growthStage) : 0;
    
    const [currentStageIndex, setCurrentStageIndex] = useState(actualStageIndex);

    // When the plant's actual stage changes, reset the view to the new current stage
    useEffect(() => {
        setCurrentStageIndex(actualStageIndex);
    }, [actualStageIndex]);


    if (!plant) {
        return (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="aspect-square bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    const handlePrevStage = () => {
        setCurrentStageIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextStage = () => {
        setCurrentStageIndex(prev => Math.min(actualStageIndex, prev + 1));
    };

    const currentStage = stages[currentStageIndex];
    const isCurrentActualStage = currentStageIndex === actualStageIndex;
    const unlockedStages = stages.slice(0, actualStageIndex + 1);
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4 h-10">
                <div className="w-9">
                    {unlockedStages.length > 1 && (
                        <button
                            onClick={handlePrevStage}
                            disabled={currentStageIndex === 0}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold brand-ink">
                        {isCurrentActualStage ? 'Your Garden' : stageLabels[currentStage]}
                    </h3>
                    {!isCurrentActualStage && (
                        <p className="text-xs brand-muted">
                            Previous Stage
                        </p>
                    )}
                </div>

                <div className="w-9">
                    {unlockedStages.length > 1 && (
                        <button
                            onClick={handleNextStage}
                            disabled={currentStageIndex === actualStageIndex}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="aspect-square rounded-xl flex items-end justify-center p-4 overflow-hidden transition-all duration-300 bg-gradient-to-b from-sky-100 to-green-100">
                <PlantVisual stage={currentStage} showLabel={true} />
            </div>

            {unlockedStages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {unlockedStages.map((stage, index) => (
                        <button
                            key={stage}
                            onClick={() => setCurrentStageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentStageIndex
                                    ? 'bg-brand-primary'
                                    : 'bg-green-300'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}