import React from "react";
import "../LoadingButton.css";

function Button(props) {
  const { index, loadingIndex, setLoadingIndex } = props;
  const isLoading = loadingIndex === index; // Check if this button is currently loading

  return (
    <button
      disabled={loadingIndex !== null} 
      className={`loading-button ${isLoading ? "loading" : "login-button"}`}
      onClick={async () => {
        setLoadingIndex(index); 
        try {
          await props.asyncFunction(index); 
        } catch (err) {
          console.log(err);
        } finally {
          setLoadingIndex(null); 
        }
      }}
    >
      {isLoading ? <div className="spinner"></div> : `${props.text}`}
    </button>
  );
}

export default Button;
