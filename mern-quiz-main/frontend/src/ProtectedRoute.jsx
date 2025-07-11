import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import { FileText, Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(ThemeContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Background Spinning Glow Circle */}
          <div className="absolute w-full h-full rounded-full border-4 border-blue-300 animate-spin-slow blur-sm opacity-60"></div>

          {/* Center Icon - Paper */}
          <div className="absolute flex items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-full shadow-md z-10">
            <FileText className="h-10 w-10 text-blue-600" />
          </div>

          {/* Top Sparkle */}
          <div className="absolute -top-3 -right-3 animate-bounce">
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </div>

          {/* Spinning Outline */}
          <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-full animate-spin-slower"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
