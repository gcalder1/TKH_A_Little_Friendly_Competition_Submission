import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sprout } from 'lucide-react';

export default function AppBar() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to={createPageUrl('HomeLogin')} className="flex items-center gap-2 text-xl font-bold brand-ink">
          <Sprout className="w-6 h-6 brand-primary" />
          <span>TidyBloom</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to={createPageUrl('About')} className="text-sm font-medium hover:brand-primary transition-colors brand-muted">
            About
          </Link>
          <span className="text-sm font-medium brand-muted">Contact</span>
          <span className="text-sm font-medium brand-muted">News</span>
          <span className="text-sm font-medium brand-muted">Support</span>
          <Link to={createPageUrl('Signup')} className="text-sm font-medium hover:brand-primary transition-colors brand-muted">
            Login / Sign Up
          </Link>
        </nav>
      </div>
    </div>
  );
}