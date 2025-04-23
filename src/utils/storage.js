// utils/storage.js

export const loadAnalysisData = () => {
    const savedData = localStorage.getItem('analysisData');
    return savedData ? JSON.parse(savedData) : null;
  };
  
  export const saveAnalysisData = (data) => {
    localStorage.setItem('analysisData', JSON.stringify(data));
  };
  
  export const clearAnalysisData = () => {
    localStorage.removeItem('analysisData');
  };
  