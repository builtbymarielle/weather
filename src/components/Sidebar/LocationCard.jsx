/**
 * LocationCard — One card in the sidebar: city name, local time, temp, condition, high/low.
 * Used for both "current location" (Favorites) and recent locations. Needs fullData for full display; otherwise shows "No weather data".
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";
import {
  getBgTheme,
  getLiveTimeInZone,
  parseTimeWith12Hour,
  isoAbbreviation,
  setTempUnit,
} from "../../utils/uiHelpers";

export default function LocationCard({
  city,
  actualCityName,
  selected,
  isCurrent,
  fullData,
  tempUnit,
}) {
  // Getting the timezone ID and local time for the location
  const tzId = fullData?.location?.tz_id;
  // If the timezone ID is not found, we use the fallback time
  const fallback = parseTimeWith12Hour(fullData?.location?.localtime);
  const { hour24, time12 } = tzId ? getLiveTimeInZone(tzId) : fallback;
  // Getting the background theme for the location. This is based on the hour of day
  const bgTheme = getBgTheme(hour24, styles);

  // if the location is current use arrow icon, otherwise use location dot icon
  const locationIcon = isCurrent ? faLocationArrow : faLocationDot;
  // the current location card shows "Current Location" and in small text the city name
  const showBoth = isCurrent && actualCityName;

  // Setting Region name as State or Country
  const country = fullData?.location.country;
  const region = fullData?.location.region;
  let iso = isoAbbreviation(country, region);

  const lowTempF = fullData.forecast?.forecastday?.[0]?.day?.mintemp_f;
  const lowTempC = fullData.forecast?.forecastday?.[0]?.day?.mintemp_c;
  let lowTempValue = setTempUnit(tempUnit, lowTempF, lowTempC);

  const highTempF = fullData.forecast?.forecastday?.[0]?.day?.maxtemp_f;
  const highTempC = fullData.forecast?.forecastday?.[0]?.day?.maxtemp_c;
  let highTempValue = setTempUnit(tempUnit, highTempF, highTempC);

  // If the location has no weather data, we show a placeholder card
  if (!fullData?.current) {
    return (
      <div
        className={`${styles.locCard} rounded p-2 w-100 text-white opacity-75`}
      >
        <small>—</small>
        <div className="d-flex align-items-baseline">
          <FontAwesomeIcon icon={faLocationDot} className="me-1" />
          <h5 className="m-0">
            {city}, {iso}
          </h5>
        </div>
        <p className="m-0 small">No weather data</p>
      </div>
    );
  }

  // If the location has weather data, we show the card with the data!
  return (
    <div
      className={`${styles.locCard} ${bgTheme} rounded p-2 w-100 text-white ${selected ? styles.selected : ""} `}
    >
      {!selected && <div className={styles.overlay}></div>} {/* overlay */}
      <div className="d-flex justify-content-between gap-2">
        {time12 && <small>{time12}</small>}
      </div>
      <div className="d-flex flex-column align-items-baseline">
        <div className="d-flex align-items-baseline">
          <FontAwesomeIcon icon={locationIcon} className="me-1" />
          <h5 className="m-0">
            {city}
            {city !== "Current Location" ? `, ${iso}` : ""}
          </h5>{" "}
        </div>
        {showBoth && (
          <small className="m-0 ps-1">
            {actualCityName}, {iso}
          </small>
        )}
      </div>
      <h1>{fullData.current.temp_f}°F</h1>
      <div className="d-flex align-items-baseline justify-content-between">
        <p className="text-lg m-0">{fullData.current.condition?.text ?? "—"}</p>
        <p className="text-lg m-0 fw-bold">
          L:{lowTempValue ?? "—"}°{tempUnit} H:
          {highTempValue ?? "—"}°{tempUnit}
        </p>
      </div>
    </div>
  );
}
