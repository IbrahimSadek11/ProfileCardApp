import SearchBar from "../SearchBar/SearchBar";
import "../SearchBar/SearchBar.css"

function Toolbar (props) {
    return(
        <div className="Toolbar">
            <p>{props.ArrayName}: {props.Array.length}</p>
            <SearchBar onFilter={props.onFilter}  /> 
        </div>
    )
}

export default Toolbar;
