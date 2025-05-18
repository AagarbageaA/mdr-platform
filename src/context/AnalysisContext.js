import React, { createContext, useState, useContext, useEffect } from 'react';

export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  // 嘗試從 localStorage 讀取已保存的資料
  const savedAnalysisData = JSON.parse(localStorage.getItem('analysisData'));

  // 如果 localStorage 沒有資料，就設定為 null
  const [analysisData, setAnalysisData] = useState(savedAnalysisData || null);

  // 當 analysisData 改變時，將資料儲存到 localStorage
  useEffect(() => {
    if (analysisData) {
      console.log('Saving analysisData to localStorage:', analysisData);
      localStorage.setItem('analysisData', JSON.stringify(analysisData)); // 儲存資料
    }
  }, [analysisData]);  // 監控 analysisData 改變

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
