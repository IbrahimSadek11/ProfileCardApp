import React from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

function EditProfileModal({ open, handleClose, profile, onSave }) {
  const [formData, setFormData] = React.useState(profile);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData); // pass updated data back
    handleClose();
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          maxWidth: 400,
          mx: "auto",
          mt: "10%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <h2>Edit Profile</h2>

        <TextField
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Job"
          name="job"
          value={formData.job || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email (unchangeable)"
          name="email"
          value={formData.email || ""}
          fullWidth
          disabled
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditProfileModal;
