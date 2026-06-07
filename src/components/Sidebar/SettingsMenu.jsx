import { useState, useEffect, useRef } from "react";
import Dropdown from "bootstrap/js/dist/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";

export default function SettingsMenu({
  tempUnit,
  measurementUnit,
  onChangeTempUnit,
  onChangeMeasurementUnit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [spin, setSpin] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const handleToggle = (e) => {
    e.preventDefault();
    if (!dropdownRef.current) return;
    const toggle = dropdownRef.current.querySelector(
      '[data-bs-toggle="dropdown"]',
    );
    if (!toggle) return;
    const inst = Dropdown.getInstance(toggle) || new Dropdown(toggle);
    inst.toggle();
    setIsOpen((prev) => !prev);
    setSpin(true);
  };

  // Remove spin class after animation ends
  useEffect(() => {
    if (spin) {
      const timer = setTimeout(() => setSpin(false), 300);
      return () => clearTimeout(timer);
    }
  }, [spin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (isOpen && !dropdownRef.current.contains(e.target)) {
        const toggle = dropdownRef.current.querySelector(
          '[data-bs-toggle="dropdown"]',
        );
        if (toggle) {
          const inst = Dropdown.getInstance(toggle) || new Dropdown(toggle);
          inst.hide();
        }
        setIsOpen(false);
        setSpin(true);
      }
    };

    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="dropdown" data-bs-auto-close="outside">
      <button
        className={`border-0 ${styles.settingsBtn} ${
          isOpen ? styles.activeBtn : ""
        }`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <FontAwesomeIcon icon={faGear} className={spin ? styles.spin : ""} />
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <h6 className="dropdown-header">Temperature Units</h6>
        </li>

        <li>
          <button
            className={`${styles.customDropdownItem} ${
              tempUnit === "C" ? styles.active : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeTempUnit("C");
            }}
          >
            {tempUnit === "C" && <FontAwesomeIcon icon={faCheck} />}
            <span className="ms-2">°C (Celsius)</span>
          </button>
        </li>

        <li>
          <button
            className={`${styles.customDropdownItem} ${
              tempUnit === "F" ? styles.active : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeTempUnit("F");
            }}
          >
            {tempUnit === "F" && <FontAwesomeIcon icon={faCheck} />}
            <span className="ms-2">°F (Fahrenheit)</span>
          </button>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <h6 className="dropdown-header">Measurement Units</h6>
        </li>

        <li>
          <button
            className={`${styles.customDropdownItem} ${
              measurementUnit === "standard" ? styles.active : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeMeasurementUnit("standard");
            }}
          >
            {measurementUnit === "standard" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
            <span className="ms-2">Standard</span>
          </button>
        </li>

        <li>
          <button
            className={`${styles.customDropdownItem} ${
              measurementUnit === "metric" ? styles.active : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeMeasurementUnit("metric");
            }}
          >
            {measurementUnit === "metric" && <FontAwesomeIcon icon={faCheck} />}
            <span className="ms-2">Metric</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
