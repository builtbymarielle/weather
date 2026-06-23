/**
 * App.jsx — Root component for the weather app.
 *
 * Flow:
 * - Sidebar shows: saved current location (from localStorage), "Use my location" button, and recent location searches.
 * - When user picks a location or searches, we set `query`. WeatherFetcher runs for that query and calls onData with API data.
 * - We store current location and recents in state; current location and recents are persisted to localStorage.
 * - Header shows weather for the currently selected location (from `weather` state).
 */

import { useState, useEffect, useRef } from "react";
import WeatherFetcher from "./services/WeatherFetcher";
import { reverseGeocodeToCity } from "./utils/weatherHelpers";
import { isoAbbreviation } from "./utils/uiHelpers";
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import "./styles/App.css";
import {
  getBgTheme,
  getLiveTimeInZone,
  parseTimeWith12Hour,
} from "./utils/uiHelpers";
import styles from "../src/components/Main/Main.module.css";
import MainContent from "./components/Main/MainContent";
import { arrayMove } from "@dnd-kit/sortable";

/** Returns true if the city label is "Current Location" (so we don't save it in recents). */
function isCurrentLocationLabel(city) {
  if (!city || typeof city !== "string") return false;
  const normalized = city.toLowerCase().trim();
  return normalized === "current location";
}

/** Creating a stable id / API query from weather data coordinates. */
function createLocationId(data) {
  const lat = data?.location?.lat;
  const lon = data?.location?.lon;
  if (lat != null && lon != null) return `${lat},${lon}`;
  return crypto.randomUUID();
}

/** Unambiguous fetch key for a saved location (coordinates, not city name). */
function getLocationFetchQuery(loc) {
  if (!loc) return "";
  if (isCurrentLocationLabel(loc.city)) return "Current Location";
  const lat = loc.fullData?.location?.lat;
  const lon = loc.fullData?.location?.lon;
  if (lat != null && lon != null) return `${lat},${lon}`;
  return loc.id ?? loc.city;
}

/** Whether two saved locations refer to the same card. */
function isSameLocation(a, b) {
  if (!a || !b) return false;
  if (a.id && b.id) return a.id === b.id;
  return a === b;
}

function App() {
  const [tempUnit, setTempUnit] = useState("F"); // °F or °C
  const handleChangeTempUnit = (unit) => {
    setTempUnit(unit);
  };

  const [measurementUnit, setMeasurementUnit] = useState("standard"); // (standard or metric)
  const handleChangeMeasurementUnit = (unit) => {
    setMeasurementUnit(unit);
  };

  // Go and get the current Location. If it is stored in the localStorage use that.
  // Else leave empty...user doesn't have a current location or hasn't triggered to get it.
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const stored = localStorage.getItem("currentLocation");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed && (parsed.city || parsed.fullData) ? parsed : null;
    } catch {
      return null;
    }
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  // Go and get users recent Locations in localStorage
  // If they don't have anything, return nothing
  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentLocations")) || [];
      return stored.filter((loc) => !isCurrentLocationLabel(loc?.city));
    } catch {
      return [];
    }
  });

  // UI, what location card is selected?
  const [selectedLocation, setSelectedLocation] = useState(null);
  // The search query
  const [query, setQuery] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [currentLocationRefreshTrigger, setCurrentLocationRefreshTrigger] =
    useState(0);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // "Use my location" button: 60s cooldown to prevent spam
  const [locationButtonDisabled, setLocationButtonDisabled] = useState(false);

  // --- Hourly refresh and clock (for cards and header) ---
  const [hourRefreshTrigger, setHourRefreshTrigger] = useState(0);
  const [clockTick, setClockTick] = useState(() => Date.now());

  // --- Refs (don't trigger re-renders; used for fresh values inside callbacks) ---
  const lastFetchedAtRef = useRef(null);
  const recentLocationsRef = useRef(recentLocations);
  const locationButtonCooldownTimeoutRef = useRef(null);
  const queryRef = useRef(query);

  // Keep ref in sync so onData always merges against latest query (avoids losing items when multiple updates run)
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // On load, show saved current location from localStorage without calling the API
  useEffect(() => {
    if (currentLocation?.fullData) {
      setSelectedLocation(currentLocation);
      setWeather(currentLocation.fullData);
    }
  }, []);

  // Keep ref in sync so onData always merges against latest list (avoids losing items when multiple updates run)
  useEffect(() => {
    recentLocationsRef.current = recentLocations;
  }, [recentLocations]);

  // Update clock time for all location cards every minute
  useEffect(() => {
    const id = setInterval(() => setClockTick(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // When user returns to tab after long absence, refresh weather if data is stale
  useEffect(() => {
    const STALE_MS = 60 * 60 * 1000;
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      setClockTick(Date.now());
      const last = lastFetchedAtRef.current;
      if (last != null && Date.now() - last > STALE_MS) {
        setHourRefreshTrigger((t) => t + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Refresh weather once per hour on the hour (this will fetch from the API)
  useEffect(() => {
    let lastTriggeredHour = -1;
    const checkAndTrigger = () => {
      const now = new Date();
      const min = now.getMinutes();
      const hour = now.getHours();
      if (min === 0 && hour !== lastTriggeredHour) {
        lastTriggeredHour = hour;
        setHourRefreshTrigger((t) => t + 1);
      }
    };
    checkAndTrigger();
    const interval = setInterval(checkAndTrigger, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * "Use my location" / "Update current location" button handler.
   * Disables the button for 60s (cooldown), gets GPS, sets query to "Current Location" and bumps refresh trigger so WeatherFetcher fetches.
   */
  const handleGetCurrentLocation = () => {
    // If the button is disabled or geolocation is not supported, return nothing
    if (locationButtonDisabled) return;
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // Else, we are getting the current location. Setting the button to disabled
    setLocationButtonDisabled(true);
    // Starting the cooldown
    if (locationButtonCooldownTimeoutRef.current) {
      clearTimeout(locationButtonCooldownTimeoutRef.current);
    }
    locationButtonCooldownTimeoutRef.current = setTimeout(() => {
      setLocationButtonDisabled(false);
      locationButtonCooldownTimeoutRef.current = null;
    }, 60 * 1000);

    // Set loading to True, there are no errors
    setGettingLocation(true);
    setError(null);
    // Setting query to "Current Location", setting refreshTrigger, and loading is done
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let formattedLat = position.coords.latitude;
        let formattedLon = position.coords.longitude;
        setLat(formattedLat);
        setLon(formattedLon);
        setQuery("Current Location");
        setCurrentLocationRefreshTrigger((t) => t + 1);
        setGettingLocation(false);
      },
      () => {
        setError(
          "Could not get your location. Check permissions or try again.",
        );
        setGettingLocation(false);
      },
    );
  };

  // Clear cooldown timeout on unmount so we don't call setState after unmount
  useEffect(() => {
    return () => {
      if (locationButtonCooldownTimeoutRef.current) {
        clearTimeout(locationButtonCooldownTimeoutRef.current);
      }
    };
  }, []);

  // Save recent locations to localStorage whenever they change (except "Current Location")
  useEffect(() => {
    const toSave = recentLocations.filter(
      (loc) => !isCurrentLocationLabel(loc?.city),
    );
    try {
      localStorage.setItem("recentLocations", JSON.stringify(toSave));
    } catch (e) {
      console.warn("Could not save recent locations to localStorage", e);
    }
  }, [recentLocations]);

  /**
   * When user clicks a location in the sidebar: set query (so WeatherFetcher runs).
   * If we already have fullData for that location, also set selected + weather so UI shows cache immediately;
   * WeatherFetcher will still run and may use cache if fresh, or refetch.
   */
  const handleSelectLocation = (loc) => {
    if (!loc) return;
    setQuery(getLocationFetchQuery(loc));
    setSelectedLocation(loc);
    const isCurrent = isCurrentLocationLabel(loc?.city);
    if (isCurrent && loc?.fullData?.location != null) {
      setLat(loc.fullData.location.lat ?? "");
      setLon(loc.fullData.location.lon ?? "");
    } else {
      setLat("");
      setLon("");
    }
    if (loc.fullData) {
      setWeather(loc.fullData);
    }
  };

  const selectedMatchesQuery =
    selectedLocation && getLocationFetchQuery(selectedLocation) === query;

  // Get the local time zone, get time, and set background theme
  const tzId = weather?.location?.tz_id;
  const fallback = parseTimeWith12Hour(weather?.location?.localtime);
  const { hour24, time12 } = tzId ? getLiveTimeInZone(tzId) : fallback;
  const isDay = weather?.current?.is_day;
  const bgTheme = getBgTheme(hour24, isDay, styles);

  // Controller for toggling the sidebar open and closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");

    if (stored === null) return true; // default open

    return JSON.parse(stored);
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const [locationToDelete, setLocationToDelete] = useState(null);

  // Deletes a location from the recent locations list and updates localStorage
  function handleDeleteLocation(id) {
    const updatedLocations = recentLocations.filter((loc) => loc.id !== id);
    setRecentLocations(updatedLocations);
    // If the selected location is the one being deleted, set the selected location to current location
    if (selectedLocation?.id === id) {
      setSelectedLocation(currentLocation);
      setWeather(currentLocation?.fullData);
      setQuery(getLocationFetchQuery(currentLocation));
    }
  }

  const onReorderRecentLocations = (oldIndex, newIndex) => {
    setRecentLocations((prev) => {
      const reordered = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem("recentLocations", JSON.stringify(reordered));
      return reordered;
    });
  };

  return (
    <div className={`${bgTheme} d-flex vh-100`}>
      <LocationsSideBar
        currentLocation={currentLocation}
        recentLocations={recentLocations}
        onDeleteLocation={(loc) => setLocationToDelete(loc)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onSearch={setQuery}
        clockTick={clockTick}
        onGetCurrentLocation={handleGetCurrentLocation}
        locationButtonDisabled={locationButtonDisabled}
        gettingLocation={gettingLocation}
        isCurrentLocationLoading={query === "Current Location" && loading}
        tempUnit={tempUnit}
        onChangeTempUnit={handleChangeTempUnit}
        measurementUnit={measurementUnit}
        onChangeMeasurementUnit={handleChangeMeasurementUnit}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        onReorderRecentLocations={onReorderRecentLocations}
      />

      <main className="w-100 d-flex overflow-hidden">
        {query && (
          <WeatherFetcher
            query={query}
            currentLocationLat={
              query === "Current Location"
                ? lat || currentLocation?.fullData?.location?.lat
                : undefined
            }
            currentLocationLon={
              query === "Current Location"
                ? lon || currentLocation?.fullData?.location?.lon
                : undefined
            }
            hourRefreshTrigger={hourRefreshTrigger}
            currentLocationRefreshTrigger={
              query === "Current Location"
                ? currentLocationRefreshTrigger
                : undefined
            }
            cachedData={
              query === "Current Location"
                ? (currentLocation?.fullData ??
                  (selectedMatchesQuery ? selectedLocation?.fullData : null))
                : selectedMatchesQuery
                  ? selectedLocation?.fullData
                  : null
            }
            cachedAt={
              query === "Current Location"
                ? (currentLocation?.lastUpdated ??
                  selectedLocation?.lastUpdated ??
                  null)
                : selectedMatchesQuery
                  ? (selectedLocation?.lastUpdated ?? null)
                  : null
            }
            onData={async (data) => {
              lastFetchedAtRef.current = Date.now();
              const fetchedForQuery = query;
              const isCurrentLocation = fetchedForQuery === "Current Location";
              // For current location, resolve lat/lon to city name (not neighborhood) via reverse geocoding
              let actualCityName = isCurrentLocation
                ? data.location.name
                : null;
              if (
                isCurrentLocation &&
                data?.location?.lat != null &&
                data?.location?.lon != null
              ) {
                const coordLat = lat || data.location.lat;
                const coordLon = lon || data.location.lon;
                const cityName = await reverseGeocodeToCity(coordLat, coordLon);
                if (cityName) actualCityName = cityName;
              }

              if (queryRef.current !== fetchedForQuery) return;

              const locationData = {
                id: isCurrentLocation
                  ? "current-location"
                  : createLocationId(data),
                city: isCurrentLocation
                  ? "Current Location"
                  : data.location.name,
                actualCityName,
                fullData: data,
                lastUpdated: Date.now(),
              };

              if (isCurrentLocation) {
                setCurrentLocation(locationData);
                setSelectedLocation(locationData);
                try {
                  localStorage.setItem(
                    "currentLocation",
                    JSON.stringify(locationData),
                  );
                } catch (e) {
                  console.warn(
                    "Could not save current location to localStorage",
                    e,
                  );
                }
              } else {
                // Merge this city into recents (update if exists, else add); Use ref so we don't lose updates when multiple onData run close together.
                const prev = recentLocationsRef.current;
                const existing = prev.find((loc) => loc.id === locationData.id);
                if (existing) {
                  locationData.id = existing.id;
                }
                const updatedList = prev.map((loc) =>
                  loc.id === locationData.id ? locationData : loc,
                );
                if (!existing) {
                  updatedList.unshift(locationData);
                }
                recentLocationsRef.current = updatedList;
                setRecentLocations(updatedList);

                setSelectedLocation(locationData);
                if (queryRef.current === fetchedForQuery) {
                  setQuery(getLocationFetchQuery(locationData));
                }
              }

              setWeather(data);
            }}
            onLoading={setLoading}
            onError={setError}
          />
        )}

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {weather && (
          <MainContent
            weather={weather}
            tempUnit={tempUnit}
            measurementUnit={measurementUnit}
            isCurrent={isSameLocation(selectedLocation, currentLocation)}
            clockTick={clockTick}
            locationDisplayName={
              isSameLocation(selectedLocation, currentLocation)
                ? selectedLocation?.actualCityName
                : undefined
            }
            time12={time12}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
        )}

        {locationToDelete && (
          <>
            <div className="modal fade show d-flex" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-slide-up">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delete Location</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setLocationToDelete(null)}
                    />
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
                    <button
                      className="btn btn-transparent"
                      onClick={() => setLocationToDelete(null)}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleDeleteLocation(locationToDelete.id);
                        setLocationToDelete(null);
                      }}
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
        )}
      </main>
    </div>
  );
}

export default App;
