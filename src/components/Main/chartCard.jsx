/**
 * ChartCard Component
 *
 * A reusable card component that displays a single piece of weather or
 * chart-related information, such as temperature, humidity, wind, or sunrise/sunset.
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChartCard({
  cardTitle,
  cardIcon,
  iconColor,
  cardInfo,
  cardInfoSmall,
}) {
  return (
    <div className="col p-1">
      <div className="card col">
        <div className="card-body">
          <h6 className=" d-flex">
            <div className="me-2">
              {typeof cardIcon === "string" ? (
                <i
                  className={`wi ${cardIcon}`}
                  style={{ color: iconColor }}
                ></i>
              ) : (
                <FontAwesomeIcon icon={cardIcon} style={{ color: iconColor }} />
              )}
            </div>
            <span>
              <small>{cardTitle}</small>
            </span>
          </h6>
          <p className="card-text">
            <strong className="display-6 fw-semibold">{cardInfo}</strong>
            <small>{cardInfoSmall}</small>
          </p>
        </div>
      </div>
    </div>
  );
}
