import { mockData } from '../utils/mockData';

// 模擬上傳檔案
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('上傳失敗');
  return await res.json();
};

// 模擬啟動菌種分析
export const startSpeciesAnalysis = async (taskId) => {
  // 這裡可以根據 taskId 模擬返回不同的結果
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[0].speciesResult); // 假設使用 mockData 的第一筆資料
    }, 500); // 模擬 API 延遲
  });
};

// 模擬啟動抗藥性分析
export const startResistanceAnalysis = async (taskId) => {
  // 這裡可以根據 taskId 模擬返回不同的結果
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[0].resistanceResult); // 假設使用 mockData 的第一筆資料
    }, 2000); // 模擬 API 延遲
  });
};

// 模擬取得菌種分析結果
export const getSpeciesResult = async (taskId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[0].speciesResult); // 假設使用 mockData 的第一筆資料
    }, 500); // 模擬 API 延遲
  });
};

// 模擬取得抗藥性分析結果
export const getResistanceResult = async (taskId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[0].resistanceResult); // 假設使用 mockData 的第一筆資料
    }, 2000); // 模擬 API 延遲
  });
};

// 模擬取得使用者歷史分析紀錄
export const getUserHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData); // 假設返回所有的 mockData
    }, 500); // 模擬 API 延遲
  });
};

// 模擬取得抗藥性特徵資料
export const getResistanceFeatures = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[0].resistanceFeatures); // 假設使用 mockData 的第一筆資料
    }, 500); // 模擬 API 延遲
  });
};

// 模擬取得菌種特徵資料
export const getSpeciesFeatures = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[0].speciesFeatures); // 假設使用 mockData 的第一筆資料
    }, 500); // 模擬 API 延遲
  });
};
