
import React from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

export default function TaskCard({ task, onComplete, showCompleted = false }) {
  const handleToggleComplete = () => {
    onComplete(task.id, !task.isCompleted);
  };

  const getFrequencyDisplay = (frequency) => {
    if (frequency === 'DAILY') return { initial: 'D', label: 'Daily' };
    if (frequency === 'WEEKLY') return { initial: 'W', label: 'Weekly' };
    if (frequency === 'MONTHLY') return { initial: 'M', label: 'Monthly' };
    if (frequency === 'BI_WEEKLY') return { initial: 'BW', label: 'Bi-Weekly' };
    return { initial: '', label: '' };
  };

  const frequencyInfo = getFrequencyDisplay(task.frequency);

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${
      task.isCompleted && showCompleted ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggleComplete}
          className="flex-shrink-0 transition-transform hover:scale-105"
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 brand-muted hover:brand-primary" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${task.isCompleted ? 'line-through brand-muted' : 'brand-ink'}`}>
              {task.name}
            </h3>
            {frequencyInfo.initial && (
              <span
                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#084C61' }}
              >
                {frequencyInfo.initial}
              </span>
            )}
          </div>
          <p className="text-sm brand-muted">
            {task.room.toLowerCase().replace('livingroom', 'living room')} • {task.subcategory.toLowerCase().replace('_', ' ')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-brand-xp text-white px-2 py-1 rounded-full text-xs font-bold">
            {task.baseXp} XP
          </div>
          <ChevronRight className="w-4 h-4 brand-muted" />
        </div>
      </div>
    </div>
  );
}
