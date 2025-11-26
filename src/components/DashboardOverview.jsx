// src/components/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statusRes, taskRes] = await Promise.all([
        axios.get('http://localhost:5000/api/user/get-status'),
        axios.get('http://localhost:5000/api/task/dashboard')
      ]);

      setStats({
        userStatus: statusRes.data,
        taskStats: taskRes.data
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <div className="text-red-600 mr-3">⚠️</div>
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="text-red-600 hover:text-red-800 text-sm mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.userStatus?.totalUsers || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats?.userStatus?.activeUsers || 0}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.taskStats?.pendingTasks || 0}
          icon="⏳"
          color="orange"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.taskStats?.completedTasks || 0}
          icon="🎯"
          color="purple"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Teams</span>
              <span className="font-semibold text-gray-900">{stats?.userStatus?.totalTeams || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Active Teams</span>
              <span className="font-semibold text-gray-900">{stats?.userStatus?.activeTeams || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-semibold text-gray-900">{stats?.taskStats?.totalTasks || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-gray-900">{stats?.taskStats?.inProgress || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;