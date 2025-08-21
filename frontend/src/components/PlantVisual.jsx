
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Leaf, Flower2, HelpCircle } from 'lucide-react';

const stageDetails = {
    SEED: { 
        component: 'seed', 
        color: 'text-yellow-600', 
        label: 'Seed' 
    },
    SPROUT: { 
        icon: Sprout, 
        color: 'text-green-500', 
        label: 'Sprout' 
    },
    MATURE: { 
        icon: Leaf, 
        color: 'text-green-700', 
        label: 'Budding' 
    },
    BLOOM: { 
        icon: Flower2, 
        color: 'text-pink-500', 
        label: 'Bloom' 
    }
};

const animationVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.8 },
};

const SeedComponent = ({ className }) => (
    <div className={`flex flex-col items-center ${className}`}>
        <div className="w-8 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full mb-4 shadow-lg relative">
            <div className="absolute top-2 left-2 w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
        </div>
    </div>
);

export default function PlantVisual({ stage, showLabel = true, className = '' }) {
    const currentStageDetails = stageDetails[stage] || { 
        icon: HelpCircle, 
        color: 'text-gray-400', 
        label: 'Unknown Stage' 
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={stage}
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className={`text-center ${className}`}
            >
                {currentStageDetails.component === 'seed' ? (
                    <SeedComponent className="mb-4" />
                ) : (
                    <currentStageDetails.icon className={`w-24 h-24 mx-auto mb-4 transition-colors duration-500 ${currentStageDetails.color}`} />
                )}
                
                <div className="relative w-24 h-4 bg-yellow-800/30 rounded-full mx-auto">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-2 bg-yellow-800/50 rounded-full"></div>
                </div>
                
                {showLabel && (
                    <p className="text-sm brand-muted mt-2 font-medium">
                        {currentStageDetails.label}
                    </p>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
