import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Flower2, RefreshCw, Home } from 'lucide-react';

export default function Completed() {
  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flower2 className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold brand-ink mb-4">
            You did it!
          </h1>
          
          <p className="text-lg brand-muted mb-8">
            Congratulations! You've completed your tasks and helped your garden bloom. 
            Your sanctuary is flourishing thanks to your dedication.
          </p>
        </div>

        {/* Garden Success Visual */}
        <div className="bg-gradient-to-b from-sky-100 to-green-200 rounded-2xl p-8 mb-8">
          <div className="aspect-video bg-gradient-to-b from-blue-100 to-green-200 rounded-xl flex items-end justify-center p-6">
            <div className="text-center">
              <Flower2 className="w-20 h-20 text-green-600 mx-auto mb-2" />
              <p className="brand-muted font-medium">Completed plant</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to={createPageUrl('TaskSelect')}
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity mr-4"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Plant in Another Room
          </Link>
          
          <Link
            to={createPageUrl('Tasks')}
            className="inline-block border-2 border-brand-primary brand-primary px-8 py-3 rounded-full font-semibold text-lg hover:bg-brand-primary hover:text-white transition-all"
          >
            <Home className="w-5 h-5 inline mr-2" />
            Continue Gardening Here
          </Link>
        </div>
      </div>
    </div>
  );
}