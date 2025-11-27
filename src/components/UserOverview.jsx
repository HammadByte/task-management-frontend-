// src/components/UserOverview.jsx
import React from 'react';

const UserOverview = ({ stats, tasks }) => {
  // Filter tasks assigned to current user
  const myTasks = tasks || [];
  const assignedTasks = myTasks.filter(task => task.assignee || task.assignees?.length > 0);

  const taskStats = {
    total: assignedTasks.length,
    todo: assignedTasks.filter(task => task.stage === 'todo' || task.stage === 'backlog').length,
    inProgress: assignedTasks.filter(task => task.stage === 'in progress' || task.stage === 'in-progress').length,
    completed: assignedTasks.filter(task => task.stage === 'completed').length,
    pending: assignedTasks.filter(task => task.stage !== 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          icon="📋"
          color="blue"
          description="Assigned to you"
        />
        <StatCard
          title="To Do"
          value={taskStats.todo}
          icon="⏳"
          color="yellow"
          description="Pending tasks"
        />
        <StatCard
          title="In Progress"
          value={taskStats.inProgress}
          icon="🚀"
          color="purple"
          description="Currently working on"
        />
        <StatCard
          title="Completed"
          value={taskStats.completed}
          icon="✅"
          color="green"
          description="Finished tasks"
        />
      </div>

      {/* Recent Tasks & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
          {assignedTasks.length > 0 ? (
            <div className="space-y-3">
              {assignedTasks.slice(0, 5).map(task => (
                <div key={task._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ml-3 ${
                    task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                    task.stage === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {getStageDisplayName(task.stage)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">📋</div>
              <p className="text-gray-500 text-sm">No tasks assigned to you yet.</p>
            </div>
          )}
        </div>

        {/* Task Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h3>
          <div className="space-y-4">
            <ProgressItem
              label="Completed"
              value={taskStats.completed}
              total={taskStats.total}
              color="green"
            />
            <ProgressItem
              label="In Progress"
              value={taskStats.inProgress}
              total={taskStats.total}
              color="yellow"
            />
            <ProgressItem
              label="To Do"
              value={taskStats.todo}
              total={taskStats.total}
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
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

const ProgressItem = ({ label, value, total, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value} / {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">{percentage}%</div>
    </div>
  );
};

const getStageDisplayName = (stage) => {
  switch (stage) {
    case 'todo': return 'To Do';
    case 'in progress':
    case 'in-progress': return 'In Progress';
    case 'review': return 'Review';
    case 'completed': return 'Completed';
    case 'backlog': return 'Backlog';
    default: return stage;
  }
};

export default UserOverview;