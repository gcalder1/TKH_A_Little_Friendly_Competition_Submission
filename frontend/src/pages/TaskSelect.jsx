import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Refrigerator, Bath, Sofa, Bed, Heart, Shield, ArrowLeft } from 'lucide-react'; // Changed Home to Refrigerator

export default function TaskSelect() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); // New state variable

  const rooms = [
    { value: 'KITCHEN', label: 'Kitchen', icon: Refrigerator }, // Updated icon to Refrigerator
    { value: 'BATHROOM', label: 'Bathroom', icon: Bath },
    { value: 'LIVINGROOM', label: 'Living Room', icon: Sofa },
    { value: 'BEDROOM', label: 'Bedroom', icon: Bed } // Modified: Removed "/Laundry" from label
  ];

  const subcategories = [
    { value: 'PERSONAL_CARE', label: 'Personal Care', icon: Heart },
    { value: 'HOME_CARE', label: 'Home Care', icon: Shield }
  ];

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedSubcategory(''); // Reset subcategory when room changes
  };

  const handleSubcategorySelect = (subcategory) => {
    if (selectedRoom) {
      window.location.href = createPageUrl('TasksPage') + `?room=${selectedRoom}&subcategory=${subcategory}`;
    }
  };

  // The handleBeginGardening function and the associated button are removed
  // as the flow now continues by selecting a subcategory.

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative text-center mb-12">
          <Link
            to={createPageUrl('Dashboard')}
            className="absolute left-0 top-2 flex items-center gap-2 text-sm brand-muted hover:brand-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold brand-ink mb-4 mt-8 md:mt-0">
            Select Your Sanctuary
          </h1>
          <p className="text-lg brand-muted">
            Choose what part of your home you would like to focus on or take some time for yourself
          </p>
        </div>

        <div className="grid md:-cols-2 lg:grid-cols-4 gap-6 mb-12"> {/* Changed mb-8 to mb-12 */}
          {rooms.map(room => {
            const Icon = room.icon;
            return (
              <button
                key={room.value}
                onClick={() => handleRoomSelect(room.value)}
                className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                  selectedRoom === room.value
                    ? 'border-brand-primary bg-green-50'
                    : 'border-gray-200 hover:border-brand-primary'
                }`}
              >
                <div className="aspect-square rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#00C49A' }}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-semibold brand-ink">{room.label}</h3>
              </button>
            );
          })}
        </div>

        {selectedRoom && (
            <div className="text-center animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold brand-ink mb-6">What kind of care?</h2>
                <div className="flex justify-center gap-6">
                    {subcategories.map(sub => {
                        const Icon = sub.icon;
                        return (
                             <button
                                key={sub.value}
                                onClick={() => handleSubcategorySelect(sub.value)}
                                className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all hover:shadow-lg hover:border-brand-primary w-48"
                            >
                                <Icon className="w-10 h-10 brand-primary" />
                                <span className="font-semibold brand-ink">{sub.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}