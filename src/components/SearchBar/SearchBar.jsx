import react from "react";
import { useState } from "react";

function SearchBar ({onFilter}) {
    function filterData (e) {
        onFilter(e.target.value)
    }
    
    return (
            <div className='search'>
                <input 
                    type="text" 
                    placeholder='Search'
                    id="search-input"
                    name="search"  
                    onChange={filterData}
                    />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
    )
}

export default SearchBar;
