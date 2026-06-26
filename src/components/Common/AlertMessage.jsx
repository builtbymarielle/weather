/**
 * AlertMessage
 *
 * Displays a dismissible Bootstrap alerts.
 */

import { useEffect } from "react";

export default function AlertMessage({ 
  message, 
  variant = "danger", 
  onClose,
  autoDismiss = true,
  dismissAfter = 5000,
}) {
    useEffect(() => {
      if (!message || !autoDismiss) return;

      const timer = setTimeout(() => {
        onClose?.();
      }, dismissAfter);

      return () => clearTimeout(timer);
    }, [message, autoDismiss, dismissAfter, onClose]);


    if (!message) return null;
  
    return (
      <div
        className={`app-messages alert alert-${variant} alert-dismissible fade show m-3`}
        role="alert"
      >
        {message}
  
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    );
  }