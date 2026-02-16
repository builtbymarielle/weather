import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./LocationCard.module.css";

export default function LocationCard({
  city,
  temp,
  condition,
  lowtemp_f,
  hightemp_f,
  clockTime,
  selected,
}) {
  // Parse time string (e.g., "2:30PM") to 24-hour format
  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);
    if (!match) return 12; // default to noon if parsing fails

    let hour = parseInt(match[1]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour;
  };

  const hour = parseTime(clockTime);

  let bgTheme = styles.bgDay;
  if (hour >= 0 && hour < 6) bgTheme = styles.bgNight;
  else if (hour >= 6 && hour < 12) bgTheme = styles.bgSunrise;
  else if (hour >= 12 && hour < 17) bgTheme = styles.bgDay;
  else if (hour >= 17 && hour < 21) bgTheme = styles.bgSunset;
  else if (hour >= 21 && hour <= 24) bgTheme = styles.bgNight;

  return (
    <div
      className={`${styles.locCard} ${bgTheme} rounded p-2 w-100 text-white ${selected ? styles.selected : ""} `}
    >
      {!selected && <div className={styles.overlay}></div>} {/* overlay */}
      <small>{clockTime}</small>
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faLocationDot} className="me-1" />
        <h5 className="m-0">{city}</h5>
      </div>
      <h1>{temp}°F</h1>
      <div className="d-flex align-items-center justify-content-between">
        <p className="text-lg m-0">{condition}</p>
        <p className="text-lg m-0 fw-bold">
          L:{lowtemp_f}°F H:{hightemp_f}°F
        </p>
      </div>
    </div>
  );
}
