import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

/**
 * Contact page provides a way for users to get in touch with the
 * TidyBloom team.  It offers a friendly explanation of how to
 * reach us and includes a link back to the dashboard for
 * convenience.  Feel free to customize the email address or
 * add a contact form in the future.
 */
export default function Contact() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold brand-ink mb-4">Contact Us</h1>
        <p className="brand-muted mb-4">
          We'd love to hear from you! If you have questions, feedback or
          just want to say hello, feel free to drop us a line at{' '}
          <a
            href="mailto:support@tidybloom.com"
            className="text-brand-primary underline"
          >
            support@tidybloom.com
          </a>
          .
        </p>
        <p className="brand-muted">
          Our team will respond as quickly as possible. Thank you for being part
          of the TidyBloom community!
        </p>
        <div className="mt-8">
          <Link
            to={createPageUrl('Dashboard')}
            className="text-brand-primary underline"
          >
            Go back to your dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}