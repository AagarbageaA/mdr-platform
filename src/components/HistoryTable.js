import React from 'react';
import './HistoryTable.css';
import { FaSearch } from 'react-icons/fa';

const HistoryTable = ({ data, onViewDetails }) => {
  return (
    <div className="history-table-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>上傳檔案名稱</th>
            <th>上傳日期</th>
            <th>菌種判斷結果</th>
            <th>抗藥性判斷結果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">尚無資料</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.analysisId}>
                <td>{item.filename}</td>
                <td>{item.uploadDate}</td>
                {/* Render species and resistance result properly */}
                <td>{item.speciesResult?.species}</td>  {/* Display species name */}
                <td>{item.resistanceResult?.resistantTo.join(", ")}</td>  {/* Display resistance info */}
                <td>
                  <button 
                    className="view-button"
                    onClick={() => onViewDetails(item.analysisId)}
                  >
                    <FaSearch />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
