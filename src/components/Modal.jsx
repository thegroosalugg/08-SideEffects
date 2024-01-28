import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, children }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]); // the open prop is a dependency for useEffect to run more than once

  return createPortal(                  // onClose prop is required to change state if modal is closed with ESC key
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {/* children are rendered dynamically with state to ensure timer inside DeleteConfirmation doesn't execute as soon as app is ran */}
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}
