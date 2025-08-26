import React from 'react';
import { createPageUrl } from '@/utils';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requiresOnboarding = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    window.location.href = createPageUrl('HomeLogin');
    return null;
  }

  if (requiresOnboarding && !user.onboardingComplete) {
    window.location.href = createPageUrl('ProfileSetup');
    return null;
  }

  return children;
}