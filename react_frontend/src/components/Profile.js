import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../utils/api';

// PUBLIC_INTERFACE
/**
 * Profile component for viewing and editing user profile
 */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.password && formData.password.length < 6) {
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
    setMessage({ type: '', text: '' });

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      
      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await profileAPI.update(updateData);
      updateUser(response.data.user);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Cancel editing and reset form
   */
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-textColor">Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Edit Profile
            </button>
          )}
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

        {isEditing ? (
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
              />
              {errors.email && (
                <p className="mt-1 text-error text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-textColor text-sm font-medium mb-2">
                New Password (optional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className={`w-full px-4 py-2 bg-background border ${
                  errors.password ? 'border-error' : 'border-gray-600'
                } rounded-lg text-textColor focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.password && (
                <p className="mt-1 text-error text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Name
              </label>
              <p className="text-textColor text-lg">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Email
              </label>
              <p className="text-textColor text-lg">{user?.email || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
