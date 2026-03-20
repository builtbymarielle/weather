/**
 * LocationsSideBar — Left sidebar with search, "Use my location" button, current location card, and recent location cards.
 * All location data and handlers come from App.jsx
 */
import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faClockRotateLeft,
  faLocationCrosshairs,
  faEllipsis,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";

function LocationsSideBar({
  currentLocation,
  recentLocations,
  selectedLocation,
  onSelectLocation,
  onSearch,
  clockTick,
  onGetCurrentLocation,
  locationButtonDisabled,
  gettingLocation,
  isCurrentLocationLoading,
  tempUnit,
  onChangeTempUnit,
  measurementUnit,
  onChangeMeasurementUnit,
}) {
  // Button label depending on if the user is getting the location, fetching weather, or in 60s cooldown
  const locationButtonLabel = gettingLocation
    ? "Getting location…"
    : isCurrentLocationLoading
      ? "Updating…"
      : currentLocation
        ? "Update current location"
        : "Use my location";

  // The button is disabled if the user is getting the location, fetching weather, or in 60s cooldown (to prevent spamming the button)
  const isDisabled =
    locationButtonDisabled || gettingLocation || isCurrentLocationLoading;

  const isCurrentLocationCardDisabled =
    gettingLocation || isCurrentLocationLoading;

  return (
    <aside className={`sidebar ${styles.bgColor} p-3`}>
      <div className="sidebar-header pb-2">
        <div
          className={`${styles.customBrand} sidebar-brand pb-2 mb-2 justify-content-between align-items-center d-flex`}
        >
          <div>
            <FontAwesomeIcon icon={faLocationDot} className="me-1" />
            <span>Locations</span>
          </div>
          <div className="dropdown" data-bs-auto-close="outside">
            <button
              className={`rounded-circle ${styles.settingsBtn}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <h6 className="dropdown-header">Temperature Units</h6>
              </li>
              <li>
                <button
                  className={`${styles.customDropdownItem} ${tempUnit === "C" ? styles.active : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeTempUnit("C");
                  }}
                >
                  {tempUnit === "C" && <FontAwesomeIcon icon={faCheck} />}
                  <span className="ms-2">°C (Celsius)</span>
                </button>
              </li>

              <li>
                <button
                  className={`${styles.customDropdownItem} ${tempUnit === "F" ? styles.active : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeTempUnit("F");
                  }}
                >
                  {tempUnit === "F" && <FontAwesomeIcon icon={faCheck} />}
                  <span className="ms-2">°F (Fahrenheit)</span>
                </button>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <h6 className="dropdown-header">Measurement Units</h6>
              </li>
              <li>
                <button
                  className={`${styles.customDropdownItem} ${measurementUnit === "standard" ? styles.active : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeMeasurementUnit("standard");
                  }}
                >
                  {measurementUnit === "standard" && (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                  <span className="ms-2">Standard</span>
                </button>
              </li>

              <li>
                <button
                  className={`${styles.customDropdownItem} ${measurementUnit === "metric" ? styles.active : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeMeasurementUnit("metric");
                  }}
                >
                  {measurementUnit === "metric" && (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                  <span className="ms-2">Metric</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <SearchBar onSearch={(query) => onSearch(query)} />
      </div>

      <ul className="sidebar-nav list-unstyled pb-2">
        {/* Favorites: saved current location card (from localStorage or after "Use my location") */}
        <li className={`${styles.customTitle} sidebar-title pb-2`}>
          <FontAwesomeIcon icon={faStar} className="me-1" />
          <span>Favorites</span>
        </li>
        {currentLocation && (
          <li key={currentLocation} className="nav-item mb-2">
            <button
              className="p-0 m-0 w-100 text-left border-0 rounded bg-transparent"
              onClick={() => onSelectLocation(currentLocation)}
              disabled={isCurrentLocationCardDisabled}
            >
              <LocationCard
                {...currentLocation}
                selected={selectedLocation === currentLocation}
                isCurrent={true}
                tempUnit={tempUnit}
              />
            </button>
          </li>
        )}
        <li className="nav-item mb-2">
          <button
            type="button"
            className={`${styles.customLocationButton} p-0 w-100 border-0 rounded bg-transparent text-white d-flex align-items-center gap-1`}
            onClick={onGetCurrentLocation}
            disabled={isDisabled}
          >
            <FontAwesomeIcon icon={faLocationCrosshairs} className="me-1" />
            <span>{locationButtonLabel}</span>
          </button>
        </li>

        {/* Recents: last few searched cities (from App state / localStorage) */}
        <li className={`${styles.customTitle} sidebar-title pb-2`}>
          <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" />
          <span>Recents</span>
        </li>

        {recentLocations && recentLocations.length > 0 ? (
          recentLocations
            .filter(
              (loc) => loc?.city?.toLowerCase()?.trim() !== "current location",
            )
            .map((loc, idx) => (
              <li key={loc.city + idx} className="nav-item mb-2">
                <button
                  className="p-0 m-0 w-100 text-left border-0 rounded bg-transparent"
                  onClick={() => onSelectLocation(loc)}
                >
                  <LocationCard
                    {...loc}
                    selected={selectedLocation?.city === loc.city}
                    fullData={loc.fullData}
                    clockTick={clockTick}
                    tempUnit={tempUnit}
                  />
                </button>
              </li>
            ))
        ) : (
          <p className="text-white">No locations saved.</p>
        )}
      </ul>
    </aside>
  );
}

export default LocationsSideBar;
