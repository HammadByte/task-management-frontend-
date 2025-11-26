// src/components/TeamManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManagement = () => {
  const [teamStats, setTeamStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Fetch team statistics and user data
      const [statusResponse, teamResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/user/get-status'),
        axios.get('http://localhost:5000/api/user/get-team')
      ]);

      console.log('Status API Response:', statusResponse.data);
      console.log('Team API Response:', teamResponse.data);

      // Handle different response structures
      const statusData = statusResponse.data.data || statusResponse.data;
      let usersData = [];
      
      if (teamResponse.data.users) {
        usersData = teamResponse.data.users;
      } else if (Array.isArray(teamResponse.data)) {
        usersData = teamResponse.data;
      } else if (teamResponse.data.data) {
        usersData = teamResponse.data.data;
      }

      setTeamStats(statusData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch team data: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (active) => {
    return active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage team members and view statistics</p>
        </div>
        <button
          onClick={fetchTeamData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {teamStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={teamStats.totalUsers || users.length}
            icon="👥"
            color="blue"
            description="All registered users"
          />
          <StatCard
            title="Active Users"
            value={teamStats.activeUsers || users.filter(u => u.active !== false).length}
            icon="✅"
            color="green"
            description="Currently active users"
          />
          <StatCard
            title="Admins"
            value={users.filter(u => u.role === 'admin').length}
            icon="👑"
            color="purple"
            description="Administrator accounts"
          />
          <StatCard
            title="Total Teams"
            value={teamStats.totalTeams || 0}
            icon="🏢"
            color="orange"
            description="Number of teams"
          />
        </div>
      )}

      {/* Team Statistics */}
      {teamStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold text-gray-900">{teamStats.totalUsers || users.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-gray-900">{teamStats.activeUsers || users.filter(u => u.active !== false).length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Inactive Users</span>
                <span className="font-semibold text-gray-900">{users.filter(u => u.active === false).length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Admin Users</span>
                <span className="font-semibold text-gray-900">{users.filter(u => u.role === 'admin').length}</span>
              </div>
              {teamStats.totalTeams !== undefined && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Teams</span>
                  <span className="font-semibold text-gray-900">{teamStats.totalTeams}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
            <div className="space-y-4">
              {['admin', 'manager', 'user'].map(role => {
                const count = users.filter(u => u.role === role).length;
                const percentage = users.length > 0 ? ((count / users.length) * 100).toFixed(1) : 0;
                
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(role)} mr-3`}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">{count} users</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Team Members ({users.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'Unnamed User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.active)}`}>
                      {user.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-500">There are no team members to display at the moment.</p>
          </div>
        )}
      </div>

      {/* Debug Information */}
      {/* <div className="bg-gray-50 rounded-lg p-4">
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700">Debug Information</summary>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Team Stats:</h4>
              <pre className="text-xs bg-white p-2 rounded border">
                {JSON.stringify(teamStats, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Users Data:</h4>
              <pre className="text-xs bg-white p-2 rounded border">
                {JSON.stringify(users, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div> */}
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;