import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sprout, Heart, Users, Zap, TrendingUp, Handshake, Sparkles } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Zap, title: 'Focused Growth', desc: 'Transform daily tasks into meaningful progress' },
    { icon: Sparkles, title: 'Self Care', desc: 'Build healthy habits that nurture your wellbeing' },
    { icon: Handshake, title: 'Community', desc: 'Grow together with others on the same journey' },
    { icon: TrendingUp, title: 'Visual Progress', desc: 'Watch your virtual garden bloom as you complete tasks' }
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(to bottom, var(--color-primary) 68%, #D44A3A 68%, #B8392D 100%)' }}>
                <Sprout className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold brand-ink"></h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold brand-ink mb-6">Fun. Flourishing. Focused.</h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg brand-muted leading-relaxed mb-6">
              TidyBloom transforms your daily routine into a rewarding journey of growth. 
              Whether you're tidying your space or taking care of yourself, every completed 
              task helps your virtual garden flourish.
            </p>
            
            <p className="text-lg brand-muted leading-relaxed">
              We believe that small, consistent actions lead to beautiful transformations. 
              Just like tending a garden, nurturing your habits day by day creates something 
              wonderful over time. Watch your sanctuary bloom as you build the life you want, 
              one task at a time.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 brand-primary" />
                </div>
                <h3 className="font-semibold brand-ink mb-2">{feature.title}</h3>
                <p className="text-sm brand-muted">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={createPageUrl('TaskSelect')}
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity">
            Start Your Garden
          </Link>
        </div>
      </div>
    </div>
  );
}