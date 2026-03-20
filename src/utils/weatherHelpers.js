/**
 * Map WeatherAPI condition.text to weather-icons class
 * @param {string} conditionText - WeatherAPI condition.text
 * @param {boolean} isDay - WeatherAPI is_day (1 for day, 0 for night)
 * @returns {string} - Corresponding weather-icons class
 */

export function getWeatherIconClass(conditionText, isDay) {
  if (!conditionText) return "wi-na";
  const text = conditionText.toLowerCase();

  if (text.includes("sunny")) return "wi-day-sunny";
  if (text.includes("clear")) return isDay ? "wi-day-sunny" : "wi-night-clear";
  if (text.includes("cloud") || text.includes("overcast"))
    return isDay ? "wi-day-cloudy" : "wi-night-cloudy";
  if (text.includes("rain") || text.includes("shower"))
    return isDay ? "wi-day-rain" : "wi-night-rain";
  if (text.includes("thunder"))
    return isDay ? "wi-day-thunderstorm" : "wi-night-thunderstorm";
  if (text.includes("snow")) return isDay ? "wi-day-snow" : "wi-night-snow";
  if (text.includes("fog") || text.includes("mist"))
    return isDay ? "wi-day-fog" : "wi-night-fog";

  return "wi-na";
}

/**
 * List out the basic temp Category guidelines for (F or C) temps
 * @param {number} temp - the number of the temperature
 * @param {string} unit - is it Feriheit or Celcius
 * @returns {string} - category the temp lands on
 */
function getTempCategory(temp, unit) {
  if (unit === "F") {
    if (temp < 14) return "very_cold";
    if (temp <= 50) return "cold";
    if (temp <= 64) return "cool";
    if (temp <= 75) return "comfortable";
    if (temp <= 82) return "warm";
    if (temp <= 95) return "hot";
    return "very_hot";
  } else {
    if (temp < -10) return "very_cold";
    if (temp <= 10) return "cold";
    if (temp <= 18) return "cool";
    if (temp <= 24) return "comfortable";
    if (temp <= 28) return "warm";
    if (temp <= 35) return "hot";
    return "very_hot";
  }
}

/**
 * Generate an array of weather recommendations
 * @param {string} condition
 * @param {number} uv - UV index
 * @param {number} currentTemp - current temperature
 * @param {string} tempunit - Fahrenheit or Celcius
 * @returns {string} - A list of recommendations
 */
export function getRecommendations(condition, uv, currentTemp, tempUnit) {
  if (!condition) return ["Have a great day!"];

  const tips = [];
  const cond = condition.toLowerCase();

  const tempCategory = getTempCategory(currentTemp, tempUnit);

  if (cond.includes("rain")) {
    tips.push("Don't forget your umbrella! It's going to rain today.");
  }

  if (cond.includes("snow")) {
    tips.push("Snow is expected—drive carefully and dress warmly.");
  }

  if (cond.includes("cloud")) {
    tips.push("Cloudy skies today—perfect for a relaxed day outside.");
  }

  if (cond.includes("clear") || cond.includes("sunny")) {
    tips.push("Clear skies today—great time to be outdoors!");
  }

  switch (tempCategory) {
    case "very_hot":
      tips.push("Extreme heat. Stay indoors and hydrate often.");
      break;
    case "hot":
      tips.push("It's hot. Stay cool and drink plenty of water.");
      break;
    case "warm":
      tips.push("Warm weather. Perfect for light clothing.");
      break;
    case "cool":
      tips.push("A bit cool. Consider a light jacket.");
      break;
    case "cold":
      tips.push("Cold weather. Wear a coat and stay warm.");
      break;
    case "very_cold":
      tips.push("Freezing temperatures—bundle up.");
      break;
  }

  if (uv >= 8) {
    tips.push("Very high UV. Apply sunscreen and avoid midday sun.");
  } else if (uv >= 6) {
    tips.push("High UV. Wear sunscreen and sunglasses.");
  }

  if (tips.length === 0) tips.push("Have a great day!");

  return tips;
}

/**
 * Returns back the Location city Name from the lat and lons provided. Calls the openStreetMap API
 * @param {lat} lat
 * @param {lon} lon - UV index
 * @returns {string} - A city name
 */
export async function reverseGeocodeToCity(lat, lon) {
  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
  try {
    const res = await fetch(
      `/api-osm/reverse?lat=${latNum}&lon=${lonNum}&format=json&addressdetails=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address;
    if (!addr) return null;
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.county ||
      null
    );
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
