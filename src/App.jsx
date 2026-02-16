import { useState, useEffect } from "react";
import WeatherFetcher from "./services/WeatherFetcher";
import LocationsSideBar from "./components/Sidebar/LocationsSideBar";
import "./styles/App.css";

function App() {
  const [locations, setLocations] = useState([
    {
      city: "New York City, NY",
      temp: 70,
      condition: "Cloudy",
      hightemp_f: 75,
      lowtemp_f: 48,
      clockTime: "2:30PM",
    },
    {
      city: "Los Angeles, CA",
      temp: 85,
      condition: "Sunny",
      hightemp_f: 88,
      lowtemp_f: 65,
      clockTime: "11:15AM",
    },
    {
      city: "Chicago, IL",
      temp: 55,
      condition: "Rainy",
      hightemp_f: 58,
      lowtemp_f: 42,
      clockTime: "6:45PM",
    },
    {
      city: "Tokyo, Japan",
      temp: 82,
      condition: "Rainy",
      hightemp_f: 84,
      lowtemp_f: 72,
      clockTime: "3:20AM",
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
      <main>
        <WeatherFetcher
          query={query}
          onData={setWeather}
          onLoading={setLoading}
          onError={setError}
        />
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {weather && (
          <div className="container-fluid p-3">
            <h2 className="mb-4">{weather.location.name}</h2>
            <p className="mb-2">{weather.current.condition.text}</p>
            <p className="mb-2">Temperature: {weather.current.temp_f}°F</p>
            <p className="mb-2">
              High: {weather.current.hightemp_f}°F, Low:{" "}
              {weather.current.lowtemp_f}°F
            </p>
            <p className="mb-2">Local Time: {weather.location.localtime}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
