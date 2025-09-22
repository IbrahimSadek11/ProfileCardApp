import { useLocation, useNavigate } from "react-router-dom";
import "./AuthForm.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";

function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === "/signup";

  return (
    <form className="AuthForm">
      <h2 className="auth-title">
        {isSignup ? "Sign up" : "Welcome Back"}
      </h2>
      <p className="auth-subtitle">
        {isSignup
          ? "Hey enter your details to create your account"
          : "Login to access your account"}
      </p>

      {isSignup ? (
        <div className="Signup">
          <TextField
            variant="outlined"
            placeholder="Enter your name"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            type="password"
            variant="outlined"
            placeholder="Password"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            type="password"
            variant="outlined"
            placeholder="Confirm Password"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      ) : (
        <div className="Login">
          <TextField
            variant="outlined"
            placeholder="Email Address"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            type="password"
            variant="outlined"
            placeholder="Password"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      )}

      <Button
        type="submit"
        variant="contained"
        className="submit-btn"
        fullWidth
      >
        {isSignup ? "Sign Up" : "Login"}
      </Button>

      <p className="auth-footer">
        {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
        <span onClick={() => navigate(isSignup ? "/login" : "/signup")}>
          {isSignup ? "Sign in" : "Sign up"}
        </span>
      </p>
    </form>
  );
}

export default AuthForm;
