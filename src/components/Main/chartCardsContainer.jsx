/**
 * ChartCardsContainer Component
 *
 * A container component that renders a responsive grid of `ChartCard` components,
 * each displaying a specific piece of weather information (e.g., sunrise, sunset,
 * UV index, temperature, wind, humidity, pressure, precipitation, dew point).
 *
 */
import ChartCard from "./ChartCard";
import {
  faTemperatureHalf,
  faEye,
  faWind,
  faDroplet,
  faCloudRain,
  faSun,
  faGauge,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import {
  setClockTime,
  setTempUnit,
  setMeasurementValue,
} from "../../utils/uiHelpers";

export default function ChartCardsContainer({
  weather,
  tempUnit,
  measurementUnit,
}) {
  //   Sunrise Logic
  const sunrise = weather?.forecast?.forecastday?.[0]?.astro?.sunrise;
  let [sunriseTimeOnly, sunriseAmPM] = setClockTime(sunrise);

  //   Sunset Logic
  const sunset = weather?.forecast?.forecastday?.[0]?.astro?.sunset;
  let [sunsetTimeOnly, sunsetAmPM] = setClockTime(sunset);

  //   UV Logic
  const uvrate = weather?.current.uv;
  const uvIntensity =
    uvrate >= 11
      ? "Extreme"
      : uvrate >= 8
        ? "Very High"
        : uvrate >= 6
          ? "High"
          : uvrate >= 3
            ? "Moderate"
            : "Low";

  //   Feels like Logic (°F or °C)
  const feelsLikeF = weather?.current.feelslike_f;
  const feelsLikeC = weather?.current.feelslike_c;
  let feelsLikeValue = setTempUnit(tempUnit, feelsLikeF, feelsLikeC);

  //   Humidity Logic
  const humidity = weather?.current.humidity;

  //   Wind Logic
  const wind_mph = weather?.current.wind_mph;
  const wind_kph = weather?.current.wind_kph;
  const [windValue, windLabel] = setMeasurementValue(
    measurementUnit,
    wind_mph,
    wind_kph,
    "mph",
    "kph",
  );

  //   Visibility Logic
  const visibility_miles = weather?.current.vis_miles;
  const visibility_km = weather?.current.vis_km;
  const [visibilityValue, visibilityLabel] = setMeasurementValue(
    measurementUnit,
    visibility_miles,
    visibility_km,
    "miles",
    "km",
  );

  //   Pressure Logic
  const pressure_in = weather?.current.pressure_in;
  const pressure_mb = weather?.current.pressure_mb;
  const [pressureValue, pressureLabel] = setMeasurementValue(
    measurementUnit,
    pressure_in,
    pressure_mb,
    "in",
    "mb",
  );

  // Percip Logic
  const precip_in = weather?.current.precip_in;
  const precip_mm = weather?.current.precip_mm;
  const [precipValue, precipLabel] = setMeasurementValue(
    measurementUnit,
    precip_in,
    precip_mm,
    "in",
    "mm",
  );

  // Dew Point Logic
  const dewPoinF = weather?.current.dewpoint_f;
  const dewPointC = weather?.current.dewpoint_c;
  let dewPointValue = setTempUnit(tempUnit, dewPoinF, dewPointC);

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
        <ChartCard
          cardTitle={"Sunrise"}
          cardIcon={"wi-sunrise"}
          cardInfo={sunriseTimeOnly}
          cardInfoSmall={sunriseAmPM}
        />
        <ChartCard
          cardTitle={"Sunset"}
          cardIcon={"wi-sunset"}
          cardInfo={sunsetTimeOnly}
          cardInfoSmall={sunsetAmPM}
        />
        <ChartCard
          cardTitle={"UV Index"}
          cardIcon={faSun}
          cardInfo={uvrate}
          cardInfoSmall={uvIntensity}
        />
        <ChartCard
          cardTitle={"Feels Like"}
          cardIcon={faTemperatureHalf}
          cardInfo={feelsLikeValue}
          cardInfoSmall={"°" + tempUnit}
        />
        <ChartCard
          cardTitle={"Humidity"}
          cardIcon={faCloud}
          cardInfo={humidity}
          cardInfoSmall="%"
        />
        <ChartCard
          cardTitle={"Wind"}
          cardIcon={faWind}
          cardInfo={windValue}
          cardInfoSmall={windLabel}
        />
        <ChartCard
          cardTitle={"Visibility"}
          cardIcon={faEye}
          cardInfo={visibilityValue}
          cardInfoSmall={visibilityLabel}
        />
        <ChartCard
          cardTitle={"Pressure"}
          cardIcon={faGauge}
          cardInfo={pressureValue}
          cardInfoSmall={pressureLabel}
        />
        <ChartCard
          cardTitle={"Percipitation"}
          cardIcon={faCloudRain}
          cardInfo={precipValue}
          cardInfoSmall={precipLabel}
        />
        <ChartCard
          cardTitle={"Dew Point"}
          cardIcon={faDroplet}
          cardInfo={dewPointValue}
          cardInfoSmall={"°" + tempUnit}
        />
      </div>
    </div>
  );
}
