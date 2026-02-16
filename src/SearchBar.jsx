import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center bg-sidebarDark rounded shadow-md"
    >
      <div className="flex items-center w-full max-w-md bg-dark2 rounded">
        <button
          className="px-2 py-1 bg-transparent text-light rounded-start"
          type="submit"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-300" />
        </button>
        <input
          name="location"
          placeholder="Search for a city..."
          id="searchInput"
          className="flex-1 bg-transparent outline-none"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
