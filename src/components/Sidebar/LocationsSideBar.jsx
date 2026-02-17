import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./LocationsSideBar.module.css";

function LocationsSideBar({
  currentLocation,
  recentLocations,
  selectedLocation,
  onSelectLocation,
  onSearch,
}) {
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
        <li className={`${styles.customTitle} sidebar-title pb-2`}>
          <FontAwesomeIcon icon={faStar} className="me-1" />
          <span>Favorites</span>
        </li>
        {currentLocation && (
          <li key={currentLocation} className="nav-item mb-2">
            <button
              className="p-0 m-0 w-100 text-left border-0 rounded bg-transparent"
              onClick={() => onSelectLocation(currentLocation)}
            >
              <LocationCard
                {...currentLocation}
                selected={selectedLocation === currentLocation}
                isCurrent={true}
              />
            </button>
          </li>
        )}

        <li className={`${styles.customTitle} sidebar-title pb-2`}>
          <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" />
          <span>Recents</span>
        </li>

        {recentLocations && recentLocations.length > 0 ? (
          recentLocations.map((loc, idx) => (
            <li key={loc.city + idx} className="nav-item mb-2">
              <button
                className="p-0 m-0 w-100 text-left border-0 rounded bg-transparent"
                onClick={() => onSelectLocation(loc)}
              >
                <LocationCard
                  {...loc}
                  selected={selectedLocation?.city === loc.city}
                  fullData={loc.fullData}
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
