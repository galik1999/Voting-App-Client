import React from "react";

const Login = (props) => {
  return (
    <div className="main-screen">
      <h1 className="welcome-message">
        Welcome to decentralized voting application
      </h1>
      <div className="login-container">
        {props.votingStatus && !props.isDeploymentLoading ? (
          <button className="login-button" onClick={props.connectWallet}>
            Login to Metamask as a voter
          </button>
        ) : props.contractAddress === '0x' ? null : (
          <button className="login-button" onClick={props.connectWallet}>
            Watch previous ballot results
          </button>
        )}
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
                type="password"
                value={props.password}
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
    </div>
  );
};

export default Login;
