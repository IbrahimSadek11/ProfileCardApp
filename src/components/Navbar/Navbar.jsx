import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { name: "Profiles", path: "/listProfileCards" },
    { name: "Tasks", path: "/tasks" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header id="header">
      <div className="container">
        <Link to="/dashboard">
          <h2>Taskify</h2>
        </Link>

        <div className="navlinks">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="user-actions">
          <Tooltip
            title="Toggle theme"
            placement="bottom"
            disableInteractive
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
                sx: {
                  color: "var(--dark-color)",
                },
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                color: "inherit",
                padding: 0,
                width: "auto",
                height: "auto",
              }}
            >
              <ThemeToggle />
            </IconButton>
          </Tooltip>

          {isAuthenticated && (
            <Tooltip
              title="Logout"
              placement="bottom"
              disableInteractive
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
                  sx: {
                    color: "var(--dark-color)",
                  },
                },
              }}
            >
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{
                  color: "inherit",
                  padding: 0,
                  width: "auto",
                  height: "auto",
                }}
              >
                <LogoutIcon
                  className="logout-icon"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { color: "var(--main-color)" },
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
