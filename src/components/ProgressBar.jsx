import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => { // set interval will run a function every interval
      setRemainingTime((prevTime) => prevTime - 10);
      console.log('interval')
    }, 10);

    return () => {
      clearInterval(interval); // prevents interval running an infinite loop after the modal expires
    };
  }, []); // no dependencies so function will not run again until a new modal is rendered

  return <progress value={remainingTime} max={timer} />
}
