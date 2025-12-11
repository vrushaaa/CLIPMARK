import { createContext, useContext, useState, useCallback } from 'react';
import tagService from '../services/tagService';

const TagContext = createContext(null);

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // Fetch all tags
  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tagService.getAllTags();
      setTags(data.tags || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tags');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get bookmarks by tag
  const getBookmarksByTag = useCallback(async (tagName) => {
    try {
      setLoading(true);
      setError(null);
      const data = await tagService.getBookmarksByTag(tagName);
      setSelectedTag(tagName);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch bookmarks by tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear selected tag
  const clearSelectedTag = useCallback(() => {
    setSelectedTag(null);
  }, []);

  const value = {
    tags,
    loading,
    error,
    selectedTag,
    fetchTags,
    getBookmarksByTag,
    clearSelectedTag,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTags must be used within a TagProvider');
  }
  return context;
};