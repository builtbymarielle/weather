import Header from "./Header";
import ChartCardsContainer from "./ChartCardsContainer";

export default function MainContent({
  weather,
  tempUnit,
  measurementUnit,
  isCurrent,
  clockTick,
  locationDisplayName,
  time12,
}) {
  return (
    <div className="container-fluid p-0 d-flex flex-column w-100">
      <Header
        weather={weather}
        tempUnit={tempUnit}
        isCurrent={isCurrent}
        clockTick={clockTick}
        locationDisplayName={locationDisplayName}
        time12={time12}
      />
      <ChartCardsContainer
        weather={weather}
        tempUnit={tempUnit}
        measurementUnit={measurementUnit}
      />
    </div>
  );
}
