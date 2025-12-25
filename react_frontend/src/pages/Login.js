import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';

// PUBLIC_INTERFACE
/**
 * Login page component with form validation
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // PUBLIC_INTERFACE
  /**
   * Handle form field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PUBLIC_INTERFACE
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-textColor mb-6 text-center">
          Login
        </h1>

        {apiError && (
          <div className="mb-4 p-3 bg-error/10 border border-error rounded-lg text-error text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-textColor text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border ${
                errors.email ? 'border-error' : 'border-gray-600'
              } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-error text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-textColor text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border ${
                errors.password ? 'border-error' : 'border-gray-600'
              } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-error text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-textColor text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-secondary hover:text-primary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
