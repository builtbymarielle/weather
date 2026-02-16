import React, { useState, useEffect, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import {
  getWeatherIconClass,
  getRecommendations,
} from "../../utils/weatherHelpers";

export default function Header({ weather }) {
  const [recommendation, setRecommendation] = useState("");
  const [weatherIconClass, setWeatherIconClass] = useState("");

  const locationName = weather.location.name;
  const currentCondition = weather.current.condition.text;
  const currentTemp = weather.current.temp_f;
  const highTemp = weather.forecast.forecastday[0].day.maxtemp_f;
  const lowTemp = weather.forecast.forecastday[0].day.mintemp_f;
  const localTime = weather.location.localtime;
  const uv = weather.current.uv;
  const isDay = weather.current.is_day;

  useEffect(() => {
    const tips = getRecommendations(currentCondition, uv, highTemp, lowTemp);
    setRecommendation(tips);
  }, [currentCondition, highTemp, lowTemp, uv]);

  useEffect(() => {
    if (currentCondition) {
      const iconClass = getWeatherIconClass(currentCondition, isDay);
      setWeatherIconClass(iconClass);
    }
  }, [currentCondition, isDay]);

  return (
    <header className={styles.header}>
      <h2>
        <FontAwesomeIcon icon={faLocationDot} className="me-2" />
        {locationName} — {currentTemp}°F
      </h2>
      <p>{currentCondition?.text}</p>
      {weatherIconClass && (
        <i className={`wi ${weatherIconClass} ${styles.weatherIcon}`}></i>
      )}

      <p>
        High: {highTemp}°F | Low: {lowTemp}°F | Local Time: {localTime}
      </p>
      <p className={styles.recommendation}>{recommendation}</p>
    </header>
  );
}
