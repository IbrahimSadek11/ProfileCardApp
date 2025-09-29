import React, { useState } from "react";
import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function ProfileCard({ id }) {
  const navigate = useNavigate();
  const { currentUser, profiles } = useSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState(false);

  const profile = profiles.find((p) => String(p.id) === String(id));
  if (!profile) return null;

  const canEdit = currentUser?.role === "admin" || String(currentUser?.id) === String(id);

  const handleClick = () => {
    navigate(`/tasks/${id}`);
  };


  return (
    <div className="profile-card classic" style={{ position: "relative" }}>
      {canEdit && (
        <Tooltip
          title="Edit Profile"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: "var(--dark-color)",
                color: "var(--white-color)",
                fontSize: "0.8rem",
              },
            },
            arrow: {
              sx: { color: "var(--dark-color)" },
            },
          }}
        >
          <IconButton
            onClick={() => setOpenModal(true)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              width: 28,
              height: 28,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent !important",
              color: "var(--white-color)",
              "&:hover": { color: "var(--gray-300)" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <div className="banner"></div>

      <div className="avatar">
        <img src={profile.image} alt={profile.name} loading="lazy" />
      </div>

      <h2 className="name">{profile.name}</h2>
      <h3 className="job">{profile.job}</h3>

      <div className="contact">
        <p>
          <i className="fa-solid fa-phone"></i> {profile.phone}
        </p>
        <p>
          <i className="fa-solid fa-envelope"></i> {profile.email}
        </p>
      </div>

      <div className="card-actions">
        {currentUser?.role === "admin" && (
          <button className="profile-btn" onClick={handleClick}>
            View Tasks
          </button>
        )}
      </div>

      {openModal && (
        <EditProfileModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          profile={profile}
        />
      )}
    </div>
  );
}

export default ProfileCard;
