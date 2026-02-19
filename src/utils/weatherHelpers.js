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
 * Generate an array of weather recommendations
 * @param {string} conditionText
 * @param {number} uv - UV index
 * @param {number} highTemp - High temperature in Fahrenheit
 * @param {number} lowTemp - Low temperature in Fahrenheit
 * @returns {string} - A list of recommendations
 */

export function getRecommendations(condition, uv, highTemp, lowTemp) {
  if (!condition) return ["Have a great day!"];

  const tips = [];
  const cond = condition.toLowerCase();

  if (cond.includes("rain"))
    tips.push("Don't forget your umbrella! It's going to rain today. ");
  if (highTemp > 80)
    tips.push(
      "It's going to be a hot day. Stay hydrated and wear sunglasses. ",
    );
  if (lowTemp < 30)
    tips.push("It's going to be a cold day. Bundle up and stay warm! ");
  if (uv > 7)
    tips.push("The UV index is high. Apply sunscreen and limit time outside. ");

  if (tips.length === 0) tips.push("Have a great day! ");
  return tips;
}
