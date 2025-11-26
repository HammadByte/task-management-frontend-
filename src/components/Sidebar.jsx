// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👤' },
    { id: 'team', label: 'Team Management', icon: '👥' },
    { id: 'tasks', label: 'Task Management', icon: '✅' },
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition duration-200 rounded-xl ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Hammad Byte</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;