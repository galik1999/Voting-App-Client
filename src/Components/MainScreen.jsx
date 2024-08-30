import React from 'react';

const MainScreen = ({ onProceed }) => {
  return (
    <div className="main-screen">
      <h1>Decentralized Voting System</h1>
      <div className="explanation">
        <p>Welcome to our blockchain-based voting system. This platform ensures:</p>
        <ul>
          <li>Transparent and tamper-proof voting</li>
          <li>Voter anonymity</li>
          <li>Real-time result updates</li>
          <li>Secure voter verification</li>
        </ul>
        <p>To participate, you'll need to:</p>
        <ol>
          <li>Have some small amount of ethereum for gas fees payment</li>
          <li>Connect your MetaMask wallet</li>
          <li>Verify your voter ID</li>
          <li>Cast your vote securely</li>
        </ol>
      </div>
      <button className="proceed-button" onClick={onProceed}>
        Proceed to Login
      </button>
    </div>
  );
};

export default MainScreen;