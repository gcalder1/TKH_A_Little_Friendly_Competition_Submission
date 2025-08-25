import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

/**
 * Support page offers guidance and additional resources for users
 * seeking help.  It highlights where to find assistance and how to
 * contact the support team.  It also provides a convenient link
 * back to the dashboard.
 */
export default function Support() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold brand-ink mb-4">Support</h1>
        <p className="brand-muted mb-4">
          Need help using TidyBloom? You're in the right place! Here are some
          common ways to get assistance:
        </p>
        <ul className="list-disc list-inside brand-muted space-y-2">
          <li>
            Visit your dashboard to see your tasks and track your plant's
            progress.
          </li>
          <li>
            Review our FAQ and user guide (coming soon) for tips and
            troubleshooting.
          </li>
          <li>
            Reach out to our support team at{' '}
            <a
              href="mailto:support@tidybloom.com"
              className="text-brand-primary underline"
            >
              support@tidybloom.com
            </a>{' '}
            if you need personalized help.
          </li>
        </ul>
        <div className="mt-8">
          <Link
            to={createPageUrl('Dashboard')}
            className="text-brand-primary underline"
          >
            Return to your dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}