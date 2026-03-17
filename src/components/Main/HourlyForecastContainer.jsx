import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import styles from "./Main.module.css";
import { setTempUnit } from "../../utils/uiHelpers";
import { getWeatherIconClass } from "../../utils/weatherHelpers";

export default function HourlyForecastContainer({ weather, tempUnit }) {
  const hours = weather.forecast.forecastday[0].hour;
  const currentHour = new Date().getHours();

  return (
    <div className="container">
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
            const [weatherIconClass, setWeatherIconClass] = useState("");

            // Passing the weather conditions and getting back weather icons
            useEffect(() => {
              if (condition) {
                const iconClass = getWeatherIconClass(condition, isDay);
                setWeatherIconClass(iconClass);
              }
            }, [condition, isDay]);

            const date = new Date(hour.time);
            const hourNumber = date.getHours();
            // Setting date to Hour time (12-hour AM, PM)
            const formattedTime = date.toLocaleTimeString([], {
              hour: "numeric",
            });

            // Getting the current hour and Bolding it
            const isCurrentHour = hourNumber === currentHour;

            // Getting the hourly temperature. Changes to tempUnit (F or C)
            const hourTempF = hour.temp_f;
            const hourTempC = hour.temp_c;
            let hourTemp = setTempUnit(tempUnit, hourTempF, hourTempC);

            return (
              <div
                key={hour.time_epoch}
                className={`py-1 px-2 gap-2 rounded d-flex flex-column align-items-center justify-content-between text-nowrap ${isCurrentHour ? `fw-bold ${styles.cardOutlineCustom}` : ""}`}
              >
                <span>{formattedTime}</span>
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
