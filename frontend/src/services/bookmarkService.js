import api from './api';

const bookmarkService = {
  //Get all bookmarks with filters

  getAllBookmarks: async ({ archived = false, q = "" } = {}) => {
    try {
      const response = await api.get("/api/bookmarks", {
        params: {
          archived,
          q,
        },
        headers: { Accept: "application/json" },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },



  // Get bookmarks for dashboard (non-archived)
  getDashboardBookmarks: async () => {
    try {
      const response = await api.get('/api/bookmarkstwo', {
        headers: { Accept: 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get archived bookmarks
  getArchivedBookmarks: async () => {
    try {
      const response = await api.get('/api/bookmarks?archived=true', {
        headers: { Accept: 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single bookmark
  getBookmark: async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/api/bookmarks/${id}`, {
        params: { user_id: user.id }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create bookmark
  createBookmark: async (bookmarkData) => {
    try {
      const response = await api.post('/api/bookmarks', {
        url: bookmarkData.url,
        title: bookmarkData.title || null,
        notes: bookmarkData.notes || '',
        tags: bookmarkData.tags || [],
        archived: bookmarkData.archived || false,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update bookmark
  updateBookmark: async (id, bookmarkData) => {
    try {
      const response = await api.put(`/api/bookmarks/${id}`, {
        title: bookmarkData.title,
        notes: bookmarkData.notes,
        tags: bookmarkData.tags,
        archived: bookmarkData.archived,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete bookmark
  deleteBookmark: async (id) => {
    try {
      const response = await api.delete(`/api/bookmarks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle archive
  toggleArchive: async (id) => {
    try {
      const response = await api.patch(`/api/bookmarks/${id}/archive`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get QR code
  getQRCode: async (id) => {
    try {
      const response = await api.get(`/api/bookmarks/${id}/qr`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  toggleFavourite: async (id) => {
    try {
      const response = await api.patch(`/api/bookmarks/${id}/favourite`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getFavouriteBookmarks: async () => {
  try {
    const response = await api.get('/api/bookmarks', {
      params: { favourite: 'true' }, 
      headers: { Accept: 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},


  // Export bookmarks
  exportBookmarks: async () => {
    try {
      const response = await api.get('/api/export', {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clipmark_export_${new Date().toISOString().split('T')[0]}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default bookmarkService;