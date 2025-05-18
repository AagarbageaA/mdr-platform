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
            <th>查看資料</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <>
              <tr>
                <td colSpan="5" className="no-data">尚無資料</td>
              </tr>
            </>
          ) : (
            data.map((item) => (
              <tr key={item.analysis_id}>
                <td>{item.file_name}</td>
                <td>{item.upload_time}</td>
                <td>{item.species_result?.species}</td>
                <td>{item.resistance_result?.resistant_antibiotics.join(", ")}</td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => onViewDetails(item.analysis_id)}
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
