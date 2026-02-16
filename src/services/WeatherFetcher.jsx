import { useEffect } from "react";

// This component handles fetching weather data
export default function WeatherFetcher({ query, onData, onLoading, onError }) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        onLoading(true);
        onError(null);

        // mock data for testing
        const mockData = {
          location: { name: query, localtime: "2024-06-01 12:00" },
          current: {
            temp_c: 18,
            condition: { text: "Sunny" },
            is_day_icon: 1,
            hightemp_c: 23,
            lowtemp_c: 15,
          },
        };

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 500));

        onData(mockData);

        // const res = await fetch(
        //   `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`,
        // );
        // if (!res.ok) throw new Error("Failed to fetch weather");
        // const data = await res.json();
        // onData(data);
        // console.log(data);
      } catch (err) {
        onError("Could not load weather.");
      } finally {
        onLoading(false);
      }
    };

    fetchWeather();
  }, [query]);

  return null;
}
