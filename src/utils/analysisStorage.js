// utils/analysisStorage.js

const STORAGE_KEY = 'analysisData';

export const saveAnalysisData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save analysis data to localStorage:', error);
  }
};

export const loadAnalysisData = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Failed to load analysis data from localStorage:', error);
    return null;
  }
};

export const clearAnalysisData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear analysis data from localStorage:', error);
  }
};
