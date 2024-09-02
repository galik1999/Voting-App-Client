import React from "react";

const Login = (props) => {
  return (
    <div className="login-container">
      <h1 className="welcome-message">
        Welcome to decentralized voting application
      </h1>
      {props.votingStatus && !props.isDeploymentLoading ? <button className="login-button" onClick={props.connectWallet}>
        Login to Metamask as a voter
        </button>
        : <button className="login-button" onClick={props.connectWallet}>
        Watch previous ballot results
        </button>}
      <button className="login-button" onClick={props.logInAdmin}>
        Login as Admin to start new ballot
      </button>
      <p className="error-message">{props.adminLoginError}</p>
      {props.canConnectAdmin ? (
        <div className="verification-form">
          <form action="start new ballot" onSubmit={props.startBallot}>
            <input
              required
              type="text"
              value={props.userName}
              onChange={(e) => {
                props.setUserName(e.target.value);
              }}
              placeholder="Enter your user name"
            />
            <input
              required
              type="text"
              value={props.userName}
              onChange={(e) => {
                props.setPassword(e.target.value);
              }}
              placeholder="Enter your password"
            />
            <input type="submit" value="Start new ballot"></input>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Login;
