import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const navItems = [
    { name: "Profile", path: "/" },
    { name: "Tasks", path: "/tasks" }
  ];

  return (
    <header id="header">
      <div className="container">
        <Link to="/">
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
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
