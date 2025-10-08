import SearchBar from "../SearchBar/SearchBar";
import "../SearchBar/SearchBar.css";

function Toolbar({ ArrayName, Array, onFilter }) {
  return (
    <div className="Toolbar">
      <p>
        {ArrayName}: {Array.length}
      </p>
      <SearchBar onFilter={onFilter} />
    </div>
  );
}

export default Toolbar;
