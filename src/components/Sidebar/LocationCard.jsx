import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./LocationCard.module.css";
import {
  getBgTheme,
  getLiveTimeInZone,
  parseTimeWith12Hour,
} from "../../utils/uiHelpers";

export default function LocationCard({
  city,
  actualCityName,
  selected,
  isCurrent,
  fullData,
}) {
  const tzId = fullData?.location?.tz_id;
  const fallback = parseTimeWith12Hour(fullData?.location?.localtime);

  const [liveTime, setLiveTime] = useState(() =>
    tzId ? getLiveTimeInZone(tzId) : fallback,
  );

  // Update card time every minute or when its visible
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

  const { hour24, time12 } = tzId ? liveTime : fallback;
  const bgTheme = getBgTheme(hour24, styles);

  const locationIcon = isCurrent ? faLocationArrow : faLocationDot;
  const showBoth = isCurrent && actualCityName;

  return (
    <div
      className={`${styles.locCard} ${bgTheme} rounded p-2 w-100 text-white ${selected ? styles.selected : ""} `}
    >
      {!selected && <div className={styles.overlay}></div>} {/* overlay */}
      <div className="d-flex justify-content-between gap-2">
        {time12 && <small>{time12}</small>}
      </div>
      <div className="d-flex align-items-baseline">
        <FontAwesomeIcon icon={locationIcon} className="me-1" />
        <h5 className="m-0">{city}</h5>{" "}
        {showBoth && <small className="m-0 ps-1">{actualCityName}</small>}
      </div>
      <h1>{fullData.current.temp_f}°F</h1>
      <div className="d-flex align-items-baseline justify-content-between">
        <p className="text-lg m-0">{fullData.current.condition.text}</p>
        <p className="text-lg m-0 fw-bold">
          L:{fullData.forecast.forecastday[0].day.mintemp_f}°F H:
          {fullData.forecast.forecastday[0].day.maxtemp_f}°F
        </p>
      </div>
    </div>
  );
}
