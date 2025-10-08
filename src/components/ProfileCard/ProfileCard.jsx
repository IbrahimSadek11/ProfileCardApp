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
  const { currentUser } = useSelector((state) => state.auth);
  const { profiles } = useSelector((state) => state.profiles);

  const [openModal, setOpenModal] = useState(false);

  const profile = profiles.find((p) => String(p.id) === String(id));
  if (!profile) return null;

  const canEdit =
    currentUser?.role === "admin" || String(currentUser?.id) === String(id);

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
            arrow: { sx: { color: "var(--dark-color)" } },
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
      {console.log("image:", profile)}
      <div className="avatar">
        <img
          src={
            profile.imageUrl && profile.imageUrl.trim() !== ""
              ? profile.imageUrl
              : "/assets/default.png"
          }
          alt={profile.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/default.png";
          }}
        />
      </div>

      <h2 className="name">{profile.name}</h2>
      <h3 className="job">{profile.job || "Unknown Position"}</h3>

      <div className="contact">
        <p>
          <i className="fa-solid fa-phone"></i>{" "}
          {profile.phone || "+961 00 000 000"}
        </p>
        <p>
          <i className="fa-solid fa-envelope"></i>{" "}
          {profile.email || "no-email@taskify.com"}
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
