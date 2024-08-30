import React, { useEffect } from "react";
import ResultsTable from "./ResultsTable";
import CalloutBox from "./CalloutBox";

const Finished = (props) => {
  let finalResults;

  const calcWinner = (candidateNames, votingResults) => {
    const mapping = candidateNames.map((name, index) => {
      return { name: name, result: votingResults[index] };
    });

    mapping.sort((a, b) => {
      return b["result"] - a["result"];
    });

    if (mapping[0]["result"] > mapping[1]["result"]) {
      finalResults = [true, mapping[0]["name"]];
    } else {
      let drawers = [mapping[0]["name"]];
      for (let i = 1; i < mapping.length; i++) {
        if (mapping[i]["result"] === mapping[i - 1]["result"]) {
          drawers.push(mapping[i]["name"]);
        } else break;
      }
      finalResults = [false,drawers]
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // fetch all needed data about the voting results.
      await props.getCands();
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Voting is Finished</h1>
      <CalloutBox
        loadingIndex={props.loadingIndex}
        setLoadingIndex={props.setLoadingIndex}
        loadVotingReuslts={props.loadVotingReuslts}
        setIsDisabled={props.setIsDisabled}
      />
      {props.votingResults && props.votingResults.length > 0 ? (
        <>
        {calcWinner(props.candidateNames,props.votingResults)}
        {finalResults[0] ? <h1>The winner is {finalResults[1]}</h1> : (
        <h1>
        Its a draw between: <br/>
        {finalResults[1].join(', ')}
        </h1>
      )}
          <ResultsTable
            candidateNames={props.candidateNames}
            votingResults={props.votingResults}
          ></ResultsTable>
        </>
      ) : null}
    </div>
  );
};

export default Finished;
