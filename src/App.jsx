import { useState, useEffect, useRef } from "react";
import WeatherFetcher from "./services/WeatherFetcher";
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import Header from "./components/Main/Header";
import "./styles/App.css";

const MAX_RECENTS = 5;

// Prevent storing "Current Location" in recents
function isCurrentLocationLabel(city) {
  if (!city || typeof city !== "string") return false;
  const normalized = city.toLowerCase().trim();
  return normalized === "current location";
}

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentLocations")) || [];
      return stored.filter((loc) => !isCurrentLocationLabel(loc?.city));
    } catch {
      return [];
    }
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hourRefreshTrigger, setHourRefreshTrigger] = useState(0);
  const lastFetchedAtRef = useRef(null);

  // When user returns to tab after long absence, refresh weather if data is stale
  useEffect(() => {
    const STALE_MS = 60 * 60 * 1000; // 1 hour
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const last = lastFetchedAtRef.current;
      if (last != null && Date.now() - last > STALE_MS) {
        setHourRefreshTrigger((t) => t + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Refresh weather once per hour on the hour (card content: temp, condition, etc.)
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

  // Get current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      () => setQuery("Current Location"),
      () => console.log("Geolocation denied or failed"),
    );
  }, []);

  // Save recent locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recentLocations", JSON.stringify(recentLocations));
  }, [recentLocations]);

  // Handle selecting a location: show cached data if available, then refresh in background
  const handleSelectLocation = (loc) => {
    if (!loc) return;
    setQuery(loc.city);
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
      />

      <main className="w-100 d-flex">
        {query && (
          <WeatherFetcher
            query={query}
            hourRefreshTrigger={hourRefreshTrigger}
            cachedData={
              selectedLocation?.city === query
                ? selectedLocation?.fullData
                : null
            }
            cachedAt={
              selectedLocation?.city === query
                ? (selectedLocation?.lastUpdated ?? null)
                : null
            }
            onData={(data) => {
              lastFetchedAtRef.current = Date.now();
              const isCurrentLocation = query === "Current Location";
              const locationData = {
                city: isCurrentLocation
                  ? "Current Location"
                  : data.location.name,
                actualCityName: isCurrentLocation ? data.location.name : null,
                fullData: data,
                lastUpdated: Date.now(),
              };

              if (isCurrentLocation) {
                setCurrentLocation(locationData);
                setSelectedLocation(locationData);
              } else {
                setRecentLocations((prev) => {
                  const withoutCurrent = prev.filter(
                    (loc) => !isCurrentLocationLabel(loc?.city),
                  );

                  const updatedList = withoutCurrent.map((loc) =>
                    loc.city.toLowerCase() === locationData.city.toLowerCase()
                      ? locationData // replace old data
                      : loc,
                  );

                  // Add to recent locations, max 5, remove duplicates
                  if (
                    !updatedList.some(
                      (loc) =>
                        loc.city.toLowerCase() ===
                        locationData.city.toLowerCase(),
                    )
                  ) {
                    updatedList.unshift(locationData);
                  }

                  return updatedList.slice(0, MAX_RECENTS);
                });

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
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
