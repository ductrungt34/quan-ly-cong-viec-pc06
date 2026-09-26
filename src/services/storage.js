import { OFFICERS, DEFAULT_CATEGORIES, INITIAL_DOCUMENTS, INITIAL_TASKS } from '../constants/officersData';

const STORAGE_KEYS = {
  DOCUMENTS: 'pc06_documents_v1',
  TASKS: 'pc06_tasks_v1',
  CATEGORIES: 'pc06_categories_v1',
  CURRENT_USER_ID: 'pc06_current_user_v1'
};

export const StorageService = {
  // Categories
  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (e) {
      console.error(e);
      return DEFAULT_CATEGORIES;
    }
  },
  saveCategories(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  },

  // Documents
  getDocuments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : INITIAL_DOCUMENTS;
    } catch (e) {
      console.error(e);
      return INITIAL_DOCUMENTS;
    }
  },
  saveDocuments(documents) {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (e) {
      console.error(e);
    }
  },

  // Tasks
  getTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch (e) {
      console.error(e);
      return INITIAL_TASKS;
    }
  },
  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  },

  // Current User (default to Thượng tá Đỗ Thị Thu - Đội trưởng)
  getCurrentUserId() {
    try {
      const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return id || 'ch_1';
    } catch (e) {
      return 'ch_1';
    }
  },
  saveCurrentUserId(id) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    } catch (e) {
      console.error(e);
    }
  },

  // Reset to default sample data
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
};
