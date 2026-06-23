/**
 * LocationsSideBar — Left sidebar with search, "Use my location" button, current location card, and recent location cards.
 * All location data and handlers come from App.jsx
 * The recent locations are wrapped in DndContext and SortableContext from dnd-kit to allow drag-and-drop reordering.
 * Each recent location is rendered as a SortableLocationItem, which is a wrapper around LocationCard that adds
 * the drag-and-drop functionality.
 */
import SearchBar from "./SearchBar";
import LocationCard from "./LocationCard";
import SettingsMenu from "./SettingsMenu";
import ToggleSidebar from "./ToggleSidebar";
import SortableLocationItem from "./SortableLocationItem";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  onDeleteLocation,
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
  isSidebarOpen,
  onToggleSidebar,
  onReorderRecentLocations,
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  return (
    <aside
      className={`${styles.sidebar} ${isSidebarOpen ? "p-3" : ""} ${
        !isSidebarOpen ? styles.sidebarClosed : ""
      }`}
    >
      <div className="sidebar-header pb-2">
        <div
          className={`${styles.customBrand} sidebar-brand pb-2 mb-2 justify-content-between align-items-center d-flex`}
        >
          <div>
            <FontAwesomeIcon icon={faLocationDot} className="me-1" />
            <span>Locations</span>
          </div>
          {isSidebarOpen && (
            <ToggleSidebar onToggle={onToggleSidebar} isOpen={isSidebarOpen} />
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center gap-2">
          <SearchBar onSearch={(query) => onSearch(query)} />
          <SettingsMenu
            tempUnit={tempUnit}
            measurementUnit={measurementUnit}
            onChangeTempUnit={onChangeTempUnit}
            onChangeMeasurementUnit={onChangeMeasurementUnit}
          />
        </div>
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
                selected={
                  !!currentLocation &&
                  selectedLocation?.id === currentLocation?.id
                }
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

        <li className={`${styles.customTitle} sidebar-title pb-2`}>
          <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" />
          <span>Recents</span>
        </li>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;

            if (!over || active.id === over.id) return;

            const oldIndex = recentLocations.findIndex(
              (item) => item.id === active.id,
            );

            const newIndex = recentLocations.findIndex(
              (item) => item.id === over.id,
            );

            onReorderRecentLocations(oldIndex, newIndex);
          }}
        >
          <SortableContext
            items={recentLocations.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {recentLocations
              .filter(
                (loc) =>
                  loc?.city?.toLowerCase()?.trim() !== "current location",
              )
              .map((loc) => (
                <SortableLocationItem
                  key={loc.id}
                  loc={loc}
                  selected={selectedLocation?.id === loc.id}
                  onSelectLocation={onSelectLocation}
                  onDeleteLocation={onDeleteLocation}
                  tempUnit={tempUnit}
                  clockTick={clockTick}
                />
              ))}
          </SortableContext>
        </DndContext>
      </ul>
    </aside>
  );
}

export default LocationsSideBar;
