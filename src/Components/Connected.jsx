import React from "react";
import CalloutBox from "./CalloutBox";
import ResultsTable from "./ResultsTable";
import Clock from "./Clock";
import Button from "./Button";

const Connected = (props) => {

  return (
    <div className="connected-container">
      <h1 className="connected-header">You are Connected to Metamask</h1>
      <p className="connected-account">Metamask Account: {props.account}</p>
      <p className="connected-account">
        <Clock remainingTime={props.remainingTime}></Clock>
      </p>

      {!props.isVerified ? (
        <div className="verification-form">
          <input
            type="text"
            value={props.userId}
            onChange={(e) => {
              props.setUserId(e.target.value);
            }}
            placeholder="Enter your ID"
          />
          <button onClick={props.verifyVoter}>Verify</button>
          {props.verificationError && (
            <p className="error-message">{props.verificationError}</p>
          )}
        </div>
      ) : props.canVote ? (
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          {props.candidateNames.map((candidate, index) => (
            <Button
              loadingIndex={props.loadingIndex}
              setLoadingIndex={props.setLoadingIndex}
              key={index}
              asyncFunction={props.voteFunction}
              index={index}
              text={`Vote for ${candidate}`}
            />
          ))}
        </div>
      ) : (
        <p className="connected-account">You have already voted</p>
      )}

      {props.isVerified ? (
        <>
          <CalloutBox
            loadingIndex={props.loadingIndex}
            setLoadingIndex={props.setLoadingIndex}
            loadVotingReuslts={props.loadVotingReuslts}
            setIsDisabled={props.setIsDisabled}
          />
          {props.votingResults && props.votingResults.length > 0 ? (
            <>
              <ResultsTable
                candidateNames={props.candidateNames}
                votingResults={props.votingResults}
              ></ResultsTable>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default Connected;
