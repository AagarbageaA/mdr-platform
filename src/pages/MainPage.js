import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import UploadButton from '../components/UploadButton';
import ProcessFlow from '../components/ProcessFlow';
import { uploadFile, analyzeSpecies, analyze_resistance } from '../utils/api';
import { useAnalysis } from '../context/AnalysisContext';
import {
  saveAnalysisData,
  loadAnalysisData,
  clearAnalysisData,
} from '../utils/analysisStorage';  // ✅ 引入工具方法
import './MainPage.css';
import { useLocation, useNavigate } from 'react-router-dom'; // 加入 useLocation
const MainPage = () => {
  const { analysisData, setAnalysisData } = useAnalysis();
  const [currentStage, setCurrentStage] = useState(0);
  const location = useLocation(); // 👈 取得來自 navigate 的 state
  const navigate = useNavigate(); // 👈 用於清除 state
  const stages = {
    NOT_STARTED: 0,
    UPLOADING: 1,
    UPLOADED: 2,
    ANALYZING_SPECIES: 3,
    SPECIES_DONE: 4,
    ANALYZING_RESISTANCE: 5,
    RESISTANCE_DONE: 6,
  };

  // ✅ 頁面載入時自動讀取 localStorage 的資料
  useEffect(() => {
    // 如果是從清除歷史導過來，清空分析資料
    if (location.state?.shouldClearStorage) {
      handleClearStorage(); // ✅ 清空資料
      // 清除 state 避免再次觸發
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      const storedData = loadAnalysisData();
      if (storedData) {
        setAnalysisData(storedData);
        setCurrentStage(stages.RESISTANCE_DONE);
      }
    }
  }, []);

  // 上傳檔案後的處理
  const handleFileUpload = async (file) => {
    setCurrentStage(stages.UPLOADING);
    try {
      const response = await uploadFile(file);
      const analysis_id = response.analysis_id;

      const newBaseData = {
        ...response,
        analysis_id: analysis_id,
      };
      console.log("current id:",analysis_id)
      setAnalysisData(newBaseData);
      saveAnalysisData(newBaseData);  // ✅ 初步儲存
      setCurrentStage(stages.UPLOADED);

      setCurrentStage(stages.ANALYZING_SPECIES);
      const species_result = await analyzeSpecies(analysis_id);

      // const parsedSpeciesData = {
      //   species: species_result.meta_species,
      //   probability: (species_result.meta_probability * 100).toFixed(2),
      //   chartData: species_result.species_prob_list.map(([label, prob]) => ({
      //     label,
      //     value: prob * 100,
      //   })),
      // };

      const updatedData = {
        ...newBaseData,
        species_result: species_result,
      };
      setAnalysisData(updatedData);
      saveAnalysisData(updatedData);  // ✅ 儲存更新後資料
      setCurrentStage(stages.SPECIES_DONE);
      console.log("更新完species result");
      setCurrentStage(stages.ANALYZING_RESISTANCE);
      const resistance_result = await analyze_resistance(analysis_id);
      console.log("resistance_result:", resistance_result);

      // const parsedResistanceData = {
      //   ...resistance_result,
      //   chartData: resistance_result.resistance_tuples.map(({ antibiotic, prob }) => ({
      //     label: antibiotic,
      //     value: Number((prob * 100).toFixed(2)), // 保留兩位小數的百分比數值
      //   }))

      // };

      const finalData = {
        ...updatedData,
        resistance_result: resistance_result,
      };

      setAnalysisData(finalData);
      saveAnalysisData(finalData);  // ✅ 最終儲存
      setCurrentStage(stages.RESISTANCE_DONE);

    } catch (error) {
      console.error('Error during analysis:', error);
      alert(error.message);
    }
  };

  // ✅ 清空資料
  const handleClearStorage = () => {
    setAnalysisData(null);
    setCurrentStage(stages.NOT_STARTED);
    clearAnalysisData();
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
          <div>
            {analysisData ? (
              <div>
                <h3>當前資料：{analysisData.analysis_id}</h3>
              </div>
            ) : (
              <p>尚未選擇資料</p>
            )}
          </div>
          <ProcessFlow
            currentStage={currentStage}
            species_result={analysisData?.species_result}
            resistance_result={analysisData?.resistance_result?.resistant_antibiotics}
          />
        </div>
        <button className="clear-storage-button" onClick={handleClearStorage}>
        清空資料
      </button>
      </div>
      
    </div>
  );
};

export default MainPage;
