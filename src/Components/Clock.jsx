import React, { useState, useEffect } from "react";

const Clock = (props) => {
  // Helper function to convert seconds to HH:MM:SS format
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const [time, setTime] = useState(parseInt(props.remainingTime));

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [time]);

  return (
    <>
      {time >= 0 ? <>Remaining Time: {formatTime(time)}</> : <>Time is up.{window.location.reload()}</>}
    </>
  );
};

export default Clock;
