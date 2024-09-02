
// LoadingSpinner.js
import React from 'react';
import '../LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className='loading-container'>
    <h1>Please wait while the ballot is starting.</h1>
    <h1>it may take a few minutes...</h1>
    <div className="loadingSpinner"></div>
    </div>
  );
};

export default LoadingSpinner;
