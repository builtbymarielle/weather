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

export default function ChartCardsContainer({
  weather,
  tempUnit,
  measurementUnit,
}) {
  //   Sunrise Logic
  const sunrise = weather?.forecast?.forecastday?.[0]?.astro?.sunrise;
  let timeOnly = "";
  let amPm = "";

  if (sunrise) {
    const [time, modifier] = sunrise.split(" ");
    timeOnly = time.replace(/^0/, "");
    amPm = modifier;
  }
  //   Sunset Logic
  const sunset = weather?.forecast?.forecastday?.[0]?.astro?.sunset;
  let timeOnlySunset = "";
  let amPmSunset = "";

  if (sunset) {
    const [time, modifier] = sunset.split(" ");
    timeOnlySunset = time.replace(/^0/, "");
    amPmSunset = modifier;
  }

  //   UV Logic
  const uvrate = weather?.current.uv;
  let uvIntensity = "";

  if (uvrate >= 11) {
    uvIntensity = "Extreme";
  } else if (uvrate >= 8) {
    uvIntensity = "Very High";
  } else if (uvrate >= 6) {
    uvIntensity = "High";
  } else if (uvrate >= 3) {
    uvIntensity = "Moderate";
  } else {
    uvIntensity = "Low";
  }

  //   Feels like Logic (°F or °C)
  const feelslike_f = weather?.current.feelslike_f;
  const feelslike_c = weather?.current.feelslike_c;
  let feelslikeValue = 0;
  let feelslikeLabel = "";

  if (tempUnit === "F" && feelslike_f != null) {
    feelslikeValue = feelslike_f;
    feelslikeLabel = "°F";
  } else if (tempUnit === "C" && feelslike_c != null) {
    feelslikeValue = feelslike_c;
    feelslikeLabel = "°C";
  }

  //   Humidity Logic
  const humidity = weather?.current.humidity;

  //   Wind Logic
  const wind_mph = weather?.current.wind_mph;
  const wind_kph = weather?.current.wind_kph;
  let windValue = 0;
  let windLabel = "";
  if (measurementUnit === "standard" && wind_mph != null) {
    windValue = wind_mph;
    windLabel = "mph";
  } else if (measurementUnit === "metric" && wind_kph != null) {
    windValue = wind_kph;
    windLabel = "kph";
  }

  //   Visibility Logic
  const visibility_miles = weather?.current.vis_miles;
  const visibility_km = weather?.current.vis_km;
  let visibilityValue = 0;
  let visibilityLabel = "";
  if (measurementUnit === "standard" && visibility_miles != null) {
    visibilityValue = wind_mph;
    visibilityLabel = "miles";
  } else if (measurementUnit === "metric" && visibility_km != null) {
    visibilityValue = visibility_km;
    visibilityLabel = "km";
  }

  //   Pressure Logic
  const pressure_in = weather?.current.pressure_in;
  const pressure_mb = weather?.current.pressure_mb;
  let pressureValue = 0;
  let pressureLabel = "";
  if (measurementUnit === "standard" && pressure_in != null) {
    pressureValue = pressure_in;
    pressureLabel = "in";
  } else if (measurementUnit === "metric" && pressure_mb != null) {
    pressureValue = pressure_mb;
    pressureLabel = "mb";
  }

  // Percip Logic
  const precip_in = weather?.current.precip_in;
  const precip_mm = weather?.current.precip_mm;
  let precipValue = 0;
  let precipLabel = "";
  if (measurementUnit === "standard" && precip_in != null) {
    precipValue = precip_in;
    precipLabel = "in";
  } else if (measurementUnit === "metric" && precip_mm != null) {
    precipValue = precip_mm;
    precipLabel = "mm";
  }

  // Dew Point Logic
  const dewpoint_f = weather?.current.dewpoint_f;
  const dewpoint_c = weather?.current.dewpoint_c;
  let dewpointValue = 0;
  let dewpointLabel = "";

  if (tempUnit === "F" && dewpoint_f != null) {
    dewpointValue = dewpoint_f;
    dewpointLabel = "°F";
  } else if (tempUnit === "C" && dewpoint_c != null) {
    dewpointValue = dewpoint_c;
    dewpointLabel = "°C";
  }

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
        <ChartCard
          cardTitle={"Sunrise"}
          cardIcon={"wi-sunrise"}
          cardInfo={timeOnly}
          cardInfoSmall={amPm}
        />
        <ChartCard
          cardTitle={"Sunset"}
          cardIcon={"wi-sunset"}
          cardInfo={timeOnlySunset}
          cardInfoSmall={amPmSunset}
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
          cardInfo={feelslikeValue}
          cardInfoSmall={feelslikeLabel}
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
          cardInfo={dewpointValue}
          cardInfoSmall={dewpointLabel}
        />
      </div>
    </div>
  );
}
