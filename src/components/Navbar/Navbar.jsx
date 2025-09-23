import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get auth state
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // redirect to login or home after logout
  };

  const navItems = [
    { name: "Profile", path: "/ListProfileCards" },
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

          {/* ✅ Only show logout if logged in */}
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">
              Logout {currentUser?.name && `(${currentUser.name})`}
            </button>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
