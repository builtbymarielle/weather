/**
 * Modal for confirming the deletion of a saved location.
 */

import { isoAbbreviation } from "../../utils/uiHelpers";

export default function DeleteLocationModal({
  locationToDelete,
  onCancel,
  onConfirm,
}) {
  if (!locationToDelete) return null;

  return (
    <>
      <div className="modal fade show d-flex" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-slide-up">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Location</h5>
              <button type="button" className="btn-close" onClick={onCancel} />
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
              <button className="btn btn-transparent" onClick={onCancel}>
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
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
