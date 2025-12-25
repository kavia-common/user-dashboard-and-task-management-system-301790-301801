import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';

// PUBLIC_INTERFACE
/**
 * Signup page component with form validation
 */
const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const { confirmPassword, ...signupData } = formData;
      const response = await authAPI.signup(signupData);
      const { token, user } = response.data;
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-textColor mb-6 text-center">
          Sign Up
        </h1>

        {apiError && (
          <div className="mb-4 p-3 bg-error/10 border border-error rounded-lg text-error text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-textColor text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border ${
                errors.name ? 'border-error' : 'border-gray-600'
              } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-error text-sm">{errors.name}</p>
            )}
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-textColor text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border ${
                errors.confirmPassword ? 'border-error' : 'border-gray-600'
              } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-error text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-textColor text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
