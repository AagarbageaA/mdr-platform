// src/utils/mockData.js

// 模擬菌種資料
export const mockSpeciesData = {
    species: 'K. pneumoniae',
    probability: 86,
    chartData: {
      labels: ['K. pneumoniae', 'A. baumannii', 'E. faecium', 'S. aureus', 'P. aeruginosa'],
      datasets: [
        {
          label: '菌種機率 (%)',
          data: [86, 30, 20, 15, 10],
        },
      ],
    },
  };
  
  // 模擬抗藥性資料
  export const mockResistanceData = {
    species: 'K. pneumoniae',
    resistantTo: ['AMC', 'CAZ', 'CRO'],
    chartData: {
      labels: ['AMC', 'CAZ', 'CIP', 'CRO', 'CXM'],
      datasets: [
        {
          label: '抗藥性程度',
          data: [85, 90, 15, 88, 20],
        },
      ],
    },
  };
  
  // 模擬歷史數據
  export const mockHistoryData = [
    {
      id: '12345',
      fileName: '樣本檔案_20250401',
      uploadDate: '2025-04-01',
      speciesResult: 'K. pneumoniae',
      resistanceResult: 'AMC, CAZ, CRO'
    },
    {
      id: '12346',
      fileName: '樣本檔案_20250402',
      uploadDate: '2025-04-02',
      speciesResult: 'S. aureus',
      resistanceResult: 'OXA, PEN'
    },
    {
      id: '12347',
      fileName: '樣本檔案_20250403',
      uploadDate: '2025-04-03',
      speciesResult: 'A. baumannii',
      resistanceResult: 'CAZ, CIP, MEM'
    }
  ];