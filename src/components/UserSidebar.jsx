// src/components/UserSidebar.jsx
import React from 'react';

const UserSidebar = ({ activeTab, setActiveTab, onClose, notificationCount }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'tasks', label: 'My Tasks', icon: '✅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: notificationCount },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ];

  const handleItemClick = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">User Panel</h2>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition duration-200 rounded-xl ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-600 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>User Dashboard v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;