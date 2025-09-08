import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const navItems = [
    { name: "Profile", path: "/" },
    { name: "Page1", path: "/page1" },
    // { name: "Page3", path: "/page3" },
  ];

  return (
    <header id="header">
      <div className="container">
        <h2>Week 2</h2>
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
