/**
 * Modal for confirming the deletion of a saved location.
 */

import { isoAbbreviation } from "../../utils/uiHelpers";
import { useEffect, useRef, useState } from "react";

export default function DeleteLocationModal({
  locationToDelete,
  onCancel,
  onConfirm,
}) {
  const modalRef = useRef(null);
  // remove the "show" class during animation out
  const [isAnimateOut, setIsAnimateOut] = useState(false);
  const animationClass = isAnimateOut ? "" : "show";

  // Handle smooth closing animation when Canceling or clicking outside Modal
  const handleCloseAnimation = () => {
    setIsAnimateOut(true);
    setTimeout(() => {
      onCancel();
    }, 150);
  };

  // Close the modal when clicking outside the modal-content box
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      handleCloseAnimation();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onCancel]);

  if (!locationToDelete) return null;

  return (
    <>
      <div 
        className={`modal fade ${animationClass} d-block`} 
        tabIndex="-1" 
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-slide-up" ref={modalRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Location</h5>
              <button type="button" className="btn-close" onClick={handleCloseAnimation} />
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to remove{" "}
                <strong>
                  {locationToDelete.city},{" "}
                  {isoAbbreviation(
                    locationToDelete?.fullData?.location?.country,
                    locationToDelete?.fullData?.location?.region,
                  )}
                </strong>{" "}
                from your saved locations?
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-transparent" onClick={handleCloseAnimation}>
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={() => onConfirm(locationToDelete.id)}
              >
                Remove Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* backdrop */}
      <div className={`modal-backdrop fade ${animationClass}`}></div>
    </>
  );
}
