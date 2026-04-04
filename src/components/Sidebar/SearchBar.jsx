/**
 * SearchBar — Search input for city name. On submit, calls onSearch(location) (App sets query and fetches weather).
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";

export default function SearchBar({ onSearch }) {
  // When the user submits the form, we get the location from the form data and call the onSearch function
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const location = formData.get("location");
    if (location) {
      onSearch(location);
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchField}>
        <button
          type="submit"
          className={styles.searchIconBtn}
          aria-label="Search for a city"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <input
          name="location"
          type="search"
          placeholder="Search for a city..."
          className={styles.searchInput}
          autoComplete="off"
        />
      </div>
    </form>
  );
}
