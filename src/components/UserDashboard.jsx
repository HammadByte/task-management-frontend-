// src/components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import UserOverview from './UserOverview';
import UserTasks from './UserTasks';
import UserNotifications from './UserNotifications';
import UserProfile from './UserProfile';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    tasks: [],
    notifications: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, tasksResponse, notificationsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/task/dashboard'),
        axios.get('http://localhost:5000/api/task/'),
        axios.get('http://localhost:5000/api/user/notifications')
      ]);

      console.log('User Dashboard Data:', {
        stats: statsResponse.data,
        tasks: tasksResponse.data,
        notifications: notificationsResponse.data
      });

      // Handle different response structures
      const statsData = statsResponse.data.data || statsResponse.data || {};
      
      let tasksData = [];
      if (Array.isArray(tasksResponse.data)) {
        tasksData = tasksResponse.data;
      } else if (tasksResponse.data.tasks) {
        tasksData = tasksResponse.data.tasks;
      } else if (tasksResponse.data.data) {
        tasksData = tasksResponse.data.data;
      }

      let notificationsData = [];
      if (Array.isArray(notificationsResponse.data)) {
        notificationsData = notificationsResponse.data;
      } else if (notificationsResponse.data.notifications) {
        notificationsData = notificationsResponse.data.notifications;
      } else if (notificationsResponse.data.data) {
        notificationsData = notificationsResponse.data.data;
      }

      setDashboardData({
        stats: statsData,
        tasks: tasksData,
        notifications: notificationsData
      });

    } catch (err) {
      console.error('Error fetching user dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <UserOverview stats={dashboardData.stats} tasks={dashboardData.tasks} />;
      case 'tasks':
        return <UserTasks tasks={dashboardData.tasks} onRefresh={fetchDashboardData} />;
      case 'notifications':
        return <UserNotifications 
          notifications={dashboardData.notifications} 
          onRefresh={fetchDashboardData}
        />;
      case 'profile':
        return <UserProfile user={user} onRefresh={fetchDashboardData} />;
      default:
        return <UserOverview stats={dashboardData.stats} tasks={dashboardData.tasks} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <UserSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onClose={() => setSidebarOpen(false)}
          notificationCount={dashboardData.notifications.filter(n => !n.read).length}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900 ml-2 lg:ml-0">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'tasks' && 'My Tasks'}
                  {activeTab === 'notifications' && 'Notifications'}
                  {activeTab === 'profile' && 'My Profile'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchDashboardData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;