import React, { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../utils/api';

// PUBLIC_INTERFACE
/**
 * Tasks component for managing tasks with CRUD operations, search, and filter
 */
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // PUBLIC_INTERFACE
  /**
   * Fetch tasks from API with search and filter parameters
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchText) params.search = searchText;
      if (statusFilter) params.status = statusFilter;

      const response = await tasksAPI.getAll(params);
      setTasks(response.data.tasks || response.data || []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to fetch tasks',
      });
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter]);

  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // PUBLIC_INTERFACE
  /**
   * Handle form field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Validate form fields
   * @returns {boolean} Whether form is valid
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PUBLIC_INTERFACE
  /**
   * Open modal for creating new task
   */
  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
    });
    setErrors({});
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  // PUBLIC_INTERFACE
  /**
   * Open modal for editing existing task
   * @param {Object} task - Task to edit
   */
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setErrors({});
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle form submission for create or update
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (editingTask) {
        await tasksAPI.update(editingTask._id || editingTask.id, formData);
        setMessage({ type: 'success', text: 'Task updated successfully!' });
      } else {
        await tasksAPI.create(formData);
        setMessage({ type: 'success', text: 'Task created successfully!' });
      }
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Operation failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Delete a task
   * @param {string} id - Task ID
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      await tasksAPI.delete(id);
      setMessage({ type: 'success', text: 'Task deleted successfully!' });
      fetchTasks();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete task',
      });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Get status badge color
   * @param {string} status - Task status
   * @returns {string} CSS classes for status badge
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'in-progress':
        return 'bg-secondary text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-surface rounded-lg shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-textColor">Tasks</h2>
          <button
            onClick={handleCreate}
            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Create Task
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-success/10 border border-success text-success'
                : 'bg-error/10 border border-error text-error'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 bg-background border border-gray-600 rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-gray-600 rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-8 text-textColor">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tasks found. Create your first task!
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id || task.id}
                className="bg-background border border-gray-600 rounded-lg p-4 hover:border-primary transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-textColor mb-1">
                      {task.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {task.description}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-secondary hover:bg-primary text-white px-3 py-1 rounded text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id || task.id)}
                      className="bg-error hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-textColor mb-4">
              {editingTask ? 'Edit Task' : 'Create Task'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-textColor text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-background border ${
                    errors.title ? 'border-error' : 'border-gray-600'
                  } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.title && (
                  <p className="mt-1 text-error text-sm">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-textColor text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2 bg-background border ${
                    errors.description ? 'border-error' : 'border-gray-600'
                  } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.description && (
                  <p className="mt-1 text-error text-sm">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-textColor text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
