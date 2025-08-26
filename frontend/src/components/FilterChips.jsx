
import React from 'react';

export default function FilterChips({ filters, onFilterChange, className = '' }) {
  const rooms = [
    { value: '', label: 'All Rooms' },
    { value: 'KITCHEN', label: 'Kitchen' },
    { value: 'BATHROOM', label: 'Bathroom' },
    { value: 'LIVINGROOM', label: 'Living Room' },
    { value: 'BEDROOM', label: 'Bedroom' }
  ];

  const subcategories = [
    { value: '', label: 'All Categories' },
    { value: 'PERSONAL_CARE', label: 'Personal Care' },
    { value: 'HOME_CARE', label: 'Home Care' }
  ];

  const frequencies = [
    { value: '', label: 'All Frequencies' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  const handleChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm font-medium brand-ink">Room</label>
        <div className="flex flex-wrap gap-2">
          {rooms.map(room => (
            <button
              key={room.value}
              onClick={() => handleChange('room', room.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.room === room.value 
                  ? 'bg-brand-primary text-white' 
                  : 'border border-gray-300 brand-muted hover:border-brand-primary'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium brand-ink">Category</label>
        <div className="flex flex-wrap gap-2">
          {subcategories.map(sub => (
            <button
              key={sub.value}
              onClick={() => handleChange('subcategory', sub.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.subcategory === sub.value 
                  ? 'bg-brand-primary text-white' 
                  : 'border border-gray-300 brand-muted hover:border-brand-primary'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium brand-ink">Frequency</label>
        <div className="flex flex-wrap gap-2">
          {frequencies.map(freq => (
            <button
              key={freq.value}
              onClick={() => handleChange('frequency', freq.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.frequency === freq.value 
                  ? 'bg-brand-primary text-white' 
                  : 'border border-gray-300 brand-muted hover:border-brand-primary'
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
