import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Profile from '../components/Profile';
import Tasks from '../components/Tasks';

// PUBLIC_INTERFACE
/**
 * Dashboard page with sidebar navigation and content panels
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PUBLIC_INTERFACE
  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="bg-surface shadow-lg h-16 fixed top-0 left-0 right-0 z-20">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden mr-4 text-textColor hover:text-secondary"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-textColor">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-textColor hidden sm:inline">
              Welcome, {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-error hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-surface shadow-xl transform transition-transform duration-300 z-10 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('profile');
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'text-textColor hover:bg-background'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('tasks');
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeTab === 'tasks'
                ? 'bg-primary text-white'
                : 'text-textColor hover:bg-background'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tasks
            </div>
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 md:pl-64 min-h-screen">
        <div className="p-6">
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'tasks' && <Tasks />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
