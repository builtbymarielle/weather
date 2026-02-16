import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./LocationCard.module.css";
import { getBgTheme, parseTimeWith12Hour } from "../../utils/uiHelpers";

export default function LocationCard({
  city,
  temp,
  condition,
  lowtemp_f,
  hightemp_f,
  localTime,
  selected,
}) {
  const { hour24, time12 } = parseTimeWith12Hour(localTime);
  const bgTheme = getBgTheme(hour24, styles);

  return (
    <div
      className={`${styles.locCard} ${bgTheme} rounded p-2 w-100 text-white ${selected ? styles.selected : ""} `}
    >
      {!selected && <div className={styles.overlay}></div>} {/* overlay */}
      <small>{time12}</small>
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
