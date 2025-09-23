import { useLocation, useNavigate } from "react-router-dom";
import "./AuthForm.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import { signup, login, clearError } from "../../features/auth/authSlice"; 
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Min 3 characters"),
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required").min(6, "Min 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const loginSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required"),
});

function AuthForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  const { isAuthenticated, error } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [isSignup, reset]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(isSignup ? "Signup successful 🎉" : "Login successful 🎉");
      navigate("/ListProfileCards");
    }
  }, [isAuthenticated, navigate, isSignup]);

  useEffect(() => {
    if (error) {
      if (error.includes("taken")) {
        toast.error("Email already registered. Please login.");
      } else {
        toast.error(error);
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data) => {
    if (isSignup) {
      dispatch(signup(data));
    } else {
      dispatch(login(data));
    }
  };

  return (
    <form className="AuthForm" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="auth-title">{isSignup ? "Sign up" : "Welcome Back"}</h2>
      <p className="auth-subtitle">
        {isSignup
          ? "Hey enter your details to create your account"
          : "Login to access your account"}
      </p>

      {isSignup ? (
        <div className="Signup">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                placeholder="Enter your name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                placeholder="Enter your email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                variant="outlined"
                placeholder="Password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                variant="outlined"
                placeholder="Confirm Password"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
      ) : (
        <div className="Login">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                placeholder="Email Address"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                variant="outlined"
                placeholder="Password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
      )}

      <Button type="submit" variant="contained" className="submit-btn" fullWidth>
        {isSignup ? "Sign Up" : "Login"}
      </Button>

      <p className="auth-footer">
        {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
        <span onClick={() => navigate(isSignup ? "/" : "/signup")}>
          {isSignup ? "Sign in" : "Sign up"}
        </span>
      </p>
    </form>
  );
}

export default AuthForm;
