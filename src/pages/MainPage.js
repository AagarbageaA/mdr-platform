import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import UploadButton from '../components/UploadButton';
import ProcessFlow from '../components/ProcessFlow';
import { uploadFile, checkAnalysisStatus } from '../utils/api';
import './MainPage.css';

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  
  const stages = {
    NOT_STARTED: 0,
    UPLOADING: 1,
    UPLOADED: 2,
    ANALYZING_SPECIES: 3,
    SPECIES_DONE: 4,
    ANALYZING_RESISTANCE: 5,
    RESISTANCE_DONE: 6
  };

  useEffect(() => {
    // 檢查用戶是否已登入
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // 如果有分析ID，則定期檢查分析狀態
    if (analysisId) {
      const interval = setInterval(async () => {
        try {
          const status = await checkAnalysisStatus(analysisId);
          
          if (status.stage === 'species_analysis_complete') {
            setCurrentStage(stages.SPECIES_DONE);
            setAnalysisData(prev => ({
              ...prev,
              speciesResult: status.species_result
            }));
            
            // 開始抗藥性分析
            setCurrentStage(stages.ANALYZING_RESISTANCE);
          } 
          else if (status.stage === 'resistance_analysis_complete') {
            setCurrentStage(stages.RESISTANCE_DONE);
            setAnalysisData(prev => ({
              ...prev,
              resistanceResult: status.resistance_result
            }));
            
            // 分析完成，清除定時器
            clearInterval(interval);
          }
        } catch (error) {
          console.error('檢查分析狀態失敗:', error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [analysisId, stages]);

  const handleFileUpload = async (file) => {
    setCurrentStage(stages.UPLOADING);
    
    try {
      const response = await uploadFile(file);
      setAnalysisId(response.analysis_id);
      setCurrentStage(stages.UPLOADED);
      
      // 開始菌種分析
      setCurrentStage(stages.ANALYZING_SPECIES);
    } catch (error) {
      console.error('上傳文件失敗:', error);
      setCurrentStage(stages.NOT_STARTED);
      alert('上傳失敗，請重試');
    }
  };

  return (
    <div className="main-page">
      <AppBar isLoggedIn={isLoggedIn} />
      
      <div className="main-content">
        <div className="upload-section">
          <UploadButton onFileUpload={handleFileUpload} />
        </div>
        
        <div className="process-section">
          <h2>模型運作流程</h2>
          <ProcessFlow 
            currentStage={currentStage} 
            speciesResult={analysisData?.speciesResult}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;