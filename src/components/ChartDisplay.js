import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ChartDisplay.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ data, title, type }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: type === 'resistance' ? 100 : undefined,
        ticks: {
          callback: function(value) {
            return value + (type === 'resistance' ? '' : '%');
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  // 根據圖表類型選擇顏色
  const getColors = () => {
    if (type === 'species') {
      return [
        'rgba(54, 162, 235, 0.8)',   // K. pneumoniae - 藍色
        'rgba(153, 102, 255, 0.8)',  // A. baumannii - 紫色
        'rgba(255, 159, 64, 0.8)',   // E. faecium - 橙色
        'rgba(75, 192, 192, 0.8)',   // S. aureus - 綠藍色
        'rgba(255, 99, 132, 0.8)',   // P. aeruginosa - 粉紅色
      ];
    } else if (type === 'resistance') {
      // 為抗藥性結果使用紅色和黃色
      return data.datasets[0].data.map(value => 
        value > 50 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 205, 86, 0.8)'
      );
    }
    return ['rgba(54, 162, 235, 0.8)'];
  };

  // 深拷貝數據並應用顏色
  const chartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: getColors(),
      borderColor: getColors().map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }))
  };

  return (
    <div className="chart-container">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
};

export default ChartDisplay;