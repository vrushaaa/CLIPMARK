import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', {
        name: userData.fullName,
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        username: credentials.username, // Your backend accepts username or email
        password: credentials.password,
      });
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Google login / signup
  googleLogin: async (data) => {
    try {
      const response = await api.post('/auth/google', {
        token: data.token,
      });

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    } catch (error) {
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password });
  },

};

export default authService;