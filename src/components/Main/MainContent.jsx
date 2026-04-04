import Header from "./Header";
import ToggleSidebar from "../Sidebar/ToggleSidebar";
import ChartCardsContainer from "./ChartCardsContainer";
import HourlyForecastContainer from "./HourlyForecastContainer";
import WeeklyForecastContainer from "./WeeklyForecastContainer";

export default function MainContent({
  weather,
  tempUnit,
  measurementUnit,
  isCurrent,
  clockTick,
  locationDisplayName,
  time12,
  isSidebarOpen,
  onToggleSidebar,
}) {
  return (
    <div className="container-fluid px-0 py-2 d-flex flex-column w-100 overflow-scroll">
      {!isSidebarOpen && (
        <div className="container p-3 pt-2 pb-0 text-start">
          <ToggleSidebar
            onToggle={onToggleSidebar}
            isOpen={isSidebarOpen}
            placement="main"
          />
        </div>
      )}

      <Header
        weather={weather}
        tempUnit={tempUnit}
        isCurrent={isCurrent}
        clockTick={clockTick}
        locationDisplayName={locationDisplayName}
        time12={time12}
      />
      <HourlyForecastContainer weather={weather} tempUnit={tempUnit} />
      <WeeklyForecastContainer weather={weather} tempUnit={tempUnit} />

      <ChartCardsContainer
        weather={weather}
        tempUnit={tempUnit}
        measurementUnit={measurementUnit}
      />
    </div>
  );
}
