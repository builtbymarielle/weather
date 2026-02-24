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
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import Header from "./components/Main/Header";
import "./styles/App.css";

// the max of recent location searches is 5
const MAX_RECENTS = 5;

/** Returns true if the city label is "Current Location" (so we don't save it in recents). */
function isCurrentLocationLabel(city) {
  if (!city || typeof city !== "string") return false;
  const normalized = city.toLowerCase().trim();
  return normalized === "current location";
}

function App() {
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
    setQuery(loc.city);
    const isCurrent = isCurrentLocationLabel(loc?.city);
    if (isCurrent && loc?.fullData?.location != null) {
      setLat(loc.fullData.location.lat ?? "");
      setLon(loc.fullData.location.lon ?? "");
    } else {
      setLat("");
      setLon("");
    }
    if (loc.fullData) {
      setSelectedLocation(loc);
      setWeather(loc.fullData);
    }
  };

  return (
    <div className="d-flex vh-100">
      <LocationsSideBar
        currentLocation={currentLocation}
        recentLocations={recentLocations}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onSearch={setQuery}
        clockTick={clockTick}
        onGetCurrentLocation={handleGetCurrentLocation}
        locationButtonDisabled={locationButtonDisabled}
        gettingLocation={gettingLocation}
        isCurrentLocationLoading={query === "Current Location" && loading}
      />

      <main className="w-100 d-flex">
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
                  (selectedLocation?.city === query
                    ? selectedLocation?.fullData
                    : null))
                : selectedLocation?.city === query
                  ? selectedLocation?.fullData
                  : null
            }
            cachedAt={
              query === "Current Location"
                ? (currentLocation?.lastUpdated ??
                  selectedLocation?.lastUpdated ??
                  null)
                : selectedLocation?.city === query
                  ? (selectedLocation?.lastUpdated ?? null)
                  : null
            }
            onData={async (data) => {
              lastFetchedAtRef.current = Date.now();
              const isCurrentLocation = query === "Current Location";
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
              const locationData = {
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
                // Merge this city into recents (update if exists, else add); cap at MAX_RECENTS. Use ref so we don't lose updates when multiple onData run close together.
                const prev = recentLocationsRef.current;
                const updatedList = prev.map((loc) =>
                  loc.city?.toLowerCase() === locationData.city.toLowerCase()
                    ? locationData
                    : loc,
                );
                if (
                  !updatedList.some(
                    (loc) =>
                      loc.city?.toLowerCase() ===
                      locationData.city.toLowerCase(),
                  )
                ) {
                  updatedList.unshift(locationData);
                }
                const next = updatedList.slice(0, MAX_RECENTS);
                recentLocationsRef.current = next;
                setRecentLocations(next);

                setSelectedLocation(locationData);
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
          <div className="container-fluid p-0 d-flex flex-column w-100">
            <Header
              weather={weather}
              isCurrent={selectedLocation === currentLocation}
              clockTick={clockTick}
              locationDisplayName={
                selectedLocation === currentLocation
                  ? selectedLocation?.actualCityName
                  : undefined
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
