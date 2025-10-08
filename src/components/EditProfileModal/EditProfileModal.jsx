import React, { useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../features/profiles/profileSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .trim("No leading or trailing spaces allowed")
    .strict(true)
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces")
    .matches(/^(?!.*\s{2,}).*$/, "Name cannot contain multiple spaces in a row"),
  job: yup
    .string()
    .trim("No leading or trailing spaces allowed")
    .strict(true)
    .required("Job is required")
    .min(3, "Job must be at least 3 characters")
    .max(40, "Job cannot exceed 40 characters")
    .matches(/^(?!.*\s{2,}).*$/, "Job cannot contain multiple spaces in a row"),
  phone: yup
    .string()
    .trim("No leading or trailing spaces allowed")
    .strict(true)
    .required("Phone number is required")
    .matches(
      /^\+961\s(03|01|70|71|76)\s\d{3}\s\d{3}$/,
      "Phone must be in format +961 03 XXX XXX"
    ),
  email: yup.string().email("Invalid email format"),
});

function EditProfileModal({ open, handleClose, profile }) {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: profile?.name || "",
      job: profile?.job || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      imageUrl: profile?.imageUrl || "/assets/default.png",
    },
  });

  useEffect(() => {
    reset({
      name: profile?.name || "",
      job: profile?.job || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      imageUrl: profile?.imageUrl || "/assets/default.png",
    });
  }, [profile, reset]);

  const handleChangeImage = (e) => {
    const fileName = e.target.value.split("\\").pop();
    if (fileName) {
      setValue("imageUrl", `/assets/${fileName}`);
    }
  };

  const onSubmit = (data) => {
    if (!data.imageUrl || data.imageUrl.trim() === "") {
      data.imageUrl = profile.imageUrl || "/assets/default.png";
    }
    dispatch(updateProfile({ id: profile.id, ...data }));
    handleClose();
  };


  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--white-color)",
          color: "var(--dark-color)",
          p: 4,
          borderRadius: 2,
          border: "1px solid var(--gray-300)",
          width: "90%",
          maxWidth: { xs: "95%", md: 800 },
          maxHeight: { xs: "95vh", md: "90vh" },
          overflowY: { xs: "auto", md: "visible" },
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>Edit Profile</h2>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box
            sx={{
              flex: { xs: "unset", md: "1 1 200px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <img
                  src={field.value || "/assets/default.png"}
                  alt="Profile Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/default.png";
                  }}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--gray-300)",
                  }}
                />
              )}
            />

            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "var(--main-color)",
                borderColor: "var(--gray-300)",
                "&:hover": {
                  borderColor: "var(--main-color)",
                  backgroundColor: "var(--lightWhite-color)",
                },
              }}
            >
              Choose Image
              <input
                type="file"
                hidden
                name="imageUrl"
                accept=".png,.jpg,.jpeg"
                onChange={handleChangeImage}
              />
            </Button>
          </Box>
          <Box
            sx={{
              flex: { xs: "unset", md: "2 1 400px" },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  disabled
                  sx={{
                    gridColumn: { xs: "span 1", md: "span 2" },
                    "& .MuiOutlinedInput-root.Mui-disabled": {
                      "& fieldset": { borderColor: "var(--gray-300)" },
                      backgroundColor: "var(--lightWhite-color)",
                      opacity: 1,
                    },
                    "& .MuiOutlinedInput-input.Mui-disabled": {
                      color: "var(--gray) !important",
                      WebkitTextFillColor: "var(--gray) !important",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "var(--gray) !important",
                    },
                  }}
                />
              )}
            />

            {["name", "job", "phone"].map((item) => (
              <Controller
                key={item}
                name={item}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={item.charAt(0).toUpperCase() + item.slice(1)}
                    fullWidth
                    error={!!errors[item]}
                    helperText={errors[item]?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--dark-color)",
                        "& input": { color: "var(--dark-color)" },
                        "& fieldset": { borderColor: "var(--gray-300)" },
                        "&:hover fieldset": { borderColor: "var(--main-color)" },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--main-color-alt)",
                        },
                      },
                      "& .MuiInputLabel-root": { color: "var(--gray)" },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--main-color)",
                      },
                    }}
                  />
                )}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              border: "1px solid var(--gray-300)",
              backgroundColor: "var(--lightWhite-color)",
              color: "var(--dark-color)",
              "&:hover": {
                border: "1px solid var(--main-color)",
                backgroundColor: "var(--gray-300)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--main-color)",
              "&:hover": {
                backgroundColor: "var(--main-color-alt)",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditProfileModal;
