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

export default function Header({ weather, isCurrent }) {
  const [recommendation, setRecommendation] = useState("");
  const [weatherIconClass, setWeatherIconClass] = useState("");
  const tzId = weather?.location?.tz_id;
  const fallback = parseTimeWith12Hour(weather?.location?.localtime);
  const [liveTime, setLiveTime] = useState(() =>
    tzId ? getLiveTimeInZone(tzId) : fallback,
  );

  // Update header time every minute or when its visible
  useEffect(() => {
    if (!tzId) return;
    const update = () => setLiveTime(getLiveTimeInZone(tzId));
    update();
    const interval = setInterval(update, 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") update();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [tzId]);

  const locationName = weather.location.name;
  const currentCondition = weather.current.condition.text;
  const currentTemp = weather.current.temp_f;
  const highTemp = weather.forecast.forecastday[0].day.maxtemp_f;
  const lowTemp = weather.forecast.forecastday[0].day.mintemp_f;
  const uv = weather.current.uv;
  const isDay = weather.current.is_day;

  const { hour24, time12 } = tzId ? liveTime : fallback;
  const bgTheme = getBgTheme(hour24, styles);
  const locationIcon = isCurrent ? faLocationArrow : faLocationDot;

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
