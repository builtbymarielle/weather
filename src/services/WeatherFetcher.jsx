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
          location: {
            name: query,
            region: "City of London, Greater London",
            country: "United Kingdom",
            lat: 51.52,
            lon: -0.11,
            tz_id: "Europe/London",
            localtime_epoch: 1717137600,
            localtime: "2026-02-15 12:41",
          },
          current: {
            last_updated_epoch: 1708071300,
            last_updated: "2026-02-15 12:35",
            temp_c: 18.0,
            temp_f: 48.2,
            is_day: 1,
            condition: {
              text: "Rainy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003,
            },
            wind_mph: 5.6,
            wind_kph: 9.0,
            wind_degree: 210,
            wind_dir: "SSW",
            pressure_mb: 1021.0,
            pressure_in: 30.12,
            precip_mm: 0.0,
            precip_in: 0.0,
            humidity: 72,
            cloud: 25,
            feelslike_c: 7.5,
            feelslike_f: 45.5,
            vis_km: 10.0,
            vis_miles: 6.0,
            uv: 2.0,
            gust_mph: 7.8,
            gust_kph: 12.6,
            hightemp_c: 23,
            lowtemp_c: 15,
          },
          forecast: {
            forecastday: [
              {
                date: "2026-02-15",
                date_epoch: 1707993600,
                day: {
                  maxtemp_c: 12.0,
                  maxtemp_f: 53.6,
                  mintemp_c: 5.0,
                  mintemp_f: 41.0,
                  avgtemp_c: 8.5,
                  avgtemp_f: 47.3,
                  maxwind_mph: 7.0,
                  maxwind_kph: 11.2,
                  totalprecip_mm: 0.0,
                  totalprecip_in: 0.0,
                  avgvis_km: 10.0,
                  avgvis_miles: 6.0,
                  avghumidity: 72,
                  daily_will_it_rain: 0,
                  daily_chance_of_rain: 0,
                  daily_will_it_snow: 0,
                  daily_chance_of_snow: 0,
                  condition: {
                    text: "Partly cloudy",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                    code: 1003,
                  },
                  uv: 2.0,
                },
                astro: {
                  sunrise: "06:45 AM",
                  sunset: "05:38 PM",
                  moonrise: "07:12 PM",
                  moonset: "08:42 AM",
                  moon_phase: "Waning Crescent",
                  moon_illumination: "25",
                },
                hour: [
                  {
                    time_epoch: 1707997200,
                    time: "2026-02-15 01:00",
                    temp_c: 6.0,
                    temp_f: 42.8,
                    is_day: 0,
                    condition: {
                      text: "Clear",
                      icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
                      code: 1000,
                    },
                    wind_mph: 4.5,
                    wind_kph: 7.2,
                    wind_degree: 180,
                    wind_dir: "S",
                    pressure_mb: 1020,
                    pressure_in: 30.1,
                    precip_mm: 0.0,
                    precip_in: 0.0,
                    humidity: 80,
                    cloud: 5,
                    feelslike_c: 4.5,
                    feelslike_f: 40.1,
                    windchill_c: 4.5,
                    windchill_f: 40.1,
                    heatindex_c: 6.0,
                    heatindex_f: 42.8,
                    dewpoint_c: 2.5,
                    dewpoint_f: 36.5,
                    will_it_rain: 0,
                    chance_of_rain: 0,
                    will_it_snow: 0,
                    chance_of_snow: 0,
                    vis_km: 10,
                    vis_miles: 6,
                    gust_mph: 6.0,
                    gust_kph: 9.6,
                    uv: 0.0,
                  },
                ],
              },
            ],
          },
        };

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 500));

        onData(mockData);

        // const res = await fetch(
        //   `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}`,
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
