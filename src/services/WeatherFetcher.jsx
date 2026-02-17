import { useEffect } from "react";

// This component handles fetching weather data
export default function WeatherFetcher({ query, onData, onLoading, onError }) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const abortController = new AbortController();
    const fetchWeather = async () => {
      try {
        onLoading(true);
        onError(null);

        if (!apiKey) {
          onError(
            "API key is missing. Please set VITE_WEATHER_API_KEY to your .env file.",
          );
          return;
        }

        const q = query === "Current Location" ? "auto:ip" : query;
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=1&aqi=no&alerts=no`,
          { signal: abortController.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        onData(data);
        console.log(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          onError(err.message || "Could not load weather.");
        }
      } finally {
        onLoading(false);
      }
    };

    fetchWeather();
    return () => abortController.abort();
  }, [query]);

  return null;
}
