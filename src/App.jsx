import { useState, useEffect } from "react";
import "weather-icons/css/weather-icons.css";
import WeatherFetcher from "./WeatherFetcher";

function App() {
  const [query, setQuery] = useState("London");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const location = formData.get("location");
    if (location) setQuery(location);
    e.target.reset();
  };

  // Try to get user location on first load
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setQuery(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => console.log("Geolocation denied or failed"),
    );
  }, []);

  return (
    <div>
      {/* WeatherFetcher handles the API / mock data */}
      <WeatherFetcher
        query={query}
        onData={setWeather}
        onLoading={setLoading}
        onError={setError}
      />

      <h1 className="text-4xl font-bold mb-4 text-center">Weather App</h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-8 gap-2">
        <input
          name="location"
          placeholder="Search city..."
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {weather && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-80 text-center">
            <i
              className={`wi ${
                weather.current.is_day_icon ? "wi-day-sunny" : "wi-night-clear"
              } text-7xl text-yellow-400 mb-4`}
            ></i>
            <h2 className="text-2xl font-semibold">{weather.location.name}</h2>
            <p className="text-4xl font-bold">{weather.current.temp_c}°C</p>
            <p className="text-gray-500">{weather.current.condition.text}</p>

            {/* Icon examples */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-2xl text-gray-600">
              <i className="wi wi-day-sunny"></i>
              <i className="wi wi-day-cloudy"></i>
              <i className="wi wi-day-rain"></i>
              <i className="wi wi-day-snow"></i>
              <i className="wi wi-day-thunderstorm"></i>
              <i className="wi wi-day-cloudy-windy"></i>
              <i className="wi wi-night-clear"></i>
              <i className="wi wi-night-alt-cloudy"></i>
              <i className="wi wi-night-rain"></i>
              <i className="wi wi-night-snow"></i>
              <i className="wi wi-night-thunderstorm"></i>
              <i className="wi wi-night-cloudy-windy"></i>
              <i className="wi wi-cloud"></i>
              <i className="wi wi-snow"></i>
              <i className="wi wi-fog"></i>
              <i className="wi wi-windy"></i>
              <i className="wi wi-rain"></i>
              <i className="wi wi-thunderstorm"></i>
              <i className="wi wi-cloudy-windy"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
