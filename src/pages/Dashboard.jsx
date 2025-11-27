// // src/components/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
  
//   const [activeTab, setActiveTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
  
//   // States for different sections
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [showEditProfile, setShowEditProfile] = useState(false);
  
//   // Form states
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   const [profileForm, setProfileForm] = useState({
//     name: '',
//     email: ''
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       const [statsResponse, tasksResponse, notificationsResponse] = await Promise.all([
//         axios.get('http://localhost:5000/api/task/dashboard'),
//         axios.get('http://localhost:5000/api/task/'),
//         axios.get('http://localhost:5000/api/user/notifications')
//       ]);

//       console.log('Dashboard stats:', statsResponse.data);
//       console.log('Tasks:', tasksResponse.data);
//       console.log('Notifications:', notificationsResponse.data);

//       // Handle different response structures
//       setDashboardStats(statsResponse.data.data || statsResponse.data);
      
//       let tasksData = [];
//       if (Array.isArray(tasksResponse.data)) {
//         tasksData = tasksResponse.data;
//       } else if (tasksResponse.data.tasks) {
//         tasksData = tasksResponse.data.tasks;
//       } else if (tasksResponse.data.data) {
//         tasksData = tasksResponse.data.data;
//       }
//       setTasks(tasksData);

//       let notificationsData = [];
//       if (Array.isArray(notificationsResponse.data)) {
//         notificationsData = notificationsResponse.data;
//       } else if (notificationsResponse.data.notifications) {
//         notificationsData = notificationsResponse.data.notifications;
//       } else if (notificationsResponse.data.data) {
//         notificationsData = notificationsResponse.data.data;
//       }
//       setNotifications(notificationsData);

//       setError(null);
//     } catch (err) {
//       setError('Failed to load dashboard data: ' + (err.response?.data?.message || err.message));
//       console.error('Error fetching dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setError('New passwords do not match');
//       return;
//     }

//     if (passwordForm.newPassword.length < 6) {
//       setError('New password must be at least 6 characters long');
//       return;
//     }

//     try {
//       await axios.put('http://localhost:5000/api/user/change-password', {
//         currentPassword: passwordForm.currentPassword,
//         newPassword: passwordForm.newPassword
//       });

//       setSuccessMessage('Password changed successfully!');
//       setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       setShowChangePassword(false);
//     } catch (err) {
//       setError('Failed to change password: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     try {
//       await axios.put('http://localhost:5000/api/user/profile', profileForm);
//       setSuccessMessage('Profile updated successfully!');
//       setShowEditProfile(false);
//       // Update user context if needed
//     } catch (err) {
//       setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleMarkNotificationRead = async (notificationId) => {
//     try {
//       await axios.put('http://localhost:5000/api/user/read-noti', { notificationId });
//       // Refresh notifications
//       const response = await axios.get('http://localhost:5000/api/user/notifications');
//       let notificationsData = [];
//       if (Array.isArray(response.data)) {
//         notificationsData = response.data;
//       } else if (response.data.notifications) {
//         notificationsData = response.data.notifications;
//       } else if (response.data.data) {
//         notificationsData = response.data.data;
//       }
//       setNotifications(notificationsData);
//     } catch (err) {
//       console.error('Error marking notification as read:', err);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/user/logout');
//     } catch (err) {
//       console.error('Logout error:', err);
//     } finally {
//       logout();
//       navigate('/login');
//     }
//   };

//   const openEditProfile = () => {
//     setProfileForm({
//       name: user?.name || '',
//       email: user?.email || ''
//     });
//     setShowEditProfile(true);
//   };

//   const getStageColor = (stage) => {
//     switch (stage) {
//       case 'todo': return 'bg-blue-100 text-blue-800';
//       case 'in progress':
//       case 'in-progress': return 'bg-yellow-100 text-yellow-800';
//       case 'review': return 'bg-purple-100 text-purple-800';
//       case 'completed': return 'bg-green-100 text-green-800';
//       case 'backlog': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStageDisplayName = (stage) => {
//     switch (stage) {
//       case 'todo': return 'To Do';
//       case 'in progress':
//       case 'in-progress': return 'In Progress';
//       case 'review': return 'Review';
//       case 'completed': return 'Completed';
//       case 'backlog': return 'Backlog';
//       default: return stage;
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return <DashboardOverview stats={dashboardStats} tasks={tasks} />;
//       case 'tasks':
//         return <UserTasks tasks={tasks} />;
//       case 'notifications':
//         return <Notifications 
//           notifications={notifications} 
//           onMarkAsRead={handleMarkNotificationRead} 
//         />;
//       case 'profile':
//         return <UserProfile 
//           user={user}
//           onEditProfile={openEditProfile}
//           onChangePassword={() => setShowChangePassword(true)}
//         />;
//       default:
//         return <DashboardOverview stats={dashboardStats} tasks={tasks} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-900">{user?.name}</p>
//                 <p className="text-xs text-gray-500">{user?.email}</p>
//               </div>
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white font-semibold text-sm">
//                   {user?.name?.charAt(0).toUpperCase() || 'U'}
//                 </span>
//               </div>
//               <button 
//                 onClick={handleLogout}
//                 className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition duration-200"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Navigation */}
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex space-x-8">
//             {[
//               { id: 'overview', label: 'Overview', icon: '📊' },
//               { id: 'tasks', label: 'My Tasks', icon: '✅' },
//               { id: 'notifications', label: 'Notifications', icon: '🔔' },
//               { id: 'profile', label: 'Profile', icon: '👤' }
//             ].map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === item.id
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <span className="mr-2">{item.icon}</span>
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Messages */}
//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//             <div className="flex items-center">
//               <div className="text-green-600 mr-3">✅</div>
//               <p className="text-green-800 font-medium">{successMessage}</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
//             <div className="flex items-center">
//               <div className="text-red-600 mr-3">⚠️</div>
//               <p className="text-red-800">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Change Password Modal */}
//         {showChangePassword && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
//               <form onSubmit={handleChangePassword} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//                   <input
//                     type="password"
//                     required
//                     value={passwordForm.currentPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//                   <input
//                     type="password"
//                     required
//                     minLength="6"
//                     value={passwordForm.newPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
//                   <input
//                     type="password"
//                     required
//                     value={passwordForm.confirmPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
//                   >
//                     Change Password
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowChangePassword(false)}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Profile Modal */}
//         {showEditProfile && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
//               <form onSubmit={handleUpdateProfile} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={profileForm.name}
//                     onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                   <input
//                     type="email"
//                     required
//                     value={profileForm.email}
//                     onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
//                   >
//                     Update Profile
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowEditProfile(false)}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// // Dashboard Overview Component
// const DashboardOverview = ({ stats, tasks }) => {
//   const myTasks = tasks.filter(task => 
//     task.assignee || task.assignees?.some(assignee => assignee._id === 'current-user-id')
//   );

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
      
//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="My Tasks"
//           value={myTasks.length}
//           icon="✅"
//           color="blue"
//         />
//         <StatCard
//           title="Pending"
//           value={myTasks.filter(task => task.stage !== 'completed').length}
//           icon="⏳"
//           color="yellow"
//         />
//         <StatCard
//           title="Completed"
//           value={myTasks.filter(task => task.stage === 'completed').length}
//           icon="🎯"
//           color="green"
//         />
//         <StatCard
//           title="In Progress"
//           value={myTasks.filter(task => task.stage === 'in progress' || task.stage === 'in-progress').length}
//           icon="🚀"
//           color="purple"
//         />
//       </div>

//       {/* Recent Tasks */}
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
//         {myTasks.length > 0 ? (
//           <div className="space-y-3">
//             {myTasks.slice(0, 5).map(task => (
//               <div key={task._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
//                 <div>
//                   <p className="font-medium text-gray-900">{task.title}</p>
//                   <p className="text-sm text-gray-500">{task.description}</p>
//                 </div>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                   task.stage === 'completed' ? 'bg-green-100 text-green-800' :
//                   task.stage === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-blue-100 text-blue-800'
//                 }`}>
//                   {getStageDisplayName(task.stage)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No tasks assigned to you yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // User Tasks Component
// const UserTasks = ({ tasks }) => {
//   const myTasks = tasks.filter(task => 
//     task.assignee || task.assignees?.some(assignee => assignee._id === 'current-user-id')
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
//         <span className="text-sm text-gray-500">{myTasks.length} tasks</span>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Task
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stage
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Priority
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {myTasks.map((task) => (
//                 <tr key={task._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">{task.title}</div>
//                     <div className="text-sm text-gray-500">{task.description}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(task.stage)}`}>
//                       {getStageDisplayName(task.stage)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       task.priority === 'high' ? 'bg-red-100 text-red-800' :
//                       task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {task.priority || 'medium'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(task.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {myTasks.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">✅</div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
//             <p className="text-gray-500">You don't have any tasks assigned to you yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Notifications Component
// const Notifications = ({ notifications, onMarkAsRead }) => {
//   const unreadNotifications = notifications.filter(noti => !noti.read);
//   const readNotifications = notifications.filter(noti => noti.read);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
//         <span className="text-sm text-gray-500">
//           {unreadNotifications.length} unread
//         </span>
//       </div>

//       {/* Unread Notifications */}
//       {unreadNotifications.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Unread Notifications</h3>
//           <div className="space-y-3">
//             {unreadNotifications.map(notification => (
//               <div key={notification._id} className="flex items-center justify-between py-3 border-b border-gray-100">
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">{notification.title}</p>
//                   <p className="text-sm text-gray-600">{notification.message}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     {new Date(notification.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => onMarkAsRead(notification._id)}
//                   className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-200"
//                 >
//                   Mark Read
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Read Notifications */}
//       {readNotifications.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Read Notifications</h3>
//           <div className="space-y-3">
//             {readNotifications.map(notification => (
//               <div key={notification._id} className="py-3 border-b border-gray-100 last:border-0">
//                 <p className="font-medium text-gray-900">{notification.title}</p>
//                 <p className="text-sm text-gray-600">{notification.message}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(notification.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {notifications.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">🔔</div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
//           <p className="text-gray-500">You don't have any notifications at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // User Profile Component
// const UserProfile = ({ user, onEditProfile, onChangePassword }) => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>

//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//         <div className="flex items-center space-x-6 mb-6">
//           <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
//             <span className="text-white font-semibold text-2xl">
//               {user?.name?.charAt(0).toUpperCase() || 'U'}
//             </span>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
//             <p className="text-gray-600">{user?.email}</p>
//             <p className="text-sm text-gray-500 capitalize">{user?.role} User</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <h4 className="font-medium text-gray-700 mb-2">Account Information</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Member since:</span>
//                 <span className="text-gray-900">
//                   {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status:</span>
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   user?.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {user?.active !== false ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex space-x-4">
//           <button
//             onClick={onEditProfile}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
//           >
//             Edit Profile
//           </button>
//           <button
//             onClick={onChangePassword}
//             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
//           >
//             Change Password
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // StatCard Component
// const StatCard = ({ title, value, icon, color }) => {
//   const colorClasses = {
//     blue: 'bg-blue-100 text-blue-600',
//     green: 'bg-green-100 text-green-600',
//     yellow: 'bg-yellow-100 text-yellow-600',
//     purple: 'bg-purple-100 text-purple-600'
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//         </div>
//         <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
//           <span className="text-2xl">{icon}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;