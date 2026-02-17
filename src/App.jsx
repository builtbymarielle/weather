import { useState, useEffect } from "react";
import WeatherFetcher from "./services/WeatherFetcher";
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import Header from "./components/Main/Header";
import "./styles/App.css";

const MAX_RECENTS = 5;
const MAX_AGE = 1000 * 60 * 15; // 15 minutes

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
      return stored
        .filter((loc) => !isCurrentLocationLabel(loc?.city))
        .map((loc) => ({
          ...loc,
          needsRefresh: Date.now() - (loc.lastUpdated || 0) > MAX_AGE,
        }));
    } catch {
      return [];
    }
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Auto-refresh old recent locations
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentLocations((prev) => {
        return prev.map((loc) => {
          const isStale = Date.now() - (loc.lastUpdated || 0) > MAX_AGE;
          if (isStale) {
            refreshLocation(loc.city);
          }
          return { ...loc, needsRefresh: isStale };
        });
      });
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [recentLocations]);

  // Trigger WeatherFetcher to refresh a location
  const refreshLocation = (city) => {
    setQuery(city);
  };

  // Handle selecting a location
  const handleSelectLocation = (loc) => {
    if (!loc) return;

    if (loc.fullData && !loc.needsRefresh) {
      setSelectedLocation(loc);
      setWeather(loc.fullData);
    } else {
      setQuery(loc.city);
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
            onData={(data) => {
              const isCurrentLocation = query === "Current Location";
              const locationData = {
                city: isCurrentLocation
                  ? "Current Location"
                  : data.location.name,
                actualCityName: isCurrentLocation ? data.location.name : null,
                fullData: data,
                lastUpdated: Date.now(),
                needsRefresh: false,
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
