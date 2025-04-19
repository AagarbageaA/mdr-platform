import React from 'react';
import './BackButton.css';

const BackButton = ({ text, onClick }) => {
  return (
    <button className="back-button" onClick={onClick}>
      <span className="back-arrow">↩</span>
      {text}
    </button>
  );
};

export default BackButton;