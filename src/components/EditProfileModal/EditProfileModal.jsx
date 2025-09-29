import React, { useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { updatedProfile } from "../../features/auth/authSlice";
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
      .min(2, "Job must be at least 3 characters")
      .max(40, "Job cannot exceed 40 characters")
      .matches(/^(?!.*\s{2,}).*$/, "Name cannot contain multiple spaces in a row"),
    phone: yup
      .string()
      .trim("No leading or trailing spaces allowed")
      .strict(true)
      .required("Phone number is required")
      .matches(/^\+961\s\d{2}\s\d{3}\s\d{3}$/, "Phone must be in format +961 XX XXX XXX"),
    email: yup.string().email("Invalid email format"),
  });


function EditProfileModal({ open, handleClose, profile }) {
  const dispatch = useDispatch();

  // Convert uploaded file into Base64 so it persists after refresh
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

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
      image: profile?.image || "",
    },
  });

  useEffect(() => {
    reset({
      name: profile?.name || "",
      job: profile?.job || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      image: profile?.image || "",
    });
  }, [profile, reset]);

  const handleChangeImage = async (e) => {
    if (e.target.files?.[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setValue("image", base64, { shouldValidate: false });
    }
  };

  const onSubmit = (data) => {
    dispatch(updatedProfile({ id: profile.id, changes: data }));
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
              name="image"
              control={control}
              render={({ field }) =>
                field.value ? (
                  <img
                    src={field.value}
                    alt="Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--gray-300)",
                    }}
                  />
                ) : null
              }
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
              Upload Image
              <input type="file" hidden name="image" onChange={handleChangeImage} />
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
            {["name", "job", "phone"].map((field) => (
              <Controller
                key={field}
                name={field}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    fullWidth
                    error={!!errors[field]}
                    helperText={errors[field]?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--dark-color)",
                        "& input": {
                          color: "var(--dark-color)", 
                        },
                        "& fieldset": { borderColor: "var(--gray-300)" },
                        "&:hover fieldset": { borderColor: "var(--main-color)" },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--main-color-alt)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--gray)",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--main-color)",
                      },
                    }}
                  />
                )}
              />
            ))}

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
