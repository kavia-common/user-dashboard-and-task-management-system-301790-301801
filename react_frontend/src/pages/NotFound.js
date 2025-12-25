import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * NotFound page component for 404 errors
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-textColor mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
