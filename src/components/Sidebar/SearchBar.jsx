import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch }) {
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
    <form onSubmit={handleSubmit} className="rounded shadow-md">
      <div className={`d-flex ${styles.bgInputDark} rounded`}>
        <button
          className="px-2 py-1 bg-transparent text-light rounded-start border-0"
          type="submit"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-300" />
        </button>
        <input
          name="location"
          placeholder="Search for a city..."
          id={`${styles.searchInput}`}
          className="w-100 bg-transparent outline-none"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
