import { useState } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = ["Profile", "Page1", "Page3"];

  return (
    <header id="header">
      <div className="container">
        <h2>Week 2</h2>
        <div className="navlinks">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={activeIndex === index ? "active" : ""}
              onClick={() => setActiveIndex(index)}
            >
              {item}
            </a>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
