import React from "react";
import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";

function ProfileCard({ id, img, name, job, phone, email }) {

  const navigate = useNavigate();
  const handleClick = ()=> {
    navigate(`/tasks/${id}`);
  }

  return (
    <div className="profile-card classic">
      <div className="banner"></div>

      <div className="avatar">
        <img src={img} alt={`${name}`} loading="lazy" />
      </div>

      <h2 className="name">{name}</h2>
      <h3 className="job">{job}</h3>

      <div className="contact">
        <p><i className="fa-solid fa-phone"></i> {phone}</p>
        <p><i className="fa-solid fa-envelope"></i> {email}</p>
      </div>

      <button className="profile-btn" onClick={handleClick}>View Tasks</button>
    </div>
  );
}

export default ProfileCard;
