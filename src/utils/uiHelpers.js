import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

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

export const US_STATES = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

countries.registerLocale(en);
/**
 * Send back 3 letter code of country name
 * If it is USA, also send back state Code
 * @param {string} Country - "United States of America", "France"
 * @param {string} Region - "Indiana", "Île-de-France"
 * @returns {{ ISO - International Organization for Standardization: Universal Recognized Three Letter Codes }}
 */
export function isoAbbreviation(country, region) {
  let countryCode = countries.getAlpha3Code(country, "en");
  if (countryCode === "USA" && region) {
    return `${US_STATES[region]}, ${countryCode}`;
  }
  return countryCode;
}
