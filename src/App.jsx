import { useState, useEffect } from "react";
import WeatherFetcher from "./services/WeatherFetcher";
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import Header from "./components/Main/Header";
import "./styles/App.css";

const MAX_RECENTS = 5;

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentLocations")) || [];
    } catch {
      return [];
    }
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Getting the current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      () => {
        setQuery("Your Current Location");
      },
      () => console.log("Geolocation denied or failed"),
    );
  }, []);

  // Save recent locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recentLocations", JSON.stringify(recentLocations));
  }, [recentLocations]);

  // When user clicks a location in sidebar
  useEffect(() => {
    if (selectedLocation?.city) {
      setQuery(selectedLocation.city);
    }
  }, [selectedLocation]);

  return (
    <div className="d-flex vh-100">
      <LocationsSideBar
        currentLocation={currentLocation}
        recentLocations={recentLocations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onSearch={setQuery}
      />

      <main className="w-100 d-flex">
        {query && (
          <WeatherFetcher
            query={query}
            onData={(data) => {
              const locationData = {
                city: data.location.name,
                temp: data.current.temp_f,
                condition: data.current.condition.text,
                hightemp_f: data.forecast.forecastday[0].day.maxtemp_f,
                lowtemp_f: data.forecast.forecastday[0].day.mintemp_f,
                localTime: data.location.localtime,
              };

              // Update only current location
              if (query === "Your Current Location") {
                setCurrentLocation(locationData);
                setSelectedLocation(locationData);
              } else {
                // Add to recent locations, max 5, remove duplicates
                setRecentLocations((prev) => {
                  const filtered = prev.filter(
                    (loc) =>
                      loc.city.toLowerCase() !==
                      locationData.city.toLowerCase(),
                  );
                  const updated = [locationData, ...filtered];
                  return updated.slice(0, MAX_RECENTS);
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
