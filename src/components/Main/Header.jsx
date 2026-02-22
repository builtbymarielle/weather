/**
 * Header — Main weather header for the selected location: local time, name, temp, condition, high/low, icon, and a short recommendation.
 * Receives full weather object from App; isCurrent toggles the location icon (arrow vs dot).
 */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import {
  getWeatherIconClass,
  getRecommendations,
} from "../../utils/weatherHelpers";
import {
  getBgTheme,
  getLiveTimeInZone,
  parseTimeWith12Hour,
} from "../../utils/uiHelpers";

export default function Header({
  weather,
  isCurrent,
  clockTick,
  locationDisplayName,
}) {
  // Getting the recommendation for the weather
  const [recommendation, setRecommendation] = useState("");
  // Getting the weather icon class depending on the current condition
  const [weatherIconClass, setWeatherIconClass] = useState("");

  // Getting the timezone ID and local time for the location
  const tzId = weather?.location?.tz_id;
  // If the timezone ID is not found, we use the fallback time
  const fallback = parseTimeWith12Hour(weather?.location?.localtime);
  const { hour24, time12 } = tzId ? getLiveTimeInZone(tzId) : fallback;
  // Getting the background theme for the location. This is based on the hour of day
  const bgTheme = getBgTheme(hour24, styles);

  // For current location, prefer reverse-geocoded city name over API's neighborhood
  const locationName =
    locationDisplayName || weather?.location?.name || "Current Location";
  const currentCondition = weather.current.condition.text;
  const currentTemp = weather.current.temp_f;
  const highTemp = weather.forecast.forecastday[0].day.maxtemp_f;
  const lowTemp = weather.forecast.forecastday[0].day.mintemp_f;
  const uv = weather.current.uv;
  const isDay = weather.current.is_day;
  // if the location is current use arrow icon, otherwise use location dot icon
  const locationIcon = isCurrent ? faLocationArrow : faLocationDot;

  // Passing the weather conditions and getting back recommendations based on that.
  useEffect(() => {
    const tips = getRecommendations(currentCondition, uv, highTemp, lowTemp);
    setRecommendation(tips);
  }, [currentCondition, highTemp, lowTemp, uv]);

  // Passing the weather conditions and getting back weather icons
  useEffect(() => {
    if (currentCondition) {
      const iconClass = getWeatherIconClass(currentCondition, isDay);
      setWeatherIconClass(iconClass);
    }
  }, [currentCondition, isDay]);

  return (
    <header className={`${bgTheme} p-3 text-white w-100`}>
      <small>{time12}</small>
      <h2>
        <FontAwesomeIcon icon={locationIcon} className="me-2" />
        {locationName} — {currentTemp}°F
      </h2>
      <p>{currentCondition?.text}</p>
      {weatherIconClass && (
        <i className={`wi ${weatherIconClass} ${styles.weatherIcon}`}></i>
      )}

      <p>
        High: {highTemp}°F | Low: {lowTemp}°F | Local Time: {time12}
      </p>
      <p className={styles.recommendation}>{recommendation}</p>
    </header>
  );
}
