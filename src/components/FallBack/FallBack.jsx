import React from "react";
import './FallBack.css';

function FallBack(props){
    return (
        <div className="fallback">
            <p>{props.message}</p>
        </div>
    )
}

export default FallBack;