import api from './api';

const tagService = {
  // Get all tags
  getAllTags: async () => {
    try {
      const response = await api.get('/api/tags', {
        headers: { Accept: 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get bookmarks by tag
  getBookmarksByTag: async (tagName) => {
    try {
      const response = await api.get('/api/bookmarks', {
        params: { tag: tagName },
        headers: { Accept: 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default tagService;