import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:640px)");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false);
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profiles", path: "/listProfileCards" },
    { name: "Tasks", path: "/tasks" },
  ];

  return (
    <header id="header">
      <div className="container">
        <div className="brand">
          {isMobile && (
            <IconButton
              className="burger-btn"
              onClick={() => setMenuOpen(true)}
              sx={{ color: "var(--light-color)" }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Link to="/dashboard" className="logo">
            <h2>Taskify</h2>
          </Link>
        </div>

        <div className="navlinks desktop">
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
            <IconButton size="small" sx={{ color: "inherit", padding: 0 }}>
              <ThemeToggle />
            </IconButton>
          </Tooltip>
          {isAuthenticated && (
            <Tooltip
              title="Logout"
              placement="bottom"
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
              <button className="logout-btn" onClick={handleLogout}>
                <LogoutIcon />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {isMobile && (
        <Drawer
          anchor="left"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          PaperProps={{
            sx: { backgroundColor: "var(--lightWhite-color)", color: "var(--main-color)", width: 250 },
          }}
        >
          <div className="drawer-header">
            <IconButton
              onClick={() => setMenuOpen(false)}
              sx={{ color: "var(--main-color)", padding: 0 }}
            >
              <CloseIcon />
            </IconButton>
            <h3>Taskify</h3>
          </div>

          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </header>
  );
}

export default Navbar;
