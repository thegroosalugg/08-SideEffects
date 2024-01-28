import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
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
      {/* Progress bar converted to a component so the remaining code in this function does not re-execute every interval */}
      <ProgressBar timer={TIMER} />
    </div>
  );
}
