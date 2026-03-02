/**
 * ChartCard Component
 *
 * A reusable card component that displays a single piece of weather or
 * chart-related information, such as temperature, humidity, wind, or sunrise/sunset.
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Main.module.css";

export default function ChartCard({
  cardTitle,
  cardIcon,
  cardInfo,
  cardInfoSmall,
}) {
  return (
    <div className="col p-1">
      <div className={`card ${styles.glassCard} text-white`}>
        <div className="card-body">
          <h6 className=" d-flex">
            <div className="me-2">
              {typeof cardIcon === "string" ? (
                <i className={`wi ${cardIcon}`} style={{ color: "white" }}></i>
              ) : (
                <FontAwesomeIcon icon={cardIcon} style={{ color: "white" }} />
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
