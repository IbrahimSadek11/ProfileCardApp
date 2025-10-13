import React from "react";
import './Create-Btn.css';
import { useNavigate } from "react-router-dom";

function CreateBtn(props){
  const navigate = useNavigate();
  return (
    <button className="create-btn" onClick={() => navigate(props.navigate)}>
      Assign Task <i className="fa-solid fa-plus"></i>
    </button>
  );
}

export default CreateBtn;
