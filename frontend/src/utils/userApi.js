import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all users (admin only)
 * @param {number} adminId - The admin user ID for authentication
 * @returns {Promise} Promise resolving to array of users
 */
export const fetchAllUsers = async (adminId) => {
  try {
    const response = await apiClient.get('/admin/users/', {
      params: { admin_id: adminId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch users' };
  }
};

/**
 * Create a new user (admin only)
 * @param {object} userData - User data (username, email, first_name, last_name, role, phone_no, department)
 * @param {number} adminId - The admin user ID for authentication
 * @returns {Promise} Promise resolving to created user data
 */
export const createUser = async (userData, adminId) => {
  try {
    const response = await apiClient.post('/admin/users/create/', {
      ...userData,
      admin_id: adminId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create user' };
  }
};

/**
 * Update user data (admin only)
 * @param {number} userId - The user ID to update
 * @param {object} updateData - Data to update (role, username, password)
 * @param {number} adminId - The admin user ID for authentication
 * @returns {Promise} Promise resolving to updated user data
 */
export const updateUser = async (userId, updateData, adminId) => {
  try {
    const response = await apiClient.patch(`/admin/users/${userId}/`, {
      ...updateData,
      admin_id: adminId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update user' };
  }
};

/**
 * Delete a user (admin only)
 * @param {number} userId - The user ID to delete
 * @param {number} adminId - The admin user ID for authentication
 * @returns {Promise} Promise resolving to response message
 */
export const deleteUser = async (userId, adminId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}/`, {
      data: { admin_id: adminId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete user' };
  }
};

export default apiClient;
