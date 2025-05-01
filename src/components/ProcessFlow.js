import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProcessFlow.css';

const ProcessFlow = ({ currentStage, speciesResult, resistanceResult }) => {
  const navigate = useNavigate();

  const stages = {
    NOT_STARTED: 0,
    UPLOADING: 1,
    UPLOADED: 2,
    ANALYZING_SPECIES: 3,
    SPECIES_DONE: 4,
    ANALYZING_RESISTANCE: 5,
    RESISTANCE_DONE: 6
  };

  const handleSpeciesClick = () => {
    if (currentStage >= stages.SPECIES_DONE) {
      navigate('/species-result');
    }
  };

  const handleResistanceClick = () => {
    if (currentStage >= stages.RESISTANCE_DONE) {
      navigate('/resistance');
    }
  };

  return (
    <div className="process-flow">
      <div className={`flow-step ${currentStage >= stages.UPLOADED ? 'completed' : ''}`}>
        <div className="step-content">
          模型分析上傳數據<br />(MALTI-TOF MS)
        </div>
      </div>
      
      <div className="arrow">➡</div>
      
      <div 
        className={`flow-step ${currentStage >= stages.SPECIES_DONE ? 'completed clickable' : 
          currentStage === stages.ANALYZING_SPECIES ? 'processing' : ''}`}
        onClick={handleSpeciesClick}
      >
        <div className="step-content">
          {currentStage === stages.ANALYZING_SPECIES ? '判斷菌種中...' : 
           currentStage >= stages.SPECIES_DONE ? <>
           <div>{`菌種類型: ${speciesResult?.species}`}</div>
           <br></br>
           <div className="comment">點擊以查看更多</div>
         </> : '判斷該數據菌種'}
        </div>
      </div>
      
      <div className="arrow">➡</div>
      
      <div 
        className={`flow-step ${currentStage === stages.RESISTANCE_DONE ? 'completed clickable' : 
          currentStage === stages.ANALYZING_RESISTANCE ? 'processing' : ''}`}
        onClick={handleResistanceClick}
      >
        <div className="step-content">
  {currentStage === stages.ANALYZING_RESISTANCE ? (
    '判斷抗藥性中...'
  ) : currentStage === stages.RESISTANCE_DONE ? (
    <>
      <div>{`抗藥性: ${resistanceResult?.resistantTo}`}</div>
      <br></br>
      <div className="comment">點擊以查看更多</div>
    </>
  ) : (
    '判斷該菌株多重抗藥性'
  )}
</div>

      </div>
    </div>
  );
};

export default ProcessFlow;
