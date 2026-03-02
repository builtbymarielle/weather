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
import styles from "./Main.module.css";
import {
  getWeatherIconClass,
  getRecommendations,
} from "../../utils/weatherHelpers";
import { isoAbbreviation } from "../../utils/uiHelpers";

export default function Header({
  weather,
  tempUnit,
  isCurrent,
  locationDisplayName,
  time12,
}) {
  // Getting the recommendation for the weather
  const [recommendation, setRecommendation] = useState("");
  // Getting the weather icon class depending on the current condition
  const [weatherIconClass, setWeatherIconClass] = useState("");

  // For current location, prefer reverse-geocoded city name over API's neighborhood
  const locationName =
    locationDisplayName || weather?.location?.name || "Current Location";
  const currentCondition = weather.current.condition.text;
  const currentTempF = weather.current.temp_f;
  const currentTempC = weather.current.temp_c;
  let currentTempLabel = "";
  let currentTempValue = 0;

  if (tempUnit === "F" && currentTempF != null) {
    currentTempValue = currentTempF;
    currentTempLabel = "°F";
  } else if (tempUnit === "C" && currentTempC != null) {
    currentTempValue = currentTempC;
    currentTempLabel = "°C";
  }

  const highTempF = weather.forecast.forecastday[0].day.maxtemp_f;
  const highTempC = weather.forecast.forecastday[0].day.maxtemp_c;
  let highTempLabel = "";
  let highTempValue = 0;

  if (tempUnit === "F" && highTempF != null) {
    highTempValue = highTempF;
    highTempLabel = "°F";
  } else if (tempUnit === "C" && highTempC != null) {
    highTempValue = highTempC;
    highTempLabel = "°C";
  }

  const lowTempF = weather.forecast.forecastday[0].day.mintemp_f;
  const lowTempC = weather.forecast.forecastday[0].day.mintemp_c;
  let lowTempLabel = "";
  let lowTempValue = 0;

  if (tempUnit === "F" && lowTempF != null) {
    lowTempValue = lowTempF;
    lowTempLabel = "°F";
  } else if (tempUnit === "C" && lowTempC != null) {
    lowTempValue = lowTempC;
    lowTempLabel = "°C";
  }

  const uv = weather.current.uv;
  const isDay = weather.current.is_day;
  // if the location is current use arrow icon, otherwise use location dot icon
  const locationIcon = isCurrent ? faLocationArrow : faLocationDot;

  // Setting Region name as State or Country
  const country = weather?.location.country;
  const region = weather?.location.region;
  let iso = isoAbbreviation(country, region);

  // Passing the weather conditions and getting back recommendations based on that.
  useEffect(() => {
    const tips = getRecommendations(currentCondition, uv, highTempF, lowTempF);
    setRecommendation(tips);
  }, [currentCondition, highTempF, lowTempF, uv]);

  // Passing the weather conditions and getting back weather icons
  useEffect(() => {
    if (currentCondition) {
      const iconClass = getWeatherIconClass(currentCondition, isDay);
      setWeatherIconClass(iconClass);
    }
  }, [currentCondition, isDay]);

  return (
    <header className={`p-3 text-white w-100`}>
      <small>{time12}</small>
      <h2>
        <FontAwesomeIcon icon={locationIcon} className="me-2" />
        {locationName}, {iso} — {currentTempValue}
        {currentTempLabel}
      </h2>
      <p>{currentCondition?.text}</p>
      {weatherIconClass && (
        <i className={`wi ${weatherIconClass} ${styles.weatherIcon}`}></i>
      )}

      <p>
        High: {highTempValue}
        {highTempLabel} | Low: {lowTempValue}
        {lowTempLabel} | Local Time: {time12}
      </p>
      <p className={styles.recommendation}>{recommendation}</p>
    </header>
  );
}
