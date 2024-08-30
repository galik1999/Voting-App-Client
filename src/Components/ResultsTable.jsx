import React from "react";

function ResultsTable(props) {

  return (
    <>
      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Candidate Name</th>
            <th>Candidate Votes</th>
          </tr>
        </thead>
        <tbody>
          {props.candidateNames.map((name, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{name}</td>
              {props.votingResults &&
              props.votingResults[index] !== undefined ? (
                <td>{props.votingResults[index]}</td>
              ) : (
                <td>0</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ResultsTable;
