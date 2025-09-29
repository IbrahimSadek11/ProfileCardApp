import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <section className="notfound">
        <div className="ErrorPage">
            <h1 className="notfound-title">404</h1>
            <h2 className="notfound-subtitle">Ooops!</h2>
            <p className="notfound-text">
                The page you’re looking for doesn’t exist or is unavailable.
            </p>
            <Link to="/dashboard" className="notfound-btn">
                Go Back Home
            </Link>
        </div>
    </section>
  );
}

export default NotFound;
