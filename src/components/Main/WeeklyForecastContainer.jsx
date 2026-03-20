/**
 * WeeklyForecast — Displays the weekly forecast. Condition, weathericon, high or low temperatures
 * Receives full weather object from App; displays temperature of every hour of day
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import styles from "./Main.module.css";
import { setTempUnit } from "../../utils/uiHelpers";
import { getWeatherIconClass } from "../../utils/weatherHelpers";

export default function WeeklyForecastContainer({ weather, tempUnit }) {
  const days = weather.forecast.forecastday;
  console.log(days);

  return (
    <div className="container mb-3">
      <div className={`card ${styles.glassCard} text-white d-flex`}>
        <div
          className={`card-header ${styles.cardHeaderCustom} d-flex align-items-center p-3`}
        >
          <FontAwesomeIcon icon={faCalendarWeek} />
          <h6 className="ms-2 mb-0">Weekly Forecast</h6>
        </div>
        <div className="card-body d-flex flex-column overflow-x-auto overflow-y-hidden gap-2">
          {days.map((day) => {
            console.log(day);
            const dayName = new Date(day.date + "T12:00:00").toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              },
            );
            const condition = day.day.condition.text;
            const weatherIconClass = getWeatherIconClass(condition, true);

            const maxTempF = day.day.maxtemp_f;
            const maxTempC = day.day.maxtemp_c;
            let maxTemp = setTempUnit(tempUnit, maxTempF, maxTempC);

            const minTempF = day.day.mintemp_f;
            const minTempC = day.day.mintemp_c;
            let minTemp = setTempUnit(tempUnit, minTempF, minTempC);

            return (
              <div
                key={day.date}
                className="weekly-day d-flex gap-2 justify-content-between align-items-center py-1"
              >
                <div className="d-flex justify-content-between align-items-center gap-2">
                  {weatherIconClass && (
                    <i
                      className={`wi ${weatherIconClass} ${styles.weatherIcon}`}
                      style={{ minWidth: "25px", textAlign: "left" }}
                    ></i>
                  )}
                  <p
                    className="m-0 fw-bold me-1"
                    style={{ minWidth: "40px", textAlign: "center" }}
                  >
                    {dayName}
                  </p>

                  <p className="m-0">{condition}</p>
                </div>
                <div className="d-flex justify-content-between gap-2">
                  <p className={`m-0 ${styles.customWhiteText}`}>
                    {minTemp}°{tempUnit}
                  </p>
                  <p className="m-0">
                    {maxTemp}°{tempUnit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
