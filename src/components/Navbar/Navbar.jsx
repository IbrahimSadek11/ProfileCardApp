import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { name: "Profiles", path: "/ListProfileCards" },
    { name: "Tasks", path: "/tasks" },
  ];

  return (
    <header id="header">
      <div className="container">
        <Link to="/ListProfileCards">
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
          >
            <div>
              <ThemeToggle />
            </div>
          </Tooltip>

          {isAuthenticated && (
            <Tooltip
              title="Logout"
              placement="bottom"
            >
              <LogoutIcon
                className="logout-icon"
                sx={{ cursor: "pointer" }}
                onClick={handleLogout}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
