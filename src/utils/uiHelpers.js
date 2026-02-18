/**
 * Determine background theme class based on hour
 * @param {number} hour 0-23
 * @param {object} styles CSS Module object
 * @returns {string} background class
 */
export function getBgTheme(hour, styles) {
  if (hour >= 0 && hour < 6) return styles.bgNight;
  if (hour >= 6 && hour < 12) return styles.bgSunrise;
  if (hour >= 12 && hour < 17) return styles.bgDay;
  if (hour >= 17 && hour < 21) return styles.bgSunset;
  return styles.bgNight; // 21-24
}

/**
 * Parse a time string and return:
 * - hour in 24-hour format (0-23)
 * - formatted 12-hour time string (e.g., "1:30PM")
 * @param {string} timeStr - "YYYY-MM-DD HH:MM" or "HH:MM"
 * @returns {{ hour24: number, time12: string }}
 */
export function parseTimeWith12Hour(timeStr) {
  if (!timeStr) return { hour24: 12, time12: "12:00PM" };

  // Extract the time part if a date is included
  const timePart = timeStr.includes(" ") ? timeStr.split(" ")[1] : timeStr;
  const [hourStr, minuteStr] = timePart.split(":");

  let hour24 = parseInt(hourStr, 10);
  const minute = minuteStr ? parseInt(minuteStr, 10) : 0;

  if (isNaN(hour24)) hour24 = 12;

  // Convert to 12-hour format
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  const time12 = `${hour12}:${minute.toString().padStart(2, "0")}${period}`;

  return { hour24, time12 };
}

/**
 * Get current time in a given timezone; use for live-updating display.
 * @param {string} tzId - IANA timezone (e.g. "America/New_York")
 * @returns {{ hour24: number, time12: string }}
 */
export function getLiveTimeInZone(tzId) {
  if (!tzId) return { hour24: 12, time12: "12:00PM" };
  try {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      timeZone: tzId,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour24 = parseInt(hourStr, 10) || 12;
    const minute = parseInt(minuteStr, 10) || 0;
    const period = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const time12 = `${hour12}:${minute.toString().padStart(2, "0")}${period}`;
    return { hour24, time12 };
  } catch {
    return { hour24: 12, time12: "12:00PM" };
  }
}
