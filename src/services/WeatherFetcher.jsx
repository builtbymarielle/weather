/**
 * WeatherFetcher — Fetches weather for the current `query` (city name or "Current Location").
 *
 * - If we have fresh cached data (same query, cachedAt within 1 hour), we call onData(cachedData) and skip the API.
 * - For "Current Location", when currentLocationRefreshTrigger > 0 we skip cache so "Update current location" always refetches.
 * - When hourRefreshTrigger changes (App fires on the hour or tab visible after 1h), we skip cache once so we actually refetch.
 * - Re-runs when 1. query changes, 2. hourRefreshTrigger changes, o3. currentLocationRefreshTrigger changes.
 */
import { useEffect, useRef } from "react";

const CACHE_FRESH_MS = 60 * 60 * 1000;

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
  const prevHourRefreshTriggerRef = useRef(hourRefreshTrigger);

  // When user clicks on "Use my location" button, fetch the users current location
  // If the user has a current location in localStorage we update the text to "Update current location"....it does the same thing on button click
  useEffect(() => {
    const skipCacheForCurrentLocation =
      query === "Current Location" &&
      currentLocationRefreshTrigger != null &&
      currentLocationRefreshTrigger > 0;
    
    // Skip cache when hourRefreshTrigger just changed (on-the-hour or tab-visible refresh)
    const hourTriggerJustFired = hourRefreshTrigger !== prevHourRefreshTriggerRef.current;
    if (hourTriggerJustFired) prevHourRefreshTriggerRef.current = hourRefreshTrigger;
    const skipCacheForHourRefresh = hourTriggerJustFired;

    // Use cache if we have fresh data 
    const useCache =
      !skipCacheForCurrentLocation &&
      !skipCacheForHourRefresh &&
      cachedData &&
      cachedAt != null &&
      Date.now() - cachedAt < CACHE_FRESH_MS;

    // If we have fresh data, use it
    if (useCache) {
      onData(cachedData);
      return;
    }

    // If we don't have fresh data, fetch the weather from the API
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

        // Getting the query for the API call. If the query is "Current Location" we use "auto:ip" for geolocation-based result
        const q = query === "Current Location" ? "auto:ip" : query;
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=1&aqi=no&alerts=no`,
          { signal: abortController.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        onData(data);
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
