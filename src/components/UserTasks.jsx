// src/components/UserTasks.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const token = localStorage.getItem("authToken");

  // Fetch only user tasks
  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/task/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      setError("Failed to load tasks: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  // ⭐ Filter ONLY assigned tasks (same logic as UserOverview Page)
  const assignedTasks = tasks.filter(task => task.assignee || task.assignees?.length > 0);

  const handleChangeStage = async (taskId, newStage) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(
        `http://localhost:5000/api/task/change-stage/${taskId}`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Task stage updated successfully!');
      fetchMyTasks(); // Refresh after update
    } catch (err) {
      setError('Failed to update task stage: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">Tasks assigned to you</p>
        </div>
        <div className="text-sm text-gray-500">
          {assignedTasks.length} task(s) found
        </div>
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

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {assignedTasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={task.stage}
                      onChange={(e) => handleChangeStage(task._id, e.target.value)}
                      disabled={loading}
                      className={`text-xs font-medium rounded-full border-0 focus:ring-2 ${getStageColor(task.stage)}`}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 text-xs"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowDetailModal(true);
                      }}
                    >View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {assignedTasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">😎</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-500">You don't have any tasks yet.</p>
          </div>
        )}
      </div>
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg relative">

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetailModal(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-3">{selectedTask.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{selectedTask.description}</p>

            <h3 className="font-semibold text-gray-700 mb-2">Subtasks</h3>

            {/* Subtask List */}
            {selectedTask.subtasks && selectedTask.subtasks.length > 0 ? (
              <ul className="space-y-2">
                {selectedTask.subtasks.map((sub, index) => (
                  <li key={index} className="bg-gray-100 rounded-lg p-2 text-sm">
                    <div className="font-medium">{sub.title}</div>
                    <div className="text-xs text-gray-500">{sub.status}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No subtasks available.</p>
            )}
          </div>
        </div>
      )}

    </div>


  );
};

export default UserTasks;
