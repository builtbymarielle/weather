import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import styles from "./Main.module.css";
import { setTempUnit } from "../../utils/uiHelpers";
import { getWeatherIconClass } from "../../utils/weatherHelpers";

export default function HourlyForecastContainer({ weather, tempUnit }) {
  const hours = weather.forecast.forecastday[0].hour;

  // Track current hour based on weather location
  const [currentHour, setCurrentHour] = useState(
    new Date(weather.location.localtime).getHours(),
  );

  useEffect(() => {
    const updateCurrentHour = () => {
      const now = new Date(weather.location.localtime);
      setCurrentHour(now.getHours());
    };

    // Update immediately
    updateCurrentHour();

    // Compute ms until next hour
    const now = new Date(weather.location.localtime);
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;

    // First timeout to sync exactly at next hour
    const timeout = setTimeout(() => {
      updateCurrentHour();

      // Then update every hour
      const interval = setInterval(updateCurrentHour, 60 * 60 * 1000);
      // Save interval so we can clear it
      window.__hourlyInterval = interval;
    }, msUntilNextHour);

    return () => {
      clearTimeout(timeout);
      clearInterval(window.__hourlyInterval);
    };
  }, [weather.location.localtime]);

  return (
    <div className="container mb-3">
      <div className={`card ${styles.glassCard} text-white d-flex`}>
        <div
          className={`card-header ${styles.cardHeaderCustom} d-flex align-items-center p-3`}
        >
          <FontAwesomeIcon icon={faCalendarDays} />
          <h6 className="ms-2 mb-0">Today's Hourly Forecast</h6>
        </div>
        <div className="card-body d-flex overflow-x-auto overflow-y-hidden gap-2">
          {hours.map((hour) => {
            const condition = hour.condition.text;
            const isDay = hour.is_day;
            const weatherIconClass = getWeatherIconClass(condition, isDay);

            const date = new Date(hour.time);
            const hourNumber = date.getHours();
            const formattedTime = date.toLocaleTimeString([], {
              hour: "numeric",
            });

            const isCurrentHour = hourNumber === currentHour;

            const hourTempF = hour.temp_f;
            const hourTempC = hour.temp_c;
            const hourTemp = setTempUnit(tempUnit, hourTempF, hourTempC);

            return (
              <div
                key={hour.time_epoch}
                className={`py-1 px-2 gap-2 rounded d-flex flex-column align-items-center justify-content-between text-nowrap ${
                  isCurrentHour ? `fw-bold ${styles.cardOutlineCustom}` : ""
                }`}
              >
                <span>{isCurrentHour ? "Now" : formattedTime}</span>
                {weatherIconClass && (
                  <i
                    className={`wi ${weatherIconClass} ${styles.weatherIcon}`}
                  ></i>
                )}
                <span>
                  {hourTemp}°{tempUnit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
