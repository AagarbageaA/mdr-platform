import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import UploadButton from '../components/UploadButton';
import ProcessFlow from '../components/ProcessFlow';
import { loadAnalysisData, saveAnalysisData, clearAnalysisData } from '../utils/storage';
import './MainPage.css';
import { mockData } from '../utils/mockData';

const MainPage = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);

  const stages = {
    NOT_STARTED: 0,
    UPLOADING: 1,
    UPLOADED: 2,
    ANALYZING_SPECIES: 3,
    SPECIES_DONE: 4,
    ANALYZING_RESISTANCE: 5,
    RESISTANCE_DONE: 6,
  };

  useEffect(() => {
    // 從 localStorage 中載入資料
    const savedData = loadAnalysisData();
    console.log('Loaded saved data:', savedData);  // 打印載入的資料
    if (savedData) {
      setAnalysisData(savedData);
      setCurrentStage(savedData.resistanceResult ? stages.RESISTANCE_DONE : stages.SPECIES_DONE);
    }
  }, []);

  const simulateAnalysis = async () => {
    setCurrentStage(stages.UPLOADING);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStage(stages.UPLOADED);
  
    // Step 1: 分析菌種
    setCurrentStage(stages.ANALYZING_SPECIES);
    const newSpeciesData = await new Promise(resolve => {
      setTimeout(() => resolve(mockData[0].speciesResult), 2000);
    });
  
    // 更新分析資料，暫時只有菌種結果
    const partialData = {
      analysisId: mockData[0].analysisId,
      filename: mockData[0].filename,
      speciesResult: newSpeciesData,
    };
    saveAnalysisData(partialData);
    setAnalysisData(partialData);
    setCurrentStage(stages.SPECIES_DONE);
  
    // Step 2: 分析抗藥性
    setCurrentStage(stages.ANALYZING_RESISTANCE);
    const newResistanceData = await new Promise(resolve => {
      setTimeout(() => resolve(mockData[0].resistanceResult), 4000);
    });
  
    const fullData = {
      ...partialData,
      resistanceResult: newResistanceData,
      speciesFeatures: mockData[0].speciesFeatures,
      resistanceFeatures: mockData[0].resistanceFeatures,
    };
    saveAnalysisData(fullData);
    setAnalysisData(fullData);
    setCurrentStage(stages.RESISTANCE_DONE);
  };
  

  const handleFileUpload = (file) => {
    clearAnalysisData();  // Clear old data if uploading a new file
    simulateAnalysis();   // Simulate the analysis
  };

  // 清空 localStorage 的函式
  const handleClearStorage = () => {
    clearAnalysisData(); // 呼叫 clearAnalysisData 清空資料
    setAnalysisData(null); // 清空當前顯示的分析數據
    setCurrentStage(stages.NOT_STARTED); // 重設為初始階段
  };

  return (
    <div className="main-page">
      <AppBar />
      <div className="main-content">
        <div className="upload-section">
          <UploadButton onFileUpload={handleFileUpload} />
        </div>
        <div className="process-section">
          <h2>模型運作流程</h2>
          {/* 顯示當前資料的檔案名稱 */}
          <div>
            {analysisData ? (
              <div>
                <h3>當前資料：{analysisData.analysisId}</h3>
              </div>
            ) : (
              <p>尚未選擇資料</p>
            )}
          </div>
          <ProcessFlow currentStage={currentStage} speciesResult={analysisData?.speciesResult} resistanceResult={analysisData?.resistanceResult} />
        </div>
      </div>
      
      {/* 右下角的清空資料按鈕 */}
      <button className="clear-storage-button" onClick={handleClearStorage}>
        清空資料
      </button>
    </div>
  );
};

export default MainPage;
