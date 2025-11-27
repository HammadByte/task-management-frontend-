// src/components/UserNotifications.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UserNotifications = ({ notifications, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const unreadNotifications = notifications.filter(noti => !noti.read);
  const readNotifications = notifications.filter(noti => noti.read);

  const handleMarkAsRead = async (notificationId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('http://localhost:5000/api/user/read-noti', { notificationId });
      setSuccess('Notification marked as read!');
      onRefresh(); // Refresh notifications
    } catch (err) {
      setError('Failed to mark notification as read: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mark all unread notifications as read
      for (const notification of unreadNotifications) {
        await axios.put('http://localhost:5000/api/user/read-noti', { notificationId: notification._id });
      }
      setSuccess('All notifications marked as read!');
      onRefresh();
    } catch (err) {
      setError('Failed to mark notifications as read: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your notifications</p>
        </div>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">✅</div>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Unread Notifications</h3>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadNotifications.length} new
            </span>
          </div>
          <div className="space-y-3">
            {unreadNotifications.map(notification => (
              <div key={notification._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <span className="text-blue-600">🔔</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  disabled={loading}
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200 disabled:opacity-50"
                >
                  Mark Read
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Read Notifications</h3>
          <div className="space-y-3">
            {readNotifications.map(notification => (
              <div key={notification._id} className="py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <span className="text-gray-600">🔔</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You don't have any notifications at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;