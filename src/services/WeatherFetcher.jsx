/**
 * WeatherFetcher — Fetches weather for the current `query` (city name or "Current Location").
 *
 * - If we have fresh cached data (same query, cachedAt within 1 hour), we call onData(cachedData) and skip the API.
 * - For "Current Location", when currentLocationRefreshTrigger > 0 we skip cache so "Update current location" always refetches.
 * - Re-runs when query, hourRefreshTrigger, or currentLocationRefreshTrigger change.
 */
import { useEffect } from "react";

const CACHE_FRESH_MS = 60 * 60 * 1000; // 1 hour — use cache, no API call

export default function WeatherFetcher({
  query,
  hourRefreshTrigger,
  currentLocationRefreshTrigger,
  cachedData,
  cachedAt,
  onData,
  onLoading,
  onError,
}) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // When user clicks on "Use my location" button, fetch the users current location
  // If the user has a current location in localStorage we update the text to "Update current location"....it does the same thing on button click
  useEffect(() => {
    // User clicked "Use my location" / "Update current location"
    const skipCacheForCurrentLocation =
      query === "Current Location" &&
      currentLocationRefreshTrigger != null &&
      currentLocationRefreshTrigger > 0;
    const useCache =
      !skipCacheForCurrentLocation &&
      cachedData &&
      cachedAt != null &&
      Date.now() - cachedAt < CACHE_FRESH_MS;

    // Here we are checking if the data is fresh,
    if (useCache) {
      onData(cachedData);
      return;
    }

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

        // "Current Location" with lat/lon → use coordinates so API returns city name; otherwise fall back to auto:ip
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
  }, [query, hourRefreshTrigger, currentLocationRefreshTrigger]);

  return null;
}
