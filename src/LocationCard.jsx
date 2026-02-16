import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function LocationCard({
  city,
  temp,
  condition,
  lowtemp_c,
  hightemp_c,
  clockTime,
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

  let bgTheme = "bg-day";
  if (hour >= 0 && hour < 6) bgTheme = "bg-night";
  else if (hour >= 6 && hour < 12) bgTheme = "bg-sunrise";
  else if (hour >= 12 && hour < 17) bgTheme = "bg-day";
  else if (hour >= 17 && hour < 21) bgTheme = "bg-sunset";
  else if (hour >= 21 && hour <= 24) bgTheme = "bg-night";

  return (
    <div className={"weather-card rounded p-2 w-100 text-white " + bgTheme}>
      <small>{clockTime}</small>
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faLocationDot} className="me-1" />
        <h5 className="m-0">{city}</h5>
      </div>
      <h1>{temp}°C</h1>
      <div className="d-flex align-items-center justify-content-between">
        <p className="text-lg m-0">{condition}</p>
        <p className="text-lg m-0 fw-bold">
          L:{lowtemp_c}°C H:{hightemp_c}°C
        </p>
      </div>
    </div>
  );
}
