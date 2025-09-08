import { useState, useEffect } from "react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
    </button>
  );
}

export default ThemeToggle;
