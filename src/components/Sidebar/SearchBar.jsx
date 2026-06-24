/**
 * SearchBar
 *
 * Allows users to search for a city by name.
 * As the user types, matching locations are fetched from WeatherAPI
 * and displayed as autocomplete suggestions.
 *
 * When a search is submitted or a suggestion is selected,
 * the selected location is passed to the parent component via onSearch.
 */
import { useState, useEffect } from "react";
import { searchCities } from "../../services/WeatherFetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch autocomplete suggestions whenever the search query changes.
  useEffect(() => {
    // Only fetch suggestions once the user has typed at least 3 characters.
    // This reduces unnecessary API requests and improves result quality.
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    // After 0.3s we will call to fetch the cities. This is because we don't want to fetch the API on every key stroke.
    const timeout = setTimeout(() => {
      fetchCities();
    }, 300);

    // Cancel the pending request timer if the query changes.
    return () => clearTimeout(timeout);
  }, [query]);

  /**
 * Fetch city suggestions from WeatherAPI based on the current query.
 */
  async function fetchCities() {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
  
    try {
      const cities = await searchCities(query);
      setSuggestions(cities || []);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  }

  /**
  * Handle manual form submission (e.g., pressing Enter).
  * Performs a search, then clears the input and suggestions list.
  */
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!query.trim()) return;
  
    onSearch(query.trim());
    setSuggestions([]);
    setQuery("");
  };

  /**
  * Handle selection of an autocomplete suggestion.
  * Searches for the selected location and resets the search UI.
  *
  * @param {Object} city - City object returned from WeatherAPI.
  */
  const handleSuggestionClick = (city) => {
    const location = `${city.name}, ${city.region}`;
  
    onSearch(location);
    setQuery("");
    setSuggestions([]);
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
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className={styles.searchInput}
          autoComplete="off"
        />

      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((city) => (
            <li
              key={`${city.id}-${city.lat}-${city.lon}`}
              onClick={() => handleSuggestionClick(city)}
              className={styles.suggestionItem}
            >
              {city.name}, {city.region}, {city.country}
            </li>
          ))}
        </ul>
      )}
      </div>
    </form>
  );
}