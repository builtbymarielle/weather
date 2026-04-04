import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";

/** placement: "sidebar" (dark panel) | "main" (gradient main area) */
export default function ToggleSidebar({
  onToggle,
  isOpen,
  placement = "sidebar",
}) {
  const mainClass = placement === "main" ? styles.toggleBtnMain : "";
  return (
    <button
      type="button"
      className={`${styles.toggleBtn} ${mainClass}`.trim()}
      onClick={onToggle}
    >
      {isOpen ? "Close Menu" : "Open Menu"}
      <FontAwesomeIcon icon={isOpen ? faXmark : faBars} aria-hidden />
    </button>
  );
}
