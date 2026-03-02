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
        <div className={`${styles.customBrand} sidebar-brand pb-2 mb-2`}>
          <FontAwesomeIcon icon={faLocationDot} className="me-1" />
          <span>Locations</span>
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
