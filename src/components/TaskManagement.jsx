// src/components/TaskManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState(null);

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    stage: 'todo',
    dueDate: '',
    assignee: ''
  });

  const [subtaskForm, setSubtaskForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/task/');
      
      // Handle the direct array response
      let tasksData = [];
      if (Array.isArray(response.data)) {
        tasksData = response.data;
      } else if (response.data.tasks) {
        tasksData = response.data.tasks;
      } else if (response.data.data) {
        tasksData = response.data.data;
      }
      
      console.log('Fetched tasks:', tasksData); // Debug log
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/get-team');
      let usersData = [];
      
      if (response.data.users) {
        usersData = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data.data) {
        usersData = response.data.data;
      }
      
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/task/create', taskForm);
      console.log('Create task response:', response.data); // Debug log
      
      setSuccessMessage('Task created successfully!');
      setTaskForm({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        stage: 'todo', 
        dueDate: '', 
        assignee: '' 
      });
      setShowCreateForm(false);
      
      // Refresh the task list
      await fetchTasks();
      
    } catch (err) {
      setError('Failed to create task: ' + (err.response?.data?.message || err.message));
      console.error('Error creating task:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setActionLoading('update');
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.put(`http://localhost:5000/api/task/update/${selectedTask._id}`, taskForm);
      console.log('Update task response:', response.data); // Debug log
      
      setSuccessMessage('Task updated successfully!');
      setShowEditForm(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task: ' + (err.response?.data?.message || err.message));
      console.error('Error updating task:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setActionLoading(`delete-${taskId}`);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.delete(`http://localhost:5000/api/task/delete-restore/${taskId}`);
      console.log('Delete task response:', response.data); // Debug log
      
      setSuccessMessage('Task deleted successfully!');
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting task:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeStage = async (taskId, newStage) => {
    setActionLoading(`stage-${taskId}`);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.put(`http://localhost:5000/api/task/change-stage/${taskId}`, { stage: newStage });
      console.log('Change stage response:', response.data); // Debug log
      
      setSuccessMessage('Task stage updated successfully!');
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task stage: ' + (err.response?.data?.message || err.message));
      console.error('Error changing stage:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSubtask = async (e) => {
    e.preventDefault();
    if (!selectedTaskForSubtask) return;

    setActionLoading('create-subtask');
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.put(`http://localhost:5000/api/task/create-subtask/${selectedTaskForSubtask._id}`, subtaskForm);
      console.log('Create subtask response:', response.data); // Debug log
      
      setSuccessMessage('Subtask created successfully!');
      setSubtaskForm({ title: '', description: '' });
      setShowSubtaskForm(false);
      setSelectedTaskForSubtask(null);
      await fetchTasks();
    } catch (err) {
      setError('Failed to create subtask: ' + (err.response?.data?.message || err.message));
      console.error('Error creating subtask:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicateTask = async (taskId) => {
    setActionLoading(`duplicate-${taskId}`);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`http://localhost:5000/api/task/duplicate/${taskId}`);
      console.log('Duplicate task response:', response.data); // Debug log
      
      setSuccessMessage('Task duplicated successfully!');
      await fetchTasks();
    } catch (err) {
      setError('Failed to duplicate task: ' + (err.response?.data?.message || err.message));
      console.error('Error duplicating task:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTrashTask = async (taskId) => {
    setActionLoading(`trash-${taskId}`);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.put(`http://localhost:5000/api/task/${taskId}`, { trashed: true });
      console.log('Trash task response:', response.data); // Debug log
      
      setSuccessMessage('Task moved to trash successfully!');
      await fetchTasks();
    } catch (err) {
      setError('Failed to trash task: ' + (err.response?.data?.message || err.message));
      console.error('Error trashing task:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditForm = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority || 'medium',
      stage: task.stage || 'todo',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignee: task.assignee?._id || task.assignees?.[0]?._id || ''
    });
    setShowEditForm(true);
  };

  const openSubtaskForm = (task) => {
    setSelectedTaskForSubtask(task);
    setShowSubtaskForm(true);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'todo': return 'bg-blue-100 text-blue-800';
      case 'in progress':
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'backlog': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create, assign, and track tasks</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchTasks}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">✅</div>
            <p className="text-green-800 font-medium">{successMessage}</p>
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

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select
                  value={taskForm.stage}
                  onChange={(e) => setTaskForm({ ...taskForm, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                />
              </div>
              {users.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={actionLoading === 'create'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50 flex items-center"
              >
                {actionLoading === 'create' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">All Tasks ({tasks.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      ID: {task._id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={task.stage}
                      onChange={(e) => handleChangeStage(task._id, e.target.value)}
                      disabled={actionLoading === `stage-${task._id}`}
                      className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStageColor(task.stage)}`}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      {getStageDisplayName(task.stage)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'medium'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.subtasks?.length || 0} subtasks
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(task)}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openSubtaskForm(task)}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Add Subtask
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDuplicateTask(task._id)}
                          disabled={actionLoading === `duplicate-${task._id}`}
                          className="text-purple-600 hover:text-purple-900 text-xs disabled:opacity-50"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={actionLoading === `delete-${task._id}`}
                          className="text-red-600 hover:text-red-900 text-xs disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first task.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Create First Task
            </button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {/* <div className="bg-gray-50 rounded-lg p-4">
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700">Debug Information</summary>
          <pre className="mt-2 text-xs bg-white p-2 rounded border">
            {JSON.stringify(tasks, null, 2)}
          </pre>
        </details>
      </div> */}
    </div>
  );
};

export default TaskManagement;