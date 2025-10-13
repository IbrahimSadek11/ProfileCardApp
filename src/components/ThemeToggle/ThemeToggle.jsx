import { useState, useEffect } from "react";
import "./ThemeToggle.css";

function ThemeToggle({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
      {children}
    </button>
  );
}

export default ThemeToggle;
