import { useState, useEffect } from "react";
import WeatherFetcher from "./services/WeatherFetcher";
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import Header from "./components/Main/Header";
import "./styles/App.css";

function App() {
  const [locations, setLocations] = useState([
    {
      city: "New York City, NY",
      temp: 70,
      condition: "Cloudy",
      hightemp_f: 75,
      lowtemp_f: 48,
      localTime: "2026-02-15 14:30",
    },
    {
      city: "Los Angeles, CA",
      temp: 85,
      condition: "Sunny",
      hightemp_f: 88,
      lowtemp_f: 65,
      localTime: "2026-02-15 11:15",
    },
    {
      city: "Chicago, IL",
      temp: 55,
      condition: "Rainy",
      hightemp_f: 58,
      lowtemp_f: 42,
      localTime: "2026-02-15 18:45",
    },
    {
      city: "Tokyo, Japan",
      temp: 82,
      condition: "Rainy",
      hightemp_f: 84,
      lowtemp_f: 72,
      localTime: "2026-02-15 03:25",
    },
  ]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [query, setQuery] = useState(selectedLocation.city);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Try to get user location on first load
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setQuery(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => console.log("Geolocation denied or failed"),
    );
  }, []);

  // When selectedLocation changes, update query
  useEffect(() => {
    if (selectedLocation) setQuery(selectedLocation.city);
  }, [selectedLocation]);

  return (
    <div className="d-flex vh-100">
      <LocationsSideBar
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onAddLocation={(loc) => setLocations([...locations, loc])}
        onSearch={setQuery}
      />
      <main className="w-100 d-flex">
        <WeatherFetcher
          query={query}
          onData={setWeather}
          onLoading={setLoading}
          onError={setError}
        />
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {weather && (
          <div className="container-fluid p-0 d-flex flex-column w-100">
            <Header weather={weather} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
