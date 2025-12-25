import axios from 'axios';

// Get API base URL from environment variable or default to localhost:3001
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
/**
 * Auth API endpoints
 */
export const authAPI = {
  /**
   * Sign up a new user
   * @param {Object} userData - User registration data (name, email, password)
   * @returns {Promise} API response with token and user data
   */
  signup: (userData) => api.post('/auth/signup', userData),
  
  /**
   * Log in an existing user
   * @param {Object} credentials - User login credentials (email, password)
   * @returns {Promise} API response with token and user data
   */
  login: (credentials) => api.post('/auth/login', credentials),
};

// PUBLIC_INTERFACE
/**
 * Profile API endpoints
 */
export const profileAPI = {
  /**
   * Get current user profile
   * @returns {Promise} API response with user profile data
   */
  get: () => api.get('/profile'),
  
  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data (name, email, password)
   * @returns {Promise} API response with updated user data
   */
  update: (profileData) => api.put('/profile', profileData),
};

// PUBLIC_INTERFACE
/**
 * Tasks API endpoints
 */
export const tasksAPI = {
  /**
   * Get all tasks with optional search and filter
   * @param {Object} params - Query parameters (search, status, page, limit)
   * @returns {Promise} API response with tasks array
   */
  getAll: (params) => api.get('/tasks', { params }),
  
  /**
   * Get a single task by ID
   * @param {string} id - Task ID
   * @returns {Promise} API response with task data
   */
  getOne: (id) => api.get(`/tasks/${id}`),
  
  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description, status)
   * @returns {Promise} API response with created task
   */
  create: (taskData) => api.post('/tasks', taskData),
  
  /**
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} API response with updated task
   */
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise} API response
   */
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;
