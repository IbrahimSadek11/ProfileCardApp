import "./AuthForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signup, login, clearError } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .strict(true)
    .required("Name is required")
    .matches(/\S/, "Name cannot be only spaces")
    .matches(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces")
    .matches(/^[A-Z]/, "Name must start with an uppercase letter")
    .matches(/^(?!.*\s{2,}).*$/, "Name cannot contain multiple spaces in a row")
    .min(6, "Name must be at least 6 characters")
    .max(30, "Name cannot be longer than 30 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(/^[\w.-]+@([\w-]+\.)+(com|net|org|edu)$/, "Email must end with .com, .net, .org, or .edu"),
  password: yup
    .string()
    .required("Password is required")
    .matches(/^\S+$/, "No spaces allowed")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character (@, $, !, %, *, ?, &)")
    .min(8, "Min 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email")
    .matches(/^[\w.-]+@([\w-]+\.)+(com|net|org|edu)$/,"Email must end with .com, .net, .org, or .edu"),
  password: yup.string().required("Password is required"),
});

function AuthForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    reset({ name: "", email: "", password: "", confirmPassword: "" });
  }, [isSignup, reset]);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data) => {
    if (isSignup) {
      const { name, email, password } = data;
      dispatch(signup({ name, email, password }));
    } else {
      const { email, password } = data;
      dispatch(login({ email, password }));
    }
  };

  return (
    <form className="AuthForm" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="auth-title">{isSignup ? "Sign up" : "Welcome Back"}</h2>
      <p className="auth-subtitle">
        {isSignup ? "Hey enter your details to create your account" : "Login to access your account"}
      </p>

      {isSignup ? (
        <div className="Signup">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
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
                type={showPassword ? "text" : "password"}
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
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
                type={showConfirmPassword ? "text" : "password"}
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
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
                type={showPassword ? "text" : "password"}
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
      )}

      <Button type="submit" variant="contained" className="submit-btn" fullWidth disabled={loading}>
        {loading ? (isSignup ? "Creating..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
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
