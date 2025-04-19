// src/utils/api.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// 用於處理API請求的輔助函數
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// 上傳數據文件
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse(response);
};

// 檢查分析狀態
export const checkAnalysisStatus = async (analysisId) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/status`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

// 獲取菌種分析結果
export const getSpeciesResult = async (analysisId) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/species`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

// 獲取菌種特徵
export const getSpeciesFeatures = async (analysisId) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/species/features`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

// 獲取抗藥性分析結果
export const getResistanceResult = async (analysisId) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/resistance`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

// 獲取抗藥性特徵
export const getResistanceFeatures = async (analysisId) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/resistance/features`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

// 獲取用戶歷史數據
export const getUserHistory = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('未登入');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}/user/history`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

// 用戶登入
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(response);
  localStorage.setItem('token', data.token);
  return data;
};

// 用戶登出
export const logout = () => {
  localStorage.removeItem('token');
};