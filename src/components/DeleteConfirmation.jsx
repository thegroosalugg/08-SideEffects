import { useState, useEffect } from "react";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => { // set interval will run a function every interval
      setRemainingTime((prevTime) => {prevTime - 10});
    }, 10);

    return () => {
      clearInterval(interval); // prevents interval running an infinite loop after the modal expires
    };
  }, []); // no dependencies so function will not run again until a new modal is rendered

  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm(); // will run 'Yes' and delete selected place after timer expires
    }, TIMER);

    return () => {
      clearTimeout(timer); // ensures timer is cleared if 'No' is selected
    };
  }, [onConfirm]); // functions passed as dependencies always change when the app is rerendered, even if the code is the same
  // use callback is required to wrap this function to prevent it

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remainingTime} max={TIMER} />
    </div>
  );
}
