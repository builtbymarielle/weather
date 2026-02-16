import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

function LocationsSideBar({
  locations,
  selectedLocation,
  onSelectLocation,
  onAddLocation,
  onSearch,
}) {
  return (
    <>
      <aside className="sidebar bg-sidebarDark p-3">
        <div className="sidebar-header pb-2">
          <div className="sidebar-brand pb-2 mb-2">
            <FontAwesomeIcon icon={faLocationDot} className="me-1" />
            <span>Locations</span>
          </div>
          <SearchBar
            onSearch={(query) => {
              if (onSearch) onSearch(query);
            }}
          />
        </div>
        <ul className="sidebar-nav list-unstyled pb-2">
          <li className="sidebar-title pb-2">
            <FontAwesomeIcon icon={faStar} className="me-1" />
            <span>Favorites</span>
          </li>
          <li className="sidebar-title pb-2">
            <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" />
            <span>Recents</span>
          </li>
          {locations && locations.length > 0 ? (
            locations.map((loc, idx) => (
              <li className="nav-item mb-2">
                <button
                  key={loc.city + idx}
                  className={`p-0 m-0 w-100 text-left border-0 rounded`}
                  onClick={() => onSelectLocation(loc)}
                >
                  <LocationCard {...loc} />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No locations saved.</p>
          )}
        </ul>
      </aside>
    </>
  );
}

export default LocationsSideBar;
