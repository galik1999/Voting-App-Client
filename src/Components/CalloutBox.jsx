import React from "react";
import Button from "./Button";
import "../LoadingButton.css"; // Import the CSS file

function CalloutBox(props) {
  return (
    <div className="callout-box">
      <h2 className="callout-title">
        If you want to display the voting results - you should pay some gas
        fees.
      </h2>
      <Button
        loadingIndex={props.loadingIndex}
        setLoadingIndex={props.setLoadingIndex}
        asyncFunction={props.loadVotingReuslts}
        index={-1}
        text={"Show Results"}
      />
    </div>
  );
}

export default CalloutBox;
