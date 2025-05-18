const API_URL = 'http://localhost:5000/api';

// 上傳檔案
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json(); // ✅ 只解析一次

  if (!response.ok) {
    throw new Error(data.message || '上傳失敗');
  }
  console.log(data)
  return data;
};

// 執行物種分析
export const analyzeSpecies = async (analysis_id) => {
  const response = await fetch(`${API_URL}/analysis/${analysis_id}/species`, {
    method: 'POST',
  });

  const data = await response.json(); // ✅ 只解析一次

  if (!response.ok) {
    throw new Error(data.error || '物種分析失敗');
  }
  console.log(data)
  return data;
};

// 執行抗藥性分析
export const analyze_resistance = async (analysis_id) => {
  const response = await fetch(`${API_URL}/analysis/${analysis_id}/resistance`, {
    method: 'POST',
  });

  const data = await response.json(); // ✅ 只解析一次

  if (!response.ok) {
    throw new Error(data.error || '抗藥性分析失敗');
  }
  console.log(data)
  return data;
};

// 查詢分析狀態
export const checkStatus = async (analysis_id) => {
  const response = await fetch(`${API_URL}/analysis/${analysis_id}/status`, {
    method: 'GET',
  });

  const data = await response.json(); // ✅ 只解析一次

  if (!response.ok) {
    throw new Error(data.message || '查詢狀態失敗');
  }

  return data;
};

// 取得歷史紀錄
export const getUserHistory = async () => {
  const response = await fetch(`${API_URL}/history`, {
    method: 'GET',
  });

  const data = await response.json(); // ✅ 只解析一次

  if (!response.ok) {
    throw new Error('取得歷史紀錄失敗');
  }

  return data;
};

export const clearUserHistory = async () => {
  const response = await fetch(`${API_URL}/clearHistory`, {
    method: 'POST',  // 你想用 POST
  });

  if (!response.ok) {
    throw new Error('清除歷史紀錄失敗');
  }

  // 假設後端沒回傳內容，可以直接回傳 true 表示成功
  // 如果後端有回傳 JSON，這裡就要改成 await response.json()
  return true;
};
